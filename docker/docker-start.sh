#!/bin/sh
set -e

# Start NestJS app in background
env NODE_ENV=${NODE_ENV:-production} node dist/main.js &
NODE_PID=$!

# Start nginx in foreground
nginx -g 'daemon off;' &
NGINX_PID=$!

# Trap termination and forward signals
trap 'kill -TERM ${NODE_PID} ${NGINX_PID}; wait ${NODE_PID} ${NGINX_PID}' TERM INT

# Wait on both processes
wait ${NODE_PID} ${NGINX_PID}
