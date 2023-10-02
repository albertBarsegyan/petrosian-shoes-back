const { Router } = require('express');
const User = require('../models/User');
const router = Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

// /api/auth/register
router.post(
    '/register',
    [
        check('login', 'Enter login').exists(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                // console.log(errors);
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Wrong registering values'
                });
            }

            const { login, password } = req.body;
            const candidate = await User.findOne({ login });

            if (candidate) {
                res.status(400).json({ message: 'Already registered' })
                return
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ login, password: hashedPassword });
            await user.save();
            res.status(201).json({ message: 'User created' });
            return
        } catch (e) {
            res.status(500).json({ message: 'something went wrong from api/reg' })
        }
    });

// /api/auth/login
router.post(
    '/login',
    [
        check('login', 'Enter login').exists(),
        check('password', 'Wrong password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Wrong login values'
                });
            }

            const { login, password } = req.body;
            const user = await User.findOne({ login });
            if (!user) {
                return res.status(400).json({ message: 'User not registered' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Wrong password' });
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
            );

            res.json({ token, userId: user.id })
            return
        } catch (e) {
            res.status(500).json({ message: 'something went wrong from api/reg' })
        }
    });

module.exports = router;