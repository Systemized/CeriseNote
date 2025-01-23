import express, { Express, Request, Response, Application } from "express";
import connectDB from "./database";
import { listRouter } from "./routes/lists";
import { taskRouter } from "./routes/tasks";

const app: Application = express()
const port = 3000;

app.use(express.json());

connectDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express Server!');
})

app.use('/list', listRouter);
app.use('/task', taskRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})