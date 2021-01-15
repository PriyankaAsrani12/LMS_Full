const route = require('express').Router();
const Template = require('../schema2');

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
    console.log(req.params.name);
    // const datavalue = await htmlthemes.findById(req.params.id);
    const datavalue = await Template.findOne({
      where: {
        certificate_id: req.params.name,
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
    res
      .status(200)
      .send({ status: true, name: imgname, image_url: `Url of Certiimage` });
  });
});

//string opertaions image path and releveant things in template2 database
route.post('/template', async (req, res) => {
  try {
    console.log(req.body);
    const { name, doctemp, operations, image_url } = req.body;
    const value = await Template.create({
      name,
      doctemp,
      operations,
      image_url,
      customer_id: req.user.customer_id,
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
