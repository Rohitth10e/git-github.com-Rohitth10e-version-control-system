import fs from 'fs';
import path from 'path';
import yargs from 'yargs';

async function add(filePath) {
    const repoPath = path.resolve(process.cwd(), '.repo');
    const stagingPath = path.resolve(repoPath, 'staging');
    const absoluteFilePath = path.resolve(process.cwd(), filePath);

    try {

        if (!fs.existsSync(repoPath)) {
            console.error("Repository not initialized. Please run 'init' command first.");
            return;
        }

        if (!fs.existsSync(stagingPath)) {
            await fs.mkdirSync(stagingPath, { recursive: true });
        }

        if (!fs.existsSync(absoluteFilePath)) {
            console.log(`File not found: ${filePath}`);
            return;
        }

        const fileName = path.basename(filePath);
        fs.copyFileSync(absoluteFilePath, path.join(stagingPath, fileName));
        console.log(`Added ${fileName} to staging area.`);
    } catch (error) {
        console.error("Error adding file to staging area:", error);
    }
}

export default add;