const jwt = require('jsonwebtoken');


const authorizeRole = (req, res, role) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Please authenticate' });
  const user = jwt.verify(token, 'x-product-token');
  if (user.role !== role) {
    res.status(403).json({ error: 'Forbidden' });
    return false;
  }
  else return true
}
module.exports = { authorizeRole };
