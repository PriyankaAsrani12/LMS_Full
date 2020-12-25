const router = require('express').Router();
const auth = require('../../middleware/deepakAuth');
const { LibraryItem } = require('./model');
const recordedSessionRouter = require('./recorded');

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
router.post('/upload', auth, async(req, res) => {
  try {
    if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }
    const file = req.files.file;
    const { session_id, session_type,item_type } = req.body;

    if (!isValidFileFormat(file.name.slice(file.name.lastIndexOf('.') + 1)))
      return res.status(400).json({
        success: 0,
        error:'only pdf and word formats are allowed'
      })

    const newRecord = await LibraryItem.create({
      session_id,
      session_type,
      customer_id: req.user.customer_id,
      item_name: file.name,
      item_type,
      item_url: 'https://www.google.com',
      item_size:file.size
    })

    if (!newRecord)
      return res.status(400).json({
        success: 0,
        error: 'error while saving to database',
      })
    

    file.mv(`${process.env.FILE_UPLOAD_PATH}${file.name}`, err => {
      if (err) {
        console.error(err);
          return res.status(500).josn({
              success: 0,
              error: 'could not upload file',
              errorReturned:JSON.stringify(err)
        });
      }

      res.status(200).json({
        success: 1,
        fileName: file.name,
        fileSize: file.size,
        item:newRecord
      });
    });
    
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: 0,
      error: 'error while uploading',
      errorReturned:JSON.stringify(err)
    })
  }
});

module.exports = router;