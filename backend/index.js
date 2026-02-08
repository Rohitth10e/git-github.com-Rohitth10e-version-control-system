import express, { Router } from 'express';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import mainRouter from './routes/main.router.js';
import { initRepo } from './controller/terminal-actions/init.js';
import add from './controller/terminal-actions/add.js';
import push from './controller/terminal-actions/push.js';
import revert from './controller/terminal-actions/revert.js';
import commit from './controller/terminal-actions/commit.js';
import pull from './controller/terminal-actions/pull.js';
dotenv.config();

export const app = express();
const MONGO_URI = process.env.MONGO_URI

const corsOptions = {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
        revert(argv.commitID)
    }).help().argv;

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Server is healthy");
});

app.use("/api/v1", mainRouter);

async function connectToDatabase() {
    await mongoose.connect(MONGO_URI)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Error connecting to MongoDB:", err));
}

const user = "test"
function startServer(){
    connectToDatabase();

    const server = http.createServer(app)
    const io = new Server(server, {
        cors: {
            origin: true,
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket)=> {
        socket.on("join-room", (userID) =>{
            user == userID
            console.log(user)
            socket.join(userID)
        })
    })

    const db = mongoose.connection;

    db.once('open', async()=>{
        console.log("CRUD Ops");
    })

    server.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${PORT}`);
    })
}

if (process.env.NODE_ENV !== "test") {
    startServer();
}
