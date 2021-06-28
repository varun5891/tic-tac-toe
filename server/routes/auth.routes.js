import { checkDuplicateUsernameOrEmail, checkRolesExisted } from '../middleWares/verifySignUp.js';
import { signin, signup } from '../controllers/auth.controller.js';
import express from "express";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const isDuplicate = await checkDuplicateUsernameOrEmail(req);
  if (isDuplicate.status === 200) {
    const isRoleExisted = await checkRolesExisted(req);
    if (isRoleExisted.status === 200) {
      const isSignedUp = await signup(req);
      res.send(isSignedUp);
    } else {
      res.send(isRoleExisted);
    }
  } else {
    res.send(isDuplicate)
  }
}
);

router.post("/signin", async (req, res, next) => {
  const isUserVerified = await signin(req);
  res.send(isUserVerified);
});

export default router;