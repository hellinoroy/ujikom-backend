'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Buku extends Model {
    static associate(models) {
        Buku.belongsTo(models.Kategori, {
            foreignKey: 'kategori_id'
        });
    }
  }
  Buku.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    judul: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    penulis: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    penerbit: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    stok: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    tahun_terbit: {
      type:DataTypes.DATE,
      allowNull: false,
    },
    kategori_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Buku',
    freezeTableName: true,
    timestamps: false,
  });
  return Buku;
};