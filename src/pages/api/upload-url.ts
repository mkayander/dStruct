import S3 from 'aws-sdk/clients/s3';
import type { NextApiRequest, NextApiResponse } from 'next';
import { env } from '#/env/server.mjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const s3 = new S3({
        apiVersion: '2006-03-01',
        accessKeyId: env.ACCESS_KEY,
        secretAccessKey: env.SECRET_KEY,
        region: 'eu-central-1',
    });

    const post = await s3.createPresignedPost({
        Bucket: env.BUCKET_NAME,
        Fields: {
            key: req.query.file,
            'Content-Type': req.query.fileType,
        },
        Expires: 60, // seconds
        Conditions: [
            ['content-length-range', 0, 1048576], // up to 1 MB
        ],
    });

    res.status(200).json(post);
}
