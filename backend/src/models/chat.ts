import { AutoIncrement, Column, DataType, Model, Table } from "sequelize-typescript";

@Table({timestamps: true, tableName:'chats', initialAutoIncrement: '1'})
class Chat extends Model{
    @AutoIncrement
    @Column({type: DataType.INTEGER, primaryKey: true, allowNull: false})
    id! : number;

    @Column({type: DataType.STRING, allowNull: false})
    message!: string;
}

export default Chat;