import express from 'express';
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
const socketIO = require('socket.io');
const http = require('http');

const app = express();
config();
// app.use(cors({
//     origin: 'http://127.0.0.1:5500',
//     methods: ['POST', 'GET', 'PUT']
// }));
app.use(cors());
app.use(bodyParser.json());


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

        io = socketIO(server, {cors: {origin: ["http://127.0.0.1:5500"]}});
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



