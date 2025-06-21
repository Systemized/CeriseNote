FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
COPY . .

RUN npm install \
    && npm run build \
    && rm -fr node_modules

EXPOSE 3000

CMD ["npm", "start"]