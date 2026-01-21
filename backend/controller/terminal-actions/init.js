import yargs from 'yargs';
import fs, { mkdir } from 'fs';
import path from 'path';

async function initRepo() {
    const repoPath = path.resolve(process.cwd(), ".repo");
    const commitsPath = path.join(repoPath, "commits");

    try{
        if (!fs.existsSync(repoPath)) {
            await fs.mkdirSync(repoPath, { recursive: true });
            await fs.mkdirSync(commitsPath, { recursive: true });
            await fs.writeFileSync(path.join(repoPath, "config.json"), JSON.stringify({ bucket: "s3 bucket" }));
            console.log("Initialized repository in", repoPath);
        } else {
            console.log("Repository already exists in", repoPath);
        }
    } catch (error) {
        console.error("Error initializing repository:", error);
    }
}

export { initRepo };