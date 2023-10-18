const express = require('express');
const router = express.Router();
const fs = require('fs');

const pathRouter = __dirname;

removeExtension = (filename) => {
  return filename.split('.').shift();
}

fs.readdirSync(pathRouter).filter((file)=>{
  const fileWithOutExt = removeExtension(file);
  const skip = ['index'].includes(fileWithOutExt);
  if (!skip) {

    router.use(`/${fileWithOutExt}`, require(`./${fileWithOutExt}`));
    console.log('cargar rutas: ');
    console.log('----------->', fileWithOutExt);
    
  }

})

router.get('*', (req, res) => {
  res.status(404)
  res.send({ error: 'Not found' })
})

module.exports = router;