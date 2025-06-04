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
});

router.post('/', async (req, res) => {
    try {
        const userId = req.session.user!._id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
        }

        const { title, content } = req.body;        
        const newNote = new Note({ user_id: userId, title, content});
                
        await newNote.save();
        res.status(201).json({ message: 'Note Created', note: newNote});
    } catch (err) {
        console.error('Failed to post Note:', err);
        res.status(500).json({ message: 'Error posting note' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const userId = req.session.user!._id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
        }
        
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate({ _id: req.params.id },
            { title, content },
            { new: true }
        );

        res.status(200).json({ message: 'Updated Note', note: updatedNote })
    } catch (err) {
        console.error('Failed to update Note:', err);
        res.status(500).json({ message: 'Error patching note' });
        
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.session.user!._id;
        if (!userId) {
            res.status(401).json({ message: 'User not authenticated' });
        }

        await Note.findByIdAndDelete({ _id: req.params.id })
        res.status(200).json({ message: 'Note deleted'});
    } catch (err) {
        console.error('Failed to delete Note:', err);
        res.status(500).json({ message: 'Error deleting note' });
    }
})

export default router;