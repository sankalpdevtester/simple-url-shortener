import { Model, Table, Column, DataType, ForeignKey } from 'sequelize-typescript';
import { Url } from './Url';

@Table({
  tableName: 'url_analytics',
  timestamps: false,
})
export class UrlAnalytics extends Model<UrlAnalytics> {
  @Column({
    type: DataType.STRING(6),
    primaryKey: true,
  })
  shortUrl: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  clicks: number;

  @Column({
    type: DataType.DATE,
  })
  lastClicked: Date | null;

  @ForeignKey(() => Url)
  @Column({
    type: DataType.STRING(6),
  })
  shortUrlForeignKey: string;
}