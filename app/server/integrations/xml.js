const xml2js = require('xml2js');

exports.convertToJSON = async function(xml) {
  // console.dir(xml);
  return xml2js.parseStringPromise(xml).then(function(result) {
    // console.log('Done');
    return result;
  });
};
