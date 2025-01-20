import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config()

const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.USER_POOL_ID as string,
    tokenUse: "access",
    clientId: process.env.CLIENT_ID as string,
})

export async function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    // Ensure the Authorization header exists and starts with "Bearer " [not required for it to work, but for safety]
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Missing or Invalid Token"});
        return
    }

    // Extracts token from "<Bearer> <token>""
    const token = authHeader.split(" ")[1];
    
    try {
        const payload = await verifier.verify(token);
        // Attach the verified payload to req.user Only the sub is needed (for now)
        req.user = { sub: payload.sub };
        next();
    } catch (error) {
        console.error("Token Verification Failed: ", error);
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
}