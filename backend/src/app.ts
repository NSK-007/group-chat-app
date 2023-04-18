import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import connection from './util/database';
import UserRouter from './routes/user-route';

const app = express();
config();
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['POST']
}));
app.use(bodyParser.json());

app.use('/user', UserRouter);

const start = async(): Promise<void> => {
    try{
        await connection
            .sync()
            // .sync({force: true});
        app.listen(3000, () => console.log('Server started on port 3000'))
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}
void start();