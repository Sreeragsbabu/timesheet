const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


//register
router.post('/register', async(req, res)=> {
    try{
        console.log(req.body);
        const {name, email, password, empId, role} = req.body;
        const existing = await User.findOne({ email });
        if(existing){
            return res.status(400).send({ error: 'email exists' });
        }
        const hash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, passwordHash: hash, role, empId });
        const savedUser = await user.save();
        res.send({ savedUser: savedUser });
    }catch(e){
        res.status(500).send({ error: e.message });
    }
});

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
