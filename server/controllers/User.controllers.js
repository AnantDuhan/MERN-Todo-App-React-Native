import { User } from '../models/user.model.js';
import { sendMail } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';
import fs from 'fs';

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // const avatar = req.files.avatar.tempFilePath;

        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                success: true,
                message: 'User already registered',
            });
        }

        const otp = Math.floor(Math.random() * 1000000); 

        // const myCloud = await cloudinary.v2.uploader.upload(avatar);

        // fs.rmSync('./tmp', { recursive: true });

        user = await User.create({
            name,
            email,
            password,
            avatar: {
                // public_id: myCloud.public_id,
                public_id: "",

                // url: myCloud.secure_url,
                url: "",
            },
            otp,
            otp_expiry: new Date(
                Date.now() + process.env.OTP_EXPIRE * 60 * 1000
            ),
        });

        await sendMail(email, 'Verify Your Account', `Your OTP is ${otp}`);

        let token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                tasks: user.tasks,
            },
            process.env.JWT_SECRET_KEY
        );

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.status(201).cookie('token', token, options).json({
            success: true,
            message: 'OTP sent to your mail, please verify!',
            user,
            token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const verifyAccount = async (req, res, next) => {
    try {
        const otp = Number(req.body.otp);

        const user = await User.findById(req.user._id);

        if (user.otp !== otp || user.otp_expiry < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP or has been expired',
            });
        }

        user.verified = true;
        user.otp = null;
        user.otp_expiry = null;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Account Verified',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // const avatar = req.files;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please Enter Email and Password',
            });
        }

        let user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid User',
            });
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Password',
            });
        }

        let token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                tasks: user.tasks,
            },
            process.env.JWT_SECRET_KEY
        );

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.status(200).cookie('token', token, options).json({
            success: true,
            message: 'logged in Successfully',
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: `logged out successfully`,
    });
};

export const addTasks = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        const user = await User.findById(req.user._id);

        user.tasks.push({
            title,
            description,
            completed: false,
            createdAt: new Date(Date.now()),
        });

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Task added successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const removeTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const user = await User.findById(req.user._id);

        user.tasks = user.tasks.filter(
            (task) => task._id.toString() !== taskId.toString()
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Task removed successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const user = await User.findById(req.user._id);

        user.tasks = user.tasks.find(
            (task) => task._id.toString() === taskId.toString()
        );

        user.tasks.completed = !user.tasks.completed;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Task Updated successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        let token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                tasks: user.tasks,
            },
            process.env.JWT_SECRET_KEY
        );

        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.status(200)
            .cookie('token', token, options)
            .json({
                success: true,
                message: `Welcome back, ${user.name}`,
            });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const { name } = req.body;
        const avatar = req.files.avatar.tempFilePath;
        console.log(avatar);

        if (name) user.name = name;
        if (avatar) {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);

            const mycloud = await cloudinary.v2.uploader.upload(avatar);

            fs.rmSync('./tmp', { recursive: true });

            user.avatar = {
                public_id: mycloud.public_id,
                url: mycloud.secure_url,
            };
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile Updated successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+password');

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res
                .status(400)
                .json({ success: false, message: 'Please enter all fields' });
        }

        const isPasswordMatched = await user.comparePassword(oldPassword);

        if (!isPasswordMatched) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid Old Password' });
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password Updated successfully',
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ success: false, message: 'Invalid Email' });
        }

        const otp = Math.floor(Math.random() * 1000000);

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        const message = `Your OTP for reseting the password ${otp}. If you did not request for this, please ignore this email.`;

        await sendMail(email, 'Request for Reseting Password', message);

        res.status(200).json({
            success: true,
            message: `OTP sent to ${email}`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { otp, newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordOtp: otp,
            resetPasswordExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'OTP Invalid or has been Expired',
            });
        }
        user.password = newPassword;
        user.resetPasswordOtp = null;
        user.resetPasswordOtpExpiry = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: `Password Changed Successfully`,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
