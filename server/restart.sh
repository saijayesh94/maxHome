#!/bin/bash
# sudo docker build -t node-server .
# sudo docker run -p 3000:3000 --name my-node-app node-server

CONT_NAME=my-node-app

CONNECTOR_SCRIPT=./start.sh

sudo docker stop $CONT_NAME

sudo docker rm $CONT_NAME

$CONNECTOR_SCRIPT