import { AutoIncrement, Column, DataType, Model, Table } from "sequelize-typescript";

@Table({timestamps: true, tableName: 'groupmembers'})
class Groupmember extends Model{
    @AutoIncrement
    @Column({type: DataType.INTEGER, primaryKey: true, allowNull: false})
    id!: number;

    @Column({type: DataType.STRING, allowNull: false})
    name!: string;

    @Column({type: DataType.INTEGER, allowNull: false})
    UserId!: number;
}

export default Groupmember