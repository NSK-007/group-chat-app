import { AutoIncrement, Column, DataType, Model, Table } from "sequelize-typescript";

@Table({timestamps: true, tableName:'chats', initialAutoIncrement: '1'})
class Chat extends Model{
    @AutoIncrement
    @Column({type: DataType.INTEGER, primaryKey: true, allowNull: false})
    id! : number;

    @Column({type: DataType.STRING, allowNull: false})
    user!: string;

    @Column({type: DataType.STRING, allowNull: false})
    message!: string;

    @Column({type: DataType.INTEGER, allowNull: false})
    GroupId!: number;

    @Column({type: DataType.STRING, allowNull: false})
    fileURL!: string;

    @Column({type: DataType.STRING, allowNull: false})
    type!: string;
}

export default Chat;