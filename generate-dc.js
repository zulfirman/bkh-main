const fs = require('fs');

const generateDockerCompose = (emails) => {
    let services = `\n  blockmesh-0:
    build:
      context: .
      dockerfile: Dockerfile-js
    container_name: blockmesh-0
    environment:
      - NODE_ENV=production
    restart: "always"
    cpus: "1"
    mem_reservation: "50M"
    mem_limit: "80M"\n`;

    emails.forEach((email, index) => {
        const serviceName = `blockmesh-${index + 1}`;
        const previousService = index > 0 ? `blockmesh-${index}` : null; // Reference the previous container if it exists
        const startupDelay = index * 60

        let emailSplit=email.split(',,')
        email = emailSplit[0]
        let cookie = emailSplit[1]
        services += `
  ${serviceName}:
    image: ubuntu:25.04
    container_name: ${serviceName}
    build:
      context: .
    restart: "always"
    cpus: "1"
    mem_reservation: "50M"
    mem_limit: "70M"
    environment:
      STARTUP_DELAY: ${startupDelay}
      EMAIL: ${email.trim()}
      PASSWORD: \${PASSWORD}
    entrypoint: ["sh", "-c", "./blockmesh-cli --email ${email.trim()} --password \${PASSWORD}"]\n`;
    });
    return `services:${services}`;
};

fs.readFile('email.txt', 'utf8', (err, content) => {
    if (err) {
        console.error('Error reading email.txt:', err.message);
        return;
    }

    const emails = content.split('\n').filter(Boolean); // Remove empty lines
    const dockerComposeContent = generateDockerCompose(emails);

    fs.writeFile('docker-compose.yml', dockerComposeContent, (writeErr) => {
        if (writeErr) {
            console.error('Error writing docker-compose.yml:', writeErr.message);
            return;
        }
        console.log('docker-compose.yml has been generated successfully!');
    });
});
