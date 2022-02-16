const { Router } = require("express");
const { verifySignUp } = require("../middlewares/authIndex");
const { authController } = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authJwt");
const authRouter = new Router();
module.exports = { authRouter };

authRouter.get('/validateToken',verifyToken,authController.validateToken);
authRouter.post(
  "/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
  ],
  authController.signUp
);

authRouter.post("/signin", authController.signIn);

authRouter.post("/logout", authController.Logout);
