import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { v4 } from 'uuid';
import { timeStamp } from 'console';

async function commit(message) {
    const repoPath = path.resolve(process.cwd(), '.repo');
    const stagingPath = path.join(repoPath, 'staging');
    const commitsPath = path.join(repoPath, 'commits');
    try {
        const commitID = v4();
        const commitDir = path.join(commitsPath, commitID);

        await fs.mkdirSync(commitDir, { recursive: true })
        const files = await fs.readdirSync(stagingPath);

        if(!files){
            console.log("no files found in staging area")
            return
        }

        for (const file of files){
            await fs.copyFileSync(path.join(stagingPath, file), path.join(commitDir, file));
        }

        await fs.writeFileSync(path.join(commitDir, `${commitID}.json`), JSON.stringify({ message, date: new Date().toISOString() }))

        console.log(`Commit ${commitID} created successfully with message ${message}.`);
    } catch (error) {
        console.error('Error creating commit:', error.message);
    }
}

export default commit;