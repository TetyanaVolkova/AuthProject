const Sequelize = require( 'sequelize' );
const db = require( '../db' );

// Join table for CRSs and Labs
const Crs_lab = db.READsequelize.define( 'crs_lab',
  {
    crs_lab_id: { type: Sequelize.INTEGER, primaryKey: true },
    crs_id: Sequelize.INTEGER,
    lab_id: Sequelize.INTEGER
  },
  { underscored: true }
);

module.exports = Crs_lab;
