const { response } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({
            email,
        });
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: "User already exists",
            });
        }
        user = new User(req.body);

        //encrypt password
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //JWT generation
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Please talk to the Admin",
        });
    }
};

const userLogin = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: "There are no users with this email",
            });
        }
        //checking passwords
        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: "Invalid password",
            });
        }

        //JWT generation
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Please talk to the Admin",
        });
    }
};

const tokenRefresh = async (req, res = response) => {
    const { uid, name } = req;
    const token = await generateJWT(uid, name);
    res.json({
        ok: true,
        token,
    });
};

module.exports = { createUser, userLogin, tokenRefresh };
