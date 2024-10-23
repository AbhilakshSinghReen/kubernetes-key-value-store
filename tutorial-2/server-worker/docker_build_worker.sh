#!/bin/bash

ln -fs .dockerignore.worker .dockerignore

docker build -f Dockerfile.worker -t your-docker-hub-username/k8s-key-value-store-worker .
