import { AutoIncrement, Column, DataType, Model, Table } from "sequelize-typescript";

@Table({timestamps: true, tableName: 'groupmembers'})
class GroupMember extends Model{
    @AutoIncrement
    @Column({type: DataType.INTEGER, primaryKey: true, allowNull: false})
    id!: number;

    @Column({type: DataType.STRING, allowNull: false})
    name!: string;
}

export default GroupMember