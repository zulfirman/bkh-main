#!/bin/bash

# Check if docker-compose exists
if command -v docker-compose &> /dev/null; then
    COMPOSE_COMMAND="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_COMMAND="docker compose"
else
    echo "Neither docker-compose nor docker compose is available. Please install one of them."
    exit 1
fi

# Run the appropriate command
$COMPOSE_COMMAND up -d --build
