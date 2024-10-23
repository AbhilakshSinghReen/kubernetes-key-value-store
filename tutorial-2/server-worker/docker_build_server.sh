#!/bin/bash

ln -fs .dockerignore.server .dockerignore

docker build -f Dockerfile.server -t your-docker-hub-username/k8s-key-value-store-server .
