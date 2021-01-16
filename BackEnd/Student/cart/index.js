const router = require('express').Router();

const { db } = require('../../common/db/sql');
const verifyToken = require('../middlewares/verifyToken');
const Cart = require('./model');

router.get('/', verifyToken, async (req, res) => {
  try {
    const sql = `SELECT 
        s.session_id,
        s.session_name,
        s.session_description,
        s.session_fee,
        s.session_thumbnail,
        c.cart_item_status,
        c.cart_item_id
        FROM
        session_tables as s INNER JOIN cart_tables as c ON  c.session_id=s.session_id AND c.student_id=${req.user.student_id}
        `;
    const result = await db.query(sql, { type: db.QueryTypes.SELECT });
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to get items',
    });
  }
});

router.post('/', verifyToken, async (req, res) => {
  try {
    const { session_id, cart_item_status } = req.body.values;
    console.log(req.body.values);

    const isExist = await Cart.findOne({
      where: { student_id: req.user.student_id, session_id },
    });
    if (isExist) {
      //    Run update query
      const result = await Cart.update(
        { cart_item_status },
        { where: { student_id: req.user.student_id, session_id } }
      );

      console.log(result);
      return res.status(200).json({
        success: 1,
        result,
      });
    } else {
      //    run create query

      const result = await Cart.create({
        session_id,
        cart_item_status,
        student_id: req.user.student_id,
      });
      console.log(result);
      return res.status(200).json({
        success: 1,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to Post Data',
    });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({
        success: 0,
        error: 'Item id not provided',
      });
    const result = await Cart.destroy({
      where: { cart_item_id: req.params.id },
    });
    console.log(result);
    return res.status(200).json({
      success: 1,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: 0,
      error: 'Unable to Delete Data',
    });
  }
});

module.exports = router;
