# CeriseNote

[https://cerisenote.com]


A Note-taking and Task-management webapp personal project built using MEAN Stack

>Frontend: Angular w/ Angular Materials
>Backend: Express.js (Node.js)
>Database: MongoDB Atlas

>Authentication: AWS Cognito
>Security: SSL/TLS (https) secured via Cloudflare

Containerized in Docker, Image pushed and deployed in AWS ECS (Fargate)




## Set up -

Prerequisites (set up beforehand, MongoDB  Atlas & AWS Cognito):

Create environment files for client/ and server/
    - client/src/environents/environment.ts file:
    - (from AWS Cognito)
        >authorityUrl:
        >clientId:
        >logout:
    - server/.env file:
        >MONGO_URI=
        >USER_POOL_ID=
        >CLIENT_ID=


## Installation
>Do in client & in server, 
```
npm install
```


Current client/src/app/services/list-task.service.ts is for deploying into cerisenote.com site
Replace listApiUrl and taskApiUrl with this to run locally
```
private listApiUrl = 'http://localhost:3000/api/lists';
private taskApiUrl = 'http://localhost:3000/api/tasks';
```

Current server/src/app.ts is for deploying into AWS ECS with Cloudflare's Origin Server Certificate
Replace server/src/app.ts code with code below to run locally

```
import express, { Request, Response, Application } from "express";
import connectDB from "./database";
import { listRouter } from "./routes/lists";
import { taskRouter } from "./routes/tasks";
import cors from 'cors';

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/lists', listRouter);
app.use('/api/tasks', taskRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express Server!');
})

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at :${port}`);
})
```

From within split terminal (to run both):
```
cd client
ng serve
```

```
cd server
tsc && node dist/app.js
```
