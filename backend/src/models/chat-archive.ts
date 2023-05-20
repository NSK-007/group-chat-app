import { AutoIncrement, Column, DataType, Model, Table } from "sequelize-typescript";

@Table({timestamps: true, tableName:'chat-archives', initialAutoIncrement: '1'})
class ChatArchive extends Model{
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

    @Column({type: DataType.INTEGER, allowNull: false})
    UserId!: string;

    @Column({type: DataType.DATE, allowNull: false})
    created_date!: Date;

    @Column({type: DataType.DATE, allowNull: false})
    updated_date!: Date;
}

export default ChatArchive;