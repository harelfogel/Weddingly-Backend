const { Router } = require("express");
const { verifySignUp } = require("../middlewares/authIndex");
const {authController} = require("../controllers/authController");
const authRouter = new Router();
module.exports = { authRouter };

authController.headerFunction;
authRouter.post(
  "/signup",
  [
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRolesExisted
  ],
  authController.signUp
);

authRouter.post("/signin", authController.signIn);