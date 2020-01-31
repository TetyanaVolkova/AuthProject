const Sequelize = require( 'sequelize' );
const db = require( '../db' );

const Auth = db.sequelize.define(
  'auth',
  {
    auth_id:{
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    auth_fullname: Sequelize.STRING,
    auth_email: Sequelize.STRING,
    auth_password: Sequelize.STRING
  },
  { underscored: true }
);

module.exports = Auth;
