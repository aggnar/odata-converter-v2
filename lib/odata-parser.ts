import { parse } from '@sap-ux/edmx-parser';

export interface ParsedAction {
  name: string;
  method: 'POST';
  parameters: Record<string, any>;
  returnType: Record<string, any>;
}

export interface ParsedFunction {
  name: string;
  method: 'GET';
  returnType: Record<string, any>;
}

export interface ParsedResult {
  actions: ParsedAction[];
  functions: ParsedFunction[];
  entities: Record<string, any>;
  complexTypes: Record<string, any>;
}

export async function parseODataMetadata(xmlContent: string): Promise<ParsedResult> {
  const parsed = await parse(xmlContent);
  // console.log(parsed);
  const schema = parsed.schema;
  const namespace = schema.namespace;
  
  const entities: Record<string, any> = {};
  const complexTypes: Record<string, any> = {};
  const actions: ParsedAction[] = [];
  const functions: ParsedFunction[] = [];

  // Parse complex types
  schema.complexTypes?.forEach((complexType: any) => {
    const properties: Record<string, any> = {};
    
    complexType.properties?.forEach((prop: any) => {
      if (prop.type.startsWith(`${namespace}.`)) {
        const typeName = prop.type.replace(`${namespace}.`, '');
        properties[prop.name] = complexTypes[typeName] || entities[typeName] || {};
      } else if (prop.type.startsWith('Collection(')) {
        
        const typeName = prop.type.replace('Collection(', '').replace(')', '').replace(`${namespace}.`, '');
        properties[prop.name] = [entities[typeName] || complexTypes[typeName] || {}];
      } else {
        const type = prop.type.replace('Edm.', '');
        properties[prop.name] = getDefaultValue(type);
      }
    });

    complexTypes[complexType.name] = properties;
  });

  // Parse entities
  schema.entityTypes?.forEach((entityType: any) => {
    const properties: Record<string, any> = {};
  
    entityType.entityProperties?.forEach((prop: any) => {
      if (prop.type.startsWith(`${namespace}.`)) {
        const typeName = prop.type.replace(`${namespace}.`, '');
        properties[prop.name] = complexTypes[typeName] || entities[typeName] || {};
      } else {
        const type = prop.type.replace('Edm.', '');
        properties[prop.name] = getDefaultValue(type);
      }
    });

    entityType.navigationProperties?.forEach((navProp: any) => {
      const targetType = navProp.targetTypeName.replace(`${namespace}.`, '');

      if (navProp.isCollection) {
        properties[navProp.name] = [entities[targetType]];
      } else {
        properties[navProp.name] = entities[targetType];
      }
    });

    entities[entityType.name] = properties;
  });

  // Parse actions and functions
  schema.actions?.forEach((action: any) => {
    const parameters: Record<string, any> = {};
    let returnType: any = {};

    action.parameters?.forEach((param: any) => {
      // if (param.name === '_it'){
      //   return;
      // }

      if (param.type.startsWith(`${namespace}.`)) {
        const typeName = param.type.replace(`${namespace}.`, '');

        parameters[param.name] = entities[typeName] || complexTypes[typeName] || {};
      } else if (param.type.startsWith('Collection(')) {
        
        const typeName = param.type.replace('Collection(', '').replace(')', '').replace(`${namespace}.`, '');
        parameters[param.name] = [entities[typeName] || complexTypes[typeName] || {}];
      } else {
        const type = param.type.replace('Edm.', '');
        parameters[param.name] = getDefaultValue(type);
      }
    });

    if (action.returnType) {
      if (action.returnType.startsWith(`${namespace}.`)) {
        const typeName = action.returnType.replace(`${namespace}.`, '');
        returnType = entities[typeName] || complexTypes[typeName] || {};
      } else if (action.returnType.startsWith('Collection(')) {
        
        const typeName = action.returnType.replace('Collection(', '').replace(')', '').replace(`${namespace}.`, '');
        returnType = [entities[typeName] || complexTypes[typeName] || {}];
      } else {
        const type = action.returnType.replace('Edm.', '');
        returnType = getDefaultValue(type);
      }
    }

    if (action.isFunction) {
      functions.push({
        name: action.name,
        method: 'GET',
        returnType
      });
    } else {
      actions.push({
        name: action.name,
        method: 'POST',
        parameters,
        returnType
      });
    }
  });

  return { actions, functions, entities, complexTypes };
}

function getDefaultValue(edmType: string): any {
  switch (edmType) {
    case 'Int32':
    case 'Int64':
    case 'Decimal':
      return 0;
    case 'String':
      return '';
    case 'Boolean':
      return false;
    case 'DateTimeOffset':
      return new Date().toISOString();
    case 'Date':
      return new Date().toISOString().split('T')[0];
    default:
      return null;
  }
}