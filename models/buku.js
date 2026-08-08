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
            // get() {
            //     const rawValue = this.getDataValue('tahun_terbit');
            //     if (!rawValue) return null;
                
            //     const date = new Date(rawValue);
            //     const day = String(date.getDate()).padStart(2, '0');
            //     const month = String(date.getMonth() + 1).padStart(2, '0');
            //     const year = date.getFullYear();
                
            //     return `${day}/${month}/${year}`;
            // },
        },
        kategori_id: {
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        }, {
            sequelize,
            modelName: 'Buku',
            tableName: 'buku',
            timestamps: false,
            
        });
        return Buku;
    };