const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

module.exports = (sequelize, DataTypes) => {

    const Cart = sequelize.define('Cart', { 
        
        totalPrice:{
            type: DataTypes.FLOAT,
        },

        totalQty:{
            type: DataTypes.FLOAT,
        }

    });

    return Cart;

}