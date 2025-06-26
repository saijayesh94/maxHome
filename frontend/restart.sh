#!/bin/bash

CONT_NAME=maxhome_frontend_con

CONNECTOR_SCRIPT=./start.sh

sudo docker stop $CONT_NAME

sudo docker rm $CONT_NAME

$CONNECTOR_SCRIPT