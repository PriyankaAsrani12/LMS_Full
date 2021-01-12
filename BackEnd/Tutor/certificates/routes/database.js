const route = require('express').Router();
const Template = require('../schema2');
const auth = require('../../middleware/deepakAuth');

route.get('/2', async (req, res) => {
  try {
    const datavalues = await Template.findAll();
    res.json(datavalues);
  } catch (err) {
    res.send('error' + err);
  }
});

route.get('/2/:name', async (req, res) => {
  try {
    // const datavalue = await htmlthemes.findById(req.params.id);
    const datavalue = await template2.find({
      where: {
        'temp.name': req.params.name,
      },
    });
    res.json(datavalue);
  } catch (err) {
    res.send('error' + err);
  }
});

route.post('/imageupload', async (req, res) => {
  console.log('file properties----------------------------');
  console.log(req.files);

  console.log('file name-------------');
  console.log(req.files.certiimage.name);
  let imgname = req.files.certiimage.name;

  const file = req.files.certiimage;
  file.mv(`${process.env.FILE_UPLOAD_PATH_CLIENT}${file.name}`, (err) => {
    if (err)
      return res.status(400).json({
        status: false,
        error: 'Could not save image',
      });
    console.log('imaged saved successfully');
  });

  res.send({ status: true, name: imgname });
});

//string opertaions image path and releveant things in template2 database
route.post('/template', async (req, res) => {
  try {
    console.log(req.body);
    const { name, doctemp, operations } = req.body;
    const value = await Template.create({
      name,
      doctemp,
      operations,
    });
    if (!value)
      return res.status(400).json({
        status: false,
        error: 'could not save template',
      });
    return res.status(200).json({
      status: true,
      value,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: false,
      err,
    });
  }
});

exports = module.exports = route;
