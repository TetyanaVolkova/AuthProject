const Sequelize = require( 'sequelize' );
const db = require( '../db' );

const Laboratories = db.READsequelize.define(
  'laboratories',
  {
    lab_id: { type: Sequelize.INTEGER, primaryKey: true },
    lab_name: Sequelize.STRING,
    location: Sequelize.STRING,
    PoC_name: Sequelize.STRING,
    PoC_address: Sequelize.STRING,
    certification: Sequelize.STRING,
    networks: Sequelize.STRING,
    LDMS: Sequelize.STRING,
    qa_services: Sequelize.STRING,
    lab_test_performed: Sequelize.STRING,
    Certified_By: Sequelize.STRING,
    Latitude: Sequelize.STRING,
    Longtitude: Sequelize.STRING
  }
);

module.exports = Laboratories;
