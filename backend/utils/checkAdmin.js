const jwt = require('jsonwebtoken');

const checkAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res
        .status(401)
        .send({ error: 'Not authorized to access this route' });
    }
    next();
  } catch (error) {
    res.status(401).send({ error: 'Not authorized to access this route' });
  }
};

module.exports = checkAdmin;
