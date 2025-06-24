FROM node:lts-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY . .

# configuration set to either <development/production> decides if environment.ts or environment.development.ts is used in build
RUN npm install \
    && npm run build -- --configuration=production \
    && rm -fr node_modules

FROM nginx:alpine

COPY --from=build /app/dist/client/browser /usr/share/nginx/html

# Needed in order to serve Angular SPA routes correctly
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]