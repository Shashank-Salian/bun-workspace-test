FROM mcr.microsoft.com/devcontainers/base:debian
LABEL Name=bunworkspacetest Version=0.0.1

# Update package list and install dependencies
RUN apt-get -y update && apt-get install -y \
	curl unzip zip git docker.io

# Install Bun system-wide using the official method
RUN curl -fsSL https://bun.sh/install | bash
RUN cp /root/.bun/bin/bun /usr/local/bin/bun
RUN chmod 755 /usr/local/bin/bun

# Verify bun installation
RUN which bun && bun --version

# Install AWS SAM
RUN curl -L https://github.com/aws/aws-sam-cli/releases/download/v1.142.1/aws-sam-cli-linux-x86_64.zip -o aws-sam-cli-linux-x86_64.zip
RUN unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
RUN cd sam-installation && ./install
RUN rm -rf aws-sam-cli-linux-x86_64.zip
RUN rm -rf sam-installation

# Set working directory
WORKDIR /workspace

# Ensure the workspace directory exists and has proper permissions for vscode user
# The vscode user is created by the base image and has UID 1000
RUN chown -R 1000:1000 /workspace

# Verify bun still works
RUN bun --version

ADD . /workspace

