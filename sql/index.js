const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname);

const AllModel = {};

files.filter(f => !f.search(/^[^\.].*\.js$/))
.forEach(f => {
  const fileName = f.replace(/\.js/g, '');
  if (fileName !== 'index') {
    const fileEntity = require(path.join(__dirname, f));
    AllModel[fileName] = fileEntity;
  }
});

module.exports = AllModel;