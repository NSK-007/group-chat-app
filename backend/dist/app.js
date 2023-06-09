"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocket = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = require("dotenv");
const database_1 = __importDefault(require("./util/database"));
const user_route_1 = __importDefault(require("./routes/user-route"));
const chat_1 = __importDefault(require("./models/chat"));
const user_1 = __importDefault(require("./models/user"));
const chat_route_1 = __importDefault(require("./routes/chat-route"));
const group_1 = __importDefault(require("./models/group"));
const groupmember_1 = __importDefault(require("./models/groupmember"));
const group_route_1 = __importDefault(require("./routes/group-route"));
const node_cron_1 = __importDefault(require("node-cron"));
const chat_services_1 = require("./services/chat-services");
const socketIO = require('socket.io');
const http = require('http');
const app = (0, express_1.default)();
(0, dotenv_1.config)();
app.use((0, cors_1.default)({
    origin: 'http://127.0.0.1:5501',
    methods: ['POST', 'GET', 'PUT', 'DELETE']
}));
app.use((0, cors_1.default)());
// app.use(upload.single('file'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(multer().single('multimedia'));
// app.use(bodyParser.text({ type: '/' }));
// app.use(express.json());
// app.use(bodyParser());
// app.use(express.urlencoded({extended: true}));
// const upload = multer({ dest: "uploads/" });
// app.post("/upload_files", upload.array("files"), authenticate, uploadFiles);
// express.static('public');
app.use('/user', user_route_1.default);
app.use('/chat', chat_route_1.default);
app.use('/group', group_route_1.default);
chat_1.default.belongsTo(user_1.default, { constraints: true, onDelete: 'CASCADE' });
user_1.default.hasMany(chat_1.default);
groupmember_1.default.belongsTo(group_1.default);
group_1.default.hasMany(groupmember_1.default);
let io;
let sckt;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default
            .sync();
        // .sync({force: true});
        // return http.createServer(app).listen(3000, () => console.log('Server started on port 3000'));
        const server = http.createServer(app);
        server.listen(3000, () => console.log('Server started on port 3000....'));
        node_cron_1.default.schedule('*/50 * * * * *', function () {
            return __awaiter(this, void 0, void 0, function* () {
                let data = `${new Date()}: Moving the data to archive\\n`;
                console.log(data);
                yield (0, chat_services_1.archiveChats)();
                // console.log(chats[chats.length-1]);
            });
        });
        io = socketIO(server, { cors: { origin: ["http://127.0.0.1:5501"] } });
        yield io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(socket.id);
            sckt = socket;
        }));
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
void start();
const getSocket = () => {
    let connection = {
        sckt, io
    };
    return connection;
};
exports.getSocket = getSocket;
