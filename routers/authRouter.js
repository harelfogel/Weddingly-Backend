const { Router } = require("express");
const { verifySignUp } = require("../middlewares/authIndex");
const { authController } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authJwt");
const authRouter = new Router();
module.exports = { authRouter };

const headerFunction = (req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
}
authRouter.get('/validateToken',verifyToken,authController.validateToken);
authRouter.post(
  "/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted
  ],
  authController.signUp
);

authRouter.post("/signin",headerFunction, authController.signIn);
