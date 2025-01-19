import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express()
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express Server!');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})