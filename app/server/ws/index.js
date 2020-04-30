let socketio = require("socket.io");
const jwt = require("jsonwebtoken");
const config = require("config");

const logger = require("../logger");

const sockets = [];

class CustomError extends Error {
  constructor(name, code) {
    super(name);
    this.data = { name, code };
  }
}

const tokenValidate = (socket, next) => {
  let token = socket.handshake.query.token;
  if (!token) {
    let err = new CustomError(`Authentication error. Token required`, 401);
    logger.error(3, err);
    socket.disconnect();
    return next(err);
  }
  let payload;
  try {
    payload = jwt.verify(token, config.get("jwtSecret"));
  } catch (err) {
    logger.error(4, err.toString());
    return next(new CustomError(`Token error: ${err.toString()}`, 401));
  }
  if (!payload.hasOwnProperty("_id"))
    return next(new CustomError("JWT has no login property", 401));

  socket._id = payload._id;
  logger.info(`Token validated:`, payload);
  return next();
};

exports.setupSocket = server => {
  let io;
  if (process.env.NODE_ENV === "development")
    io = socketio(server, { origins: "http://localhost:3000" });
  else io = socketio(server);

  // middleware
  io.use(tokenValidate);

  io.on("connection", function(socket) {
    console.log("---NEW WS CONNECTION");
    console.log("_id", socket._id);

    if (sockets.find(s => s.id === socket.id)) {
      return;
    }

    sockets.push(socket);

    // socket.on('PostStepComment', async payload => {
    //   const {step_id, text, author} = payload
    //   if (!step_id) return
    //   const comment = new Comment({step_id: step_id.toObjectId(), text, author})
    //   await comment.save()
    //
    //   console.log('---NEW COMMENT', sockets.length)
    //   sockets.forEach(s => s.emit('StepComment', comment))
    // })
  });
};

exports.sockets = sockets;
