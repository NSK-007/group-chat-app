import express, { NextFunction, Request } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import connection from './util/database';
import UserRouter from './routes/user-route';
import Chat from './models/chat';
import User from './models/user';
import ChatRouter from './routes/chat-route';
import Group from './models/group';
import Groupmember from './models/groupmember';
import GroupRouter from './routes/group-route';
import cron from 'node-cron'
import { archiveChats } from './services/chat-services';

const socketIO = require('socket.io');
const http = require('http');

const app = express();
config();
app.use(cors({
    origin: 'http://127.0.0.1:5501',
    methods: ['POST', 'GET', 'PUT', 'DELETE']
}));
app.use(cors());
// app.use(upload.single('file'));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// app.use(multer().single('multimedia'));
// app.use(bodyParser.text({ type: '/' }));
// app.use(express.json());
// app.use(bodyParser());
// app.use(express.urlencoded({extended: true}));

// const upload = multer({ dest: "uploads/" });
// app.post("/upload_files", upload.array("files"), authenticate, uploadFiles);
// express.static('public');


app.use('/user', UserRouter);
app.use('/chat', ChatRouter);
app.use('/group', GroupRouter);


Chat.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Chat);
Groupmember.belongsTo(Group);
Group.hasMany(Groupmember);

let io: any;
let sckt: any;
const start = async(): Promise<any> => {
    try{
        await connection
            .sync()
            // .sync({force: true});
        // return http.createServer(app).listen(3000, () => console.log('Server started on port 3000'));
        const server = http.createServer(app);
        server.listen(3000, () => console.log('Server started on port 3000....'));

        cron.schedule('* 00 12 * * *', async function(){
            let data = `${new Date()}: Moving the data to archive\\n`;
            console.log(data);
            await archiveChats();
            // console.log(chats[chats.length-1]);
        });

        io = socketIO(server, {cors: {origin: ["http://127.0.0.1:5501"]}});
        await io.on('connection', async (socket: any) => {
            console.log(socket.id);
            sckt = socket;
        });        
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}
void start();

export const getSocket = () => {
    let connection = {
        sckt, io
    }
    return connection;
}



