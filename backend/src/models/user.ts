import { Table, Model, Column, DataType, AutoIncrement  } from "sequelize-typescript";

@Table({timestamps: true, tableName: 'users', initialAutoIncrement:'1'})
class User extends Model{
    @AutoIncrement
    @Column({type: DataType.INTEGER, primaryKey: true, allowNull: false})
    id!: number; 

    @Column({type: DataType.STRING, allowNull: false})
    name!: string;

    @Column({type: DataType.STRING, allowNull: false})
    email!: string;

    @Column({type: DataType.STRING, allowNull: false})
    phone!: string;

    @Column({type: DataType.STRING, allowNull: false})
    password!: string;
}

export default User;