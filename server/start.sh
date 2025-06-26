#!/bin/bash

sudo docker build --pull --cache-from=node-server -t node-server_2 .

sudo docker run -d -v $(pwd)/src/logs:/usr/src/app/src/logs -p 3000:3000 node-server_2:latest

sudo docker system prune -f


# #!/bin/bash

# sudo docker build -t node-server .

# sudo docker run -d \
#   -v $(pwd)/src/logs:/usr/src/app/src/logs \
#   -p 3000:3000 \
#   node-server

# sudo docker system prune -f






