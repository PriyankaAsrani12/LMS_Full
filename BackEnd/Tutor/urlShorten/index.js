const router = require('express').Router();
const shortId = require('shortid');

const { ShortUrl } = require('./model');
const auth = require('../middleware/deepakAuth');

router.get('/', auth, async (req, res) => {
  try {
    const result = await ShortUrl.findAll({
      where: { customer_id: req.user.customer_id },
      attributes: {
        exclude: [
          'customer_id',
          'created_at',
          'modified_at',
          'createdAt',
          'updatedAt',
        ],
      },
    });
    if (!result)
      return res.status(400).json({
        success: 0,
        error: 'Failed to fetch details',
      });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'unable to fetch data',
      errorReturned: JSON.stringify(error),
    });
  }
});

router.post('/genShort', auth, async (req, res) => {
  // await ShortUrl.create({ full: req.body.fullUrl })
  const { linkName, full, custom = null } = req.body.values;
  console.log(linkName, full, custom);

  if (!linkName)
    return res.status(400).json({
      success: 0,
      error: 'Provide link name',
    });

  if (!full)
    return res.status(400).json({
      success: 0,
      error: 'Provide full url',
    });

  const isFullUrlPresent = await ShortUrl.findOne({
    where: { link_long_url: full },
  });
  if (isFullUrlPresent)
    return res.status(400).json({
      success: 0,
      error: 'provided long url already exists',
    });

  if (custom) {
    try {
      const check = await ShortUrl.findOne({
        where: { link_short_url: custom },
      });
      if (check)
        return res.status(400).json({
          success: 0,
          error:
            'provided short url already exists...please try with another custom url',
        });
      const savedRecord = await ShortUrl.create({
        customer_id: req.user.customer_id,
        link_name: linkName,
        link_long_url: full,
        link_short_url: custom,
      });
      if (!savedRecord)
        return res.status(400).json({
          success: 0,
          error: 'database error...please try again',
        });
      return res.status(200).json({
        success: 1,
        shortUrl: custom,
        fullUrl: full,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        error: 'database error...please try again',
        errorReturned: JSON.stringify(err),
      });
    }
  } else {
    const id = shortId.generate();
    try {
      const isPresent = await ShortUrl.findOne({
        where: { link_short_url: id },
      });
      if (isPresent)
        return res.status(500).json({
          success: 0,
          error: 'error while generating shortid..please try again',
        });
      const savedRecord = await ShortUrl.create({
        customer_id: req.user.customer_id,
        link_name: linkName,
        link_long_url: full,
        link_short_url: id,
      });
      if (!savedRecord)
        return res.status(500).json({
          success: 0,
          error: 'error while saving record to database...please try again',
        });
      return res.status(200).json({
        success: 1,
        shortUrl: id,
        fullUrl: full,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: 0,
        error: 'database error...please try again',
        errorReturned: JSON.stringify(err),
      });
    }
  }
});

router.get('/:short', async (req, res) => {
  console.log(req.params.short);
  const short = await ShortUrl.findOne({
    where: { link_short_url: req.params.short },
  });
  console.log(short);
  if (!short)
    return res.status(400).json({
      success: 0,
      error: 'requested url does not exists',
    });

  return res.status(200).json({
    success: 1,
    data: short,
  });
});

module.exports = router;
