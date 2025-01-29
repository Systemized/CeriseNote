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

app.use('/list', listRouter);
app.use('/task', taskRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express Server!');
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})