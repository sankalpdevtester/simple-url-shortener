import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';
import { Url } from './Url';

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @HasMany(() => Url)
  urls: Url[];

  static async validateUser(email: string, password: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });
    if (!user) return null;
    if (user.password !== password) return null;
    return user;
  }

  static async createUser(email: string, password: string, name: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = password;
    user.name = name;
    await user.save();
    return user;
  }
}