'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kategori extends Model {
    static associate(models) {
        Kategori.hasMany(models.Buku, {
            foreignKey: 'kategori_id'
        });
    }
  }
  Kategori.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_kategori: {
      type:DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Kategori',
    tableName: 'kategori',
    timestamps: false,
  });
  return Kategori;
};