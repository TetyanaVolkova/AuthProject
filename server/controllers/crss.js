const Models = require('../models');

exports.getCrss = 
( req, res ) => {
  let siteNumber = 0;
  const limit = +req.query.limit;
  const pageIndex = +req.query.pageIndex;
  const filteredArray = [];
  let laboratoryList = [ ];
  let search = '';
  if ( req.query.searchString ) {
    search = req.query.searchString.toLowerCase();
  } else {
    search = '';
  }
  const offset = pageIndex*limit;
  Models.Crs.findAll({
    include: [
      {
        model: Models.Regulatory
      },
      {
        model: Models.Laboratories,
        include: [
          {
            model: Models.Crs,
            as: 'related_lab',
            attributes: ['crs_id', 'crs_name', 'crs_type']
          }
        ]
      }
    ],
    order: ['crs_id']
  })
  .then( crsList => {
    crsList.forEach(list => {
      const crs = list.dataValues;
      crs.laboratories.forEach( labs => {
        if ( laboratoryList.findIndex( lab => lab.lab_id === labs.lab_id) === -1 ) {
          laboratoryList.push({lab_id: labs.lab_id, lab_name: labs.lab_name});
        }
      });
      const crsName = crs.crs_name.toLowerCase();
      if ( crs.regulatory === null ) {
        crs.regulatory = {
          id: null,
          ctu_name: '',
          associated_regulatory_crs: crs.crs_name,
          crs_id: crs.crs_id,
          regulatory_authority_name: '',
          local_irb_ec_name: '',
          other_irb_ec_name: '',
          established_ibc: '',
          ibc_name: '',
          language: '',
          cti_needed: ''
        }
      };
      if ( crsName.includes(search )) {
        siteNumber++;
        filteredArray.push(list);
      }
    });
    const crss = filteredArray.map( m => m.dataValues );
    let result = Math.max.apply(Math, crss.map(function(crs) {
      return crs.regulatory.id + 1;
    }));
    let finalArray = [];
    filteredArray.forEach( list => {
      const crs = list.dataValues;
      finalArray.push(crs);
      if ( crs.regulatory.id === null ) {
        crs.regulatory.id = result++;
      }
    });
    finalArray = filteredArray;
    let count = filteredArray.length;
    if (limit) {
      finalArray = filteredArray.splice(offset, limit);
    }
    res.json( [finalArray.map( m => m.dataValues ), siteNumber, laboratoryList] );
  })
  .catch( err => {
    console.error( err );
  });
}