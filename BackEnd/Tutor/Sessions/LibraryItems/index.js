const router = require('express').Router();
const auth = require('../../middleware/deepakAuth');
const { LibraryItem } = require('./model');
const recordedSessionRouter = require('./recorded');
const path=require("path");
const cmd=require("node-cmd");
const { db } = require('../../../common/db/sql');


router.use('/recorded', recordedSessionRouter);

const isValidFileFormat = (ext) => {
  const arr = [
    'txt',
    'rtf',
    'pdf',
    'odt',
    'dotx',
    'dotm',
    'docx',
    'docm',
    'doc',
  ];
  return arr.indexOf(ext) >= 0;
};
// Upload Endpoint
router.post('/upload', auth, async (req, res) => {
  try {
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    const file = req.files.file;
    const { session_id, session_type, item_type } = req.body;

    if (!isValidFileFormat(file.name.slice(file.name.lastIndexOf('.') + 1)))
      return res.status(400).json({
        success: 0,
        error: 'only pdf and word formats are allowed',
      });


      const bData = await db.query(
        `SELECT customer_storage_zone_user_key,customer_storage_zone_name FROM customer_tables WHERE customer_id=${req.user.customer_id} `,
        { type: db.QueryTypes.SELECT }
      );
    file.mv(`./${process.env.FILE_UPLOAD_PATH_CLIENT}/${file.name}`, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).josn({
          success: 0,
          error: 'could not upload file',
          errorReturned: JSON.stringify(err),
        });
      }
      let nameis=file.name.split('.').slice(0, -1).join('.');
      let newname=`${nameis}-${Date.now()}${path.parse(file.name).ext}`;
      
        const command=  cmd.runSync(`
        bnycdn cp -s ${bData[0].customer_storage_zone_name}  ./upload/${file.name}  ./${bData[0].customer_storage_zone_name}/sessionMaterials/${newname}
        `,
        async (err, data, stderr) => {
            if (err) console.log(err,"upload error");
            else {
            console.log("data is ",data);
            
            }
          })

      console.log(command);



    const newRecord = await LibraryItem.create({
      session_id,
      session_type,
      customer_id: req.user.customer_id,
      item_name: file.name,
      item_type,
      item_url: `https://${bData[0].customer_storage_zone_name}/sessionMaterials/${newname}`,
      item_size: file.size,
    });

    if (!newRecord)
      return res.status(400).json({
        success: 0,
        error: 'error while saving to database',
      });
     
      
      res.status(200).json({
        success: 1,
        fileName: file.name,
        fileSize: file.size,
        item: newRecord,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'error while uploading',
      errorReturned: JSON.stringify(err),
    });
  }
});

module.exports = router;
