#!/bin/bash

sudo docker build -t waeez/maxhome:frontend_2 .

sudo docker run -d -p 83:80 waeez/maxhome:frontend_2

sudo docker system prune -f

