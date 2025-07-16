FROM mcr.microsoft.com/devcontainers/base:debian
LABEL Name=bunworkspacetest Version=0.0.1

# Update package list and install dependencies
RUN apt-get -y update && apt-get install -y \
	curl unzip zip git 

# Install Bun system-wide using the official method
RUN curl -fsSL https://bun.sh/install | bash
RUN cp /root/.bun/bin/bun /usr/local/bin/bun
RUN chmod 755 /usr/local/bin/bun

# Verify bun installation
RUN which bun && bun --version

# Create user
RUN useradd --create-home --shell /bin/bash appuser

# Install AWS SAM
RUN curl -L https://github.com/aws/aws-sam-cli/releases/download/v1.142.1/aws-sam-cli-linux-x86_64.zip -o aws-sam-cli-linux-x86_64.zip
RUN unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
RUN cd sam-installation && ./install
RUN rm -rf aws-sam-cli-linux-x86_64.zip
RUN rm -rf sam-installation

# Set working directory and switch to non-root user
WORKDIR /workspace
USER appuser
# Verify bun still works as appuser
RUN bun --version

COPY . /workspace
