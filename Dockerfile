FROM node:18

WORKDIR /app

RUN apt update && apt install -y curl bash

COPY package*.json ./

RUN npm install

COPY . .

RUN chmod +x simulator.sh

EXPOSE 4000

CMD ["npm", "start"]
