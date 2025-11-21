const bcrypt = require("bcryptjs");
const User = require("../models/User");

class UserService {
    async createUser(userData) {
        const { name, email, password, role, empId } = userData;

        //check if user exists
        const isExist = await User.findOne({ email });
        if(isExist) {
            throw new Error("User already exists");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            passwordHash,
            role,
            empId
        });

        const savedUser = await newUser.save();
        return savedUser;


    }
}

module.exports = new UserService();