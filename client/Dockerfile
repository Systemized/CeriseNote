FROM node:lts-alpine AS build

WORKDIR /app

RUN mkdir -p src/environments

RUN --mount=type=secret,id=env_client cat /run/secrets/env_client > src/environments/environment.ts

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/client/browser /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;" ]

EXPOSE 443