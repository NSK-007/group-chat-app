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
const app = (0, express_1.default)();
(0, dotenv_1.config)();
app.use((0, cors_1.default)({
    origin: 'http://127.0.0.1:5500',
    methods: ['POST']
}));
app.use(body_parser_1.default.json());
app.use('/user', user_route_1.default);
app.use('/chat', chat_route_1.default);
app.use('/group', group_route_1.default);
chat_1.default.belongsTo(user_1.default, { constraints: true, onDelete: 'CASCADE' });
chat_1.default.belongsTo(group_1.default, { constraints: true, onDelete: 'CASCADE' });
groupmember_1.default.belongsTo(user_1.default, { constraints: true, onDelete: 'CASCADE' });
groupmember_1.default.belongsTo(group_1.default, { constraints: true, onDelete: 'CASCADE' });
user_1.default.hasMany(chat_1.default);
group_1.default.hasMany(chat_1.default);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default
            .sync();
        // .sync({force: true});
        app.listen(3000, () => console.log('Server started on port 3000'));
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
});
void start();
