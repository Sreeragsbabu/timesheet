const UserService = require("../../services/User");
const RegisterSchema = require("../../validation/auth");

const Controller = async (req, res) => {

  try {
    const {error, value } = RegisterSchema.validate(req.body);
    if(error){
        return res.status(400).send({ error: error.details[0].message });
    }

    const savedUser = await UserService.createUser(value);
    res.send({ savedUser: savedUser });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
};

module.exports = Controller;
