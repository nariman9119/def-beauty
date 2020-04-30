const jwt = require('jsonwebtoken')
const config = require('config')

function auth(req, res, next) {
  const token = req.cookies['x-auth-token']
  if (!token) return res.status(401).send('Access denied. No token provided')

  try {
    req.user = jwt.verify(token, config.get('jwtSecret'))
    next()
  } catch (e) {
    res.status(400).send('Invalid token')
  }
}

module.exports = auth