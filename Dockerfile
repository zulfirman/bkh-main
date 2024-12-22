# Use the Ubuntu 25.04 image as the base
FROM ubuntu:25.04

# Set the working directory
WORKDIR /app

# Copy the release folder into the container
COPY ./target/release /app

# Make sure the entrypoint file is executable
RUN chmod +x /app/blockmesh-cli
