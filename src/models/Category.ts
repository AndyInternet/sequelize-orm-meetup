import { Sequelize, Model, DataTypes, Association, UUIDV4 } from 'sequelize';
import { CategoryInterface } from '../types';
import { PostProcessors } from '.';
import { StoryModel } from './Story';

export class CategoryModel extends Model implements CategoryInterface {
  public readonly id!: number;
  public readonly uuid!: string;
  public readonly createdAt!: Date;
  public readonly deletedAt!: Date | null;
  public readonly updatedAt!: Date;

  public label!: string;

  public stories!: StoryModel[];

  static Stories: Association;
}

export const CategoryFactory = (sequelize: Sequelize, postProcessors: PostProcessors) => {
  CategoryModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize, tableName: 'categories' },
  );

  postProcessors.associations.push(() => {
    CategoryModel.Stories = CategoryModel.hasMany(StoryModel, {
      as: 'stories',
      foreignKey: 'authorId',
    });
  });

  return CategoryModel;
};
