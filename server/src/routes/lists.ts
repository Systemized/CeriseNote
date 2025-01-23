import express, { Request, Response } from "express";
import List, { IList } from "../models/List";
import Task from "../models/Task";
import { authenticate } from "../middleware/auth";

export const listRouter = express.Router();

listRouter.get('/', authenticate, async (res: Response, req: Request): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(403).json({ message: 'UserId not found in tokens' });
            return;
        }

        const lists: IList[] = await List.find({ userId })

        res.status(200).json({ lists })
    } catch (error) {
        console.error("Error getting Lists: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

listRouter.post('/', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(403).json({ message: 'UserId not found in tokens' });
            return;
        }

        const list: IList = new List({ ...req.body, userId });
        const savedList = await list.save();

        res.status(201).json(savedList);
    } catch (error) {
        console.error("Error posting Lists: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

listRouter.put('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(403).json({ message: 'UserId not found in tokens' });
            return;
        }

        //  use findOneAndUpdate instead of findByIdAndUpdate, so that userId can be checked as well
        const updatedList = await List.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true })

        if (!updatedList) {
            res.status(404).json({ message: "List Not Found" })
            return;
        }

        res.status(200).json(updatedList)
    } catch (error) {
        console.error("Error putting list: ", error);
        res.status(404).json({ message: "List Not Found" });
    }
});

listRouter.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.sub;
        if (!userId) {
            res.status(403).json({ message: 'UserId not found in tokens' });
            return;
        }
        
        const listId = req.params.id;

        await Task.deleteMany({ listId });      //  First, delete all tasks that fall under this listid
        const deletedList = await List.findOneAndDelete({ _id: listId, userId });   //  Then, delete List

        if (!deletedList) {
            res.status(404).json({ message: 'List Not Found' });
            return;
        }

        res.status(200).json({ message: "List and associated tasks are deleted from DB" });
    } catch (error) {
        console.error("Error Deleting List: ", error);
        res.status(500).json({ message: (error as Error).message })
    }
});