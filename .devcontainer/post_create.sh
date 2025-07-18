#!/bin/bash

sudo chown -R vscode:vscode /workspace
sudo chmod 666 /var/run/docker.sock
bun i

