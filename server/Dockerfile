FROM node:lts-alpine

WORKDIR /app

RUN --mount=type=secret,id=env_server cat /run/secrets/env_server > .env

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 2053

CMD [ "npm", "start" ]