const jwt = require('jsonwebtoken');

const authorizeRole = async (req, res, role,next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401); 

  const user = jwt.verify(token, "x-product-token")
  if ( user.role !== role) {
    res.status(401).send({ error: 'Forbidden' })
  }
  req.user = user;

};


module.exports = { authorizeRole };
