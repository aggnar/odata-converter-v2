import { NextRequest, NextResponse } from 'next/server';
import { parseODataMetadata } from '@/lib/odata-parser';

export async function POST(request: NextRequest) {
  try {
    const { metadata } = await request.json();
    
    if (!metadata) {
      return NextResponse.json({ error: 'Metadata is required' }, { status: 400 });
    }

    const result = await parseODataMetadata(metadata);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error parsing metadata:', error);
    return NextResponse.json({ error: 'Failed to parse metadata' }, { status: 500 });
  }
}