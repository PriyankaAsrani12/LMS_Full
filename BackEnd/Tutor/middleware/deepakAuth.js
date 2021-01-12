const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    let token = req.cookies['auth-token'];

    if (!token) {
      return res.status(500).json({
        success: 0,
        error: 'Access Denied',
      });
    }
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        return res.status(500).json({
          success: 0,
          error: 'Invalid token',
        });
      }
      req.user = decoded;
      if (!decoded.customer_id)
        return res.status(403).json({
          success: 0,
          error: 'Invalid Token',
        });
      next();
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: 0,
      error: 'Authentication Error',
      errorReturned: err,
    });
  }
};

module.exports = auth;
