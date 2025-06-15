// import express from 'express';
// import multer from 'multer';
// import AWS from '@aws-sdk/client-s3';

// const router = express.Router();

// export default router;


import express from 'express';
import multer from 'multer';
import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();

// --- AWS S3 Configuration ---
const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_ENDPOINT } = process.env;

// **FIX:** Add runtime checks to ensure environment variables are set.
// This prevents runtime errors and satisfies TypeScript's type checker.
if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET) {
	console.error("Missing required AWS environment variables for S3 configuration.");
	// Throwing an error will stop the server from starting with a misconfiguration.
	throw new Error("Missing required AWS environment variables for S3 configuration.");
}

const s3Client = new S3Client({
	region: 'auto',
	credentials: {
		accessKeyId: R2_ACCESS_KEY_ID,
		secretAccessKey: R2_SECRET_ACCESS_KEY,
	},
	endpoint: R2_ENDPOINT
});

// --- Multer Configuration ---
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 10 // 10 MB file size limit
	}
});


// --- File Routes ---
router.get('/', async (req, res) => {
	const userId = req.session.user!._id;
	const params = {
		Bucket: R2_BUCKET,
		Prefix: `${userId}/`
	};

	try {
		const command = new ListObjectsV2Command(params);
		const data = await s3Client.send(command);
		const files = data.Contents ? data.Contents.map(file => ({
			key: file.Key,
			fileName: file.Key?.replace(`${userId}/`, ''),
			lastModified: file.LastModified,
			size: file.Size,
			eTag: file.ETag
		})) : [];
		res.json(files);
	} catch (err) {
		console.error("Error listing files from S3:", err);
		res.status(500).send('Server Error');
	}
});


router.post('/upload', upload.single('file'), async (req, res) => {
	if (!req.file) {
		res.status(400).send('No file uploaded.');
	}

	const userId = req.session.user!._id;
	const fileName = `${req.file?.originalname}-${Date.now()}`;
	const fileKey = `${userId}/${fileName}`;

	const params = {
		Bucket: R2_BUCKET,
		Key: fileKey,
		Body: req.file?.buffer,
		ContentType: req.file?.mimetype
	};

	try {
		const command = new PutObjectCommand(params);
		await s3Client.send(command);
		res.status(201).json({
			message: 'File uploaded successfully',
			fileKey: fileKey,
			fileName: fileName
		});
	} catch (err) {
		console.error("Error uploading file to S3:", err);
		res.status(500).send('Server Error');
	}
});


router.delete('/:fileKey', async (req, res) => {
	const userId = req.session.user!._id;
	const fileKey = decodeURIComponent(req.params.fileKey);

	if (!fileKey.startsWith(`${userId}/`)) {
		res.status(403).send('Forbidden: You do not have permission to delete this file.');
	}

	const params = {
		Bucket: R2_BUCKET,
		Key: fileKey
	};

	try {
		const command = new DeleteObjectCommand(params);
		await s3Client.send(command);
		res.status(200).json({ message: 'File deleted successfully' });
	} catch (err) {
		console.error("Error deleting file from S3:", err);
		res.status(500).send('Server Error');
	}
});

export default router;