# CeriseNote

CeriseNote is a full-stack note-taking application built with the MEAN stack
> Cerise because webapp is has the theme #de3163
- **Client:** Angular
- **Server:** Express (Node.js)
- **Database:** MongoDB Atlas
- **File Storage:** Cloudflare R2
- **Authentication:** Google OAuth 2.0 (with session-based authentication)

![README.png](/client/public/assets/README.png)

## Features

- User authentication via Google
- Secure Server session via Mongo-Store
- File upload and storage via Cloudflare R2
- Create, update, and delete notes via MongoDB
- Responsive Angular SPA frontend

## Prerequisites

- MongoDB Atlas account
- Cloudflare R2 
- Google Identity OAuth 2.0

Create a `.env` file in the root directory with the following variables:

```
MONGO_URI=<mongodb_atlas_connection_string>
SESSION_SECRET=<session_secret>
R2_ACCESS_KEY_ID=<R2_access_key_id>
R2_SECRET_ACCESS_KEY=<R2_secret_access_key>
R2_BUCKET=<R2_bucket_name>
R2_ENDPOINT=<R2_endpoint>
GOOGLE_CLIENT_ID=<google_client_id>
```


## Running Locally
### Running Container with Docker-Compose

1. Containerize and run:
   ```sh
   docker-compose up --build
   ```
   > For production, change from `development` to `production` in ./client/nginx.conf
   
   > Running at localhost:4200
### OR

### Running via npm

1. Split Terminal (for client and server)

2. Start Frontend:
    ```sh
   cd client
   npm install
   ng serve
   ```

3. Start Backend:
    ```sh
   cd server
   npm install
   npx tsc
   node dist/app.js
   ```

   > Running at localhost:4200
