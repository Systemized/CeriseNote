import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// id_token sent from the client login.component.ts, after user logins with google
router.post('/google', async (req, res) => {
    const { id_token } = req.body;

    try {
        // Verify using verifyIdToken from google-auth-library
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // userId uses the sub field from payload, for unique userId
        const userId = payload!['sub'];

        // Handle user authentication/creation logic here
        res.status(200).json({ message: 'Token Verified', user: payload });
    } catch (err) {
        console.error('Error verifying ID token:', err);
        res.status(401).json({ message: 'Invalid ID token' });
    }
});

export default router;