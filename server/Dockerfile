FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY src/ ./src

EXPOSE 3000

CMD ["node", "src/appv7.js"]


# sudo docker build -t node-server .
# sudo docker run -p 3000:3000 --name my-node-app node-server



# sudo docker build -t node-server .
# sudo docker run -p 3000:3000 --name my-node-app node-server
# 3b000ce6a008
# e6c64cd6e80354a4a50c68f84d6a2a95039fe49d0889de9fbb8cc0bd40491198 