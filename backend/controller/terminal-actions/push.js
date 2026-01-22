import fs from 'fs/promises';
import path from 'path';
import { s3, s3_bucket } from '../../config/aws-config.js';

async function push() {
    const repoPath = path.resolve(process.cwd(), '.repo');
    const commitsPath = path.join(repoPath, 'commits');

    try {
        const commitDirs = await fs.readdir(commitsPath);

        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);

            for (const file of files) {
                const filePath = path.join(commitPath, file);
                const stat = await fs.stat(filePath);

                // skip directories
                if (!stat.isFile()) continue;

                const fileContent = await fs.readFile(filePath);

                const params = {
                    Bucket: s3_bucket,
                    Key: `${commitDir}/${file}`,
                    Body: fileContent
                };

                await s3.upload(params).promise();
                console.log(`Uploaded ${commitDir}/${file}`);
            }
        }
    } catch (error) {
        console.error('Error pushing commits:', error);
    }
}

export default push;
