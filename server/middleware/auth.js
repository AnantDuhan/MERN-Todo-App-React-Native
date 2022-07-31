import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js'

export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Login First',
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        req.user = await User.findById(decodedToken.id)

        next();
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
