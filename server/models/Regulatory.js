const Sequelize = require( 'sequelize' );
const db = require( '../db' );

const Regulatory = db.READsequelize.define( 'regulatory',
  {
    id: {type: Sequelize.INTEGER, primaryKey: true},
    ctu_name: Sequelize.STRING,
    associated_regulatory_crs: Sequelize.STRING,
    crs_id: Sequelize.INTEGER,
    regulatory_authority_name: Sequelize.STRING,
    local_irb_ec_name: Sequelize.STRING,
    other_irb_ec_name: Sequelize.STRING,
    established_ibc: Sequelize.STRING,
    ibc_name: Sequelize.STRING,
    language: Sequelize.STRING,
    cti_needed: Sequelize.STRING
  },
  { underscored: true }
);

module.exports = Regulatory;
