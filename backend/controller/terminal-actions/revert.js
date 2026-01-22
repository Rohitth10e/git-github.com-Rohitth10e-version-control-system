import fs from 'fs';
import path from 'path';
import promisify from 'util';
import {s3, s3_bucket} from "../../config/aws-config.js";

const readdir = promisify(fs.readdir);
const copyfile = promisify(fs.copyFile);

async function revert(commitID){
    const repoPath = path.resolve(process.cwd(), ".repo")
    const commitPath = path.join(repoPath, 'commits');

    try{
        const commitDir = path.join(commitPath, commitID);
        const files = await readdir(commitDir);
        const parentDir = path.resolve(repoPath, '..');

        for (const file of files) {
            await copyfile(path.join(commitDir, file), path.join(parentDir, file));
        }
        console.log(`Successfully copied to ${commitID}`);

    } catch(err){
        console.log("Something went wrong while reverting", err.message);
    }
}

export default revert;