import jwt from "jsonwebtoken"
export const Auth = async (req, res, next) => {
    const token = req.header("auth")
    if (!token) {
        res.status(401).json({ status: 401, message: "Token not authorized" })
    } else {
        const decode = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decode);
        try {
            if (decode.user) {
                req.user = decode.user.id
            }
            if (decode.admin) {
                req.admin = decode.admin.id
            }
            next()
        } catch (error) {
            res.status(401).json({ status: 401, message: "Token not valid authorized", data: { error } })
        }
    }
}


export const SocketAuth = async (socket, next) => {
    // console.log("Hiiii");
    try {
      const header = socket.handshake.headers.auth;
      if (!header) next(new Error("Unauthorized"))
      const decode = jwt.verify(header, process.env.SECRET_KEY)
      socket.user = decode.user
      next();
    } catch (error) {
      next(new Error("Unauthorized !!, " + error.message));
    }
  }
  