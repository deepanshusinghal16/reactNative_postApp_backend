const { hashPassword, comparePassword } = require("../helper/authHelper");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const { expressjwt: JWT } = require("express-jwt");


const requireSignIn = JWT({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]
})

const registerController = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name)
            return res.status(400).json({
                success: false,
                message: "Name is required"
            })
        if (!email)
            return res.status(400).json({
                success: false,
                message: "Email is required"
            })

        if (!password || password.length < 4 || password.length > 64)
            return res.status(400).json({
                success: false,
                message: "Valid Password is required"
            })

        //if already a user
        const existingUser = await userModel.findOne({ email })
        if (existingUser) return res.status(500).json({
            success: true,
            message: "User already exists",
        })

        const hashedPassword = await hashPassword(password);

        const user = await userModel.create({ name, email, password: hashedPassword });


        return res.status(200).json({
            success: true,
            message: "Successfully registered",
            user
        })

    }
    catch (error) {
        // console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error: in Registration API",
            error,
        })
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(500).json({
                success: false,
                message: "Fill all the fields",
            })
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Invalid username",
            })
        }


        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(500).json({
                success: false,
                message: "Invalid UserName or Password",
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        user.password = undefined

        return res.status(200).json({
            success: true,
            message: "Login successfully",
            token,
            user
        })
    }
    catch (error) {
        // console.error(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure",
            error: error,
        })
    }
}

const updateUserController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (password && password.length < 4) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            })
        }
        // console.log("Updating user")
        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await userModel.findOneAndUpdate({ email }, {
            name: name || user.name,
            password: hashedPassword || user.password,
        }, { new: true });
        updatedUser.password = undefined;
        return res.status(200).json({
            success: true,
            message: "Profile updated Login Again",
            user: updatedUser
        })


    }
    catch (e) {
        // console.log(e);
        return res.status(500).json({
            success: false,
            message: "Updatation Failure",
            error: e,
        })
    }
}

module.exports = { registerController, loginController, updateUserController, requireSignIn }
