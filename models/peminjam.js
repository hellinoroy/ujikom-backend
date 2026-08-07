'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Peminjam extends Model {
    static associate(models) {
        Peminjam.belongsTo(models.user, {
            foreignKey: 'user_id'
        });

        Peminjam.belongsTo(models.buku, {
            foreignKey: 'buku_id'
        });
    }
  }
  Peminjam.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    buku_id: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    tanggal_pinjam: {
      type:DataTypes.DATE,
      allowNull: false,
    },
    tanggal_jatuh_tempo: {
      type:DataTypes.DATE,
      allowNull: false,
    },
    tanggal_kembali: {
      type:DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type:DataTypes.STRING,
      allowNull: true,
    },
    denda: {
      type:DataTypes.INTEGER,
      allowNull: true,
    },


  }, {
    sequelize,
    modelName: 'Peminjam',
    freezeTableName: true,
    hooks: {
        beforeCreate: async (peminjam) => {
            const dueDate = new Date(peminjam.tanggal_pinjam);
            dueDate.setDate(dueDate.getDate() + 7);
            peminjam.tanggal_jatuh_tempo = dueDate;
        },
    },
  });
  return Peminjam;
};