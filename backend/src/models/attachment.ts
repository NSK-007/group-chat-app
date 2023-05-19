import { AutoIncrement, Column, DataType, Model, Table } from "sequelize-typescript";

@Table({timestamps:true, tableName: 'attachments'})
class Attachment extends Model{
    @AutoIncrement
    @Column({type: DataType.INTEGER,primaryKey: true, allowNull: false})
    id!: number;

    @Column({type: DataType.STRING, allowNull: false})
    fileURL!: string;

    @Column({type: DataType.INTEGER, allowNull: false})
    chat_id!: number;
}

export default Attachment;