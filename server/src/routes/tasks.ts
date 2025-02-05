import express, { Request, Response } from "express";
import Task, { ITask } from "../models/Task";
import { authenticate } from "../middleware/auth";

export const taskRouter = express.Router();

taskRouter.get('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(403).json({ message: 'UserId not found in tokens' });
            return;
        }

        const { listId } = req.query;

        const tasks: ITask[] = await Task.find({ userId, listId });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error getting Tasks: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

taskRouter.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(403).json({ message: 'UserId not found in tokens' });
            return;
        }

        const task: ITask = new Task({ ...req.body, userId });

        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        console.error("Error posting Tasks: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
})

taskRouter.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(403).json({ message: 'UserId not found in tokens' });
            return;
        }

        const updatedTask = await Task.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true })
        if (!updatedTask) {
            res.status(404).json({ message: "Task not Found" });
            return;
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.log('Error putting Task: ', error);
        res.status(404).json({ message: "Task Not Found" });
    }
})

// Normal Tasks Deletion
taskRouter.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(403).json({ message: 'UserId not found in tokens' });
            return;
        }

        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, userId });
        if (!deletedTask) {
            res.status(404).json({ message: "Task Not Found" });
            return;
        }
        res.status(200).json({ message: "Task Deleted", task: deletedTask })
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
})

// Task Deletion when deleting a list, to allow listRouter.delete('/id'...
taskRouter.delete('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.sub;
        const deletedTasks = await Task.deleteMany({ _id: req.params.listId, userId });
        res.status(200).json({ message: 'Tasks deleted successfully', deletedCount: deletedTasks.deletedCount });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
})