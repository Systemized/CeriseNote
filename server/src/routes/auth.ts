import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user'

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Needed for 'user' in 'req.session.user' to be recongized
declare module 'express-session' {
    interface SessionData {
        user: { [key: string]: any };
    }
}

router.post('/google', async (req, res) => {
    try {
        const { id_token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const userId = payload!['sub'];

        let user = await User.findById(userId);

        if (!user) {
            user = new User({
                _id: userId,
                name: payload!.name,
                email: payload!.email,
                createdAt: new Date()
            })
            await user.save();
        }

        // req.session.user = user
        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
        }

        req.session.save((err) => {
            if (err) {
                console.error('Session failed to save:', err);
                return res.status(500).json({ message: 'Session failed to save' });
            }
            res.status(200).json({ message: 'Session saved', user: req.session.user });
        });


        // DIFFERENT VERSION OF SESSION SAVE. FROM WHEN TOP VERSION WAS NOT WORKING FOR SOME REASON
        // return new Promise((resolve) => {
        //     req.session.save((err) => {
        //         if (err) {
        //             console.error('Session save failed:', err);
        //             return res.status(500).json({ message: 'Session save failed' });
        //         }

        //         // Send response after session is saved
        //         res.status(200).json({ message: 'Token Verified', user: req.session.user });
        //         resolve();
        //     });
        // });

    } catch (err) {
        console.error('Error verifying ID Token:', err);
        res.status(401).json({ message: 'Invalid ID token' });
    }
})


router.get('/check-session', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ loggedIn: true, user: req.session.user });
    } else {
        res.status(200).json({ loggedIn: false });
    }
})

// Getting user email for logging out google SDK
router.get('/user-email', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ email: req.session.user!.email });
    }
})

router.post('/logout', (req, res) => {
    console.log(req.session);

    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged Out' });
    });
})

export default router;