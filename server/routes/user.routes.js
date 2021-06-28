import { verifyToken, isAdmin, isModerator } from '../middleWares/authJwt.js';
import {allUsers} from '../controllers/user.controller.js';
import express from "express";

const router = express.Router();

router.get('/all', async (req, res) => {
  const response = await allUsers();
  res.send(response);
});

// router.get("/user", (req, res) => {
//   const verifiedToken = verifyToken(req);
//   if (verifiedToken.status === 202) {
//     res.send(controller.userBoard);
//   } else {
//     res.send(verifiedToken);
//   }
// });

// router.get("/mod", (req, res) => {
//   const verifiedToken = verifyToken(req);
//   if (verifiedToken.status === 202) {
//     const userModerator = isModerator(req);
//     if (userModerator.status === 202) {
//       res.send(controller.userBoard);
//     } else {
//       res.send(userModerator);
//     }
//   } else {
//     res.send(resp);
//   }

// });

// router.get("/admin", (req, res) => {
//   const verifiedToken = verifyToken(req);
//   if (verifiedToken.status === 202) {
//     const userAdmin = isAdmin(req);
//     if (userAdmin.status === 202) {
//       res.send(controller.adminBoard);
//     } else {
//       res.send(userAdmin);
//     }
//   } else {
//     res.send(verifiedToken);
//   }
// });


export default router;