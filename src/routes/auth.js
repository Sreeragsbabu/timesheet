const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//register
router.post('/register', require("../routes/auth/register"));

//login
router.post('/login', async(req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).send({ error: 'user not found' });
        }
        const isMatch = await bcrypt.compare(password, user.passwordHash);
         if (!isMatch) return res.status(400).send({ error: 'invalid' });
        const token = jwt.sign(
            {id: user.id, role: user.role, name: user.name},
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )
        res.send({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }catch(e){
        res.status(500).send({ error: e.message });
    }
})

module.exports = router;
