# Docker Deployment

## Build and Run

```bash
# Build the Docker image
docker build -t odata-converter .

# Run the container
docker run -p 3000:3000 odata-converter
```

## Using Docker Compose

```bash
# Build and run with docker-compose
docker-compose up --build

# Run in background
docker-compose up -d --build
```

## Production Deployment

The app will be available at `http://localhost:3000`

For production, consider:
- Using a reverse proxy (nginx)
- Setting up SSL certificates
- Using environment variables for configuration