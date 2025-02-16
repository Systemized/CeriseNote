import express, { Request, Response, Application } from "express";
import connectDB from "./database";
import { listRouter } from "./routes/lists";
import { taskRouter } from "./routes/tasks";
import cors from 'cors';
import https from 'https';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const app: Application = express();
const port = 2053;

// aws seceret key
const secret_name = "cerise-express-port-ssl";
const secretsClient = new SecretsManagerClient({ region: "us-east-1" });

async function getSecretValue(secretName: string): Promise<string | null> {
    try {
        const response = await secretsClient.send(
            new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: "AWSCURRENT",
            })
        );
        return response.SecretString ?? null;
    } catch (error) {
        console.error(`Error fetching secret ${secretName}:`, error);
        return null;
    }
}

async function startServer() {
    try {
        const secretString = await getSecretValue(secret_name);

        if (!secretString) {
            console.error("Secret is missing. Server cannot start.");
            process.exit(1);
        }

        const secret = JSON.parse(secretString);
        const sslCert = secret.ssl_cert;
        const sslKey = secret.ssl_key;

        if (!sslCert || !sslKey) {
            console.error("SSL certificate or key is missing in the secret. Server cannot start.");
            process.exit(1);
        }

        const options = {
            key: sslKey,
            cert: sslCert,
        };

        https.createServer(options, app).listen(port, () => {
            console.log(`Secure Express server running on port ${port}`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
    }
}



app.use(express.json());
app.use(cors());

connectDB();

app.use('/api/lists', listRouter);
app.use('/api/tasks', taskRouter);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express Server!');
})


startServer();

// OLD (before adding aws secret)
// app.listen(port, '0.0.0.0', () => {
//     console.log(`Server is running at :${port}`);
// })