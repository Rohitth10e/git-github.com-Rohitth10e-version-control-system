import fs from 'fs';
import path from 'path';
import { s3, s3_bucket } from '../../config/aws-config.js';

async function pull() {
    const repoPath = path.resolve(process.cwd(), '.repo');
    const commitsPath = path.join(repoPath, 'commits');

    try {
        const data = await s3.listObjectsV2({
            Bucket: s3_bucket
        }).promise();

        const objects = data.Contents || [];

        for (const obj of objects) {
            const { Key } = obj;

            const commitId = Key.split('/')[0];
            const fileName = Key.split('/').slice(1).join('/');

            const commitDir = path.join(commitsPath, commitId);
            const filePath = path.join(commitDir, fileName);

            fs.mkdirSync(commitDir, { recursive: true });

            // next step will be:
            // 1. s3.getObject(Key)
            // 2. fs.writeFileSync(filePath, Body)
            const params = {
                Bucket: s3_bucket,
                Key: Key
            }
            const fileContent = await s3.getObject(params).promise();
            await fs.writeFileSync(filePath, fileContent.Body);
            console.log(`Downloaded ${Key} to ${filePath}`);
        }
    } catch (error) {
        console.error('Error pulling commits:', error);
    }
}


export default pull;