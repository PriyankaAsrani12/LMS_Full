const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  if (!req.cookies['auth-token'])
    return res.status(401).send('You are not logged in');
  try {
    const token = req.cookies['auth-token'];
    const verified = jwt.verify(token, process.env.JWT_KEY);
    if (!verified.student_id)
      return res.status(403).json({
        success: 0,
        error: 'Invalid Token',
      });
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: 0,
      error: 'Invalid Token',
    });
  }
};

module.exports = verifyToken;
