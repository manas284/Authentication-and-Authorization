const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register controller
const registerUser = async (req, res) => {
    try {
        // Extract user information from request body
        const { username, email, password, role } = req.body;

        // Check if the user already exists in the database
        const checkExistingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists!'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the new user
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await newlyCreatedUser.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully!'
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'An error occurred while registering. Please try again.'
        });
    }
};

// Login controller
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if the password matches
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Create user token
        const accessToken = jwt.sign({
            userId: user._id,
            username: user.username,
            role: user.role
        }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully!',
            accessToken
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: 'An error occurred while logging in. Please try again.'
        });
    }
};

module.exports = { registerUser, loginUser };
