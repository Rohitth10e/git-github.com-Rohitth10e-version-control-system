import express, { Router } from 'express';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import mainRouter from './routes/main.router.js';
import { initRepo } from './controller/terminal-actions/init.js';
import add from './controller/terminal-actions/add.js';
import push from './controller/terminal-actions/push.js';
import revert from './controller/terminal-actions/revert.js';
import commit from './controller/terminal-actions/commit.js';
import pull from './controller/terminal-actions/pull.js';
dotenv.config();

const app = express();
const MONGO_URI = process.env.MONGO_URI

yargs(hideBin(process.argv))
    .command('init', 'Initialize the application', {}, initRepo)
    .command('add <file>', 'Add file to repo', (yargs)=>{yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
    })}, (argv)=>{
        add(argv.file);
    })
    .command('commit <message>', 'commit staged files', (yargs)=>{yargs.positional("message", {
        describe: "commit message",
        type: "string",
    });}, (argv)=>{
        commit(argv.message)
    })
    .command('push', 'Push commits to S3', {} ,push)
    .command('pull', 'Pull commits from S3', {} , pull)
    .command('revert', 'Add file to repo', (yargs)=>{yargs.positional("commitID", {
        describe: "Which commit to revert to",
        type: "string",
    })}, (argv) => {
        commit(argv.commitID)
    }).help().argv;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api/v1", mainRouter);

async function connectToDatabase() {
    await mongoose.connect(MONGO_URI)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Error connecting to MongoDB:", err));
}

app.listen(PORT, () => {
    connectToDatabase();
    console.log(`Server is running on http://localhost:${PORT}`);
});