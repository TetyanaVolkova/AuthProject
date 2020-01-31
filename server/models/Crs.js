const Sequelize = require( 'sequelize' );
const db = require( '../db' );

const Crs = db.READsequelize.define( 'crs',
  {
    crs_id: {type: Sequelize.INTEGER, primaryKey: true},
    crs_name: Sequelize.STRING,
    ctu_id: Sequelize.INTEGER,
    ctu_name: Sequelize.STRING,
    crs_leader: Sequelize.STRING,
    internal_office_name: Sequelize.STRING
  },
  { underscored: true }
);

module.exports = Crs;
