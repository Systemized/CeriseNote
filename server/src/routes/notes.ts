import express from 'express';
import Note from '../models/Note';


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.session.user!._id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
        }
        
        const notes = await Note.find({ user_id: userId })
        
        res.status(200).json(notes);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({ message: 'Error fetching notes' });
    }
})

router.post('/', async (req, res) => {
    try {
        const userId = req.session.user!._id;
        console.log(userId);
        
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
        }

        const { title, content } = req.body;
        console.log(title, content);
        
        const newNote = new Note({ user_id: userId, title, content});
        
        console.log(newNote);
        
        await newNote.save();
        res.status(201).json({ message: 'Note Created', note: newNote});
    } catch (err) {

    }
})

export default router;