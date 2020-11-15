const router = require('koa-router')();
const fs = require('fs');
const path = require('path');


const files = fs.readdirSync(__dirname);
files.filter(f => !f.search(/^[^\.].*\.js$/))
.forEach(f => {
  const fileName = f.replace(/\.js/g, '');
  console.log(fileName);
  if (fileName !== 'index') {
    const fileEntity = require(path.join(__dirname, f));
    router.use(`/${fileName}`, fileEntity.routes(), fileEntity.allowedMethods());
  }
})

module.exports = router;