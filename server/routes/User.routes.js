import express from "express";
import { register, verifyAccount, login, logout, addTasks, getMyProfile, updateTask, removeTask, updateProfile, updatePassword, forgetPassword, resetPassword } from "../controllers/User.controllers.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/verify').post(isAuthenticated, verifyAccount);

router.route('/logout').get(logout);

router.route('/newtask').post(isAuthenticated, addTasks);

router.route('/me').get(isAuthenticated, getMyProfile);

router
    .route('/task/:taskId')
    .get(isAuthenticated, updateTask)
    .delete(isAuthenticated, removeTask);

router.route('/updateprofile').put(isAuthenticated, updateProfile);

router.route('/updatepassword').put(isAuthenticated, updatePassword);

router.route('/forgetpassword').post(forgetPassword);

router.route('/resetpassword').put(resetPassword);

export default router;