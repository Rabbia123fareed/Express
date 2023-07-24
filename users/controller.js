const mongoose = require('mongoose')
require('dotenv').config()
const User = require('./schema')
const { hash, compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { connect } = require('mongoose')



const SignUp = async (req, res) => {
    const { username, password, email } = req.body;
    console.log({ username, password, email })
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB Connected")
        const existingUser = await User.exists({ email: email })
        if (existingUser) {
            res.status(208).json({
                message: " Already Exists User "
            })
        }

        else {
            await User.create({ username, email, password: await hash(password, 12) })
            console.log("User Created")
            res.status(201).json({
                message: "Signup Successfully"
            })
        }
    }
    catch (error) {
        res.json({
            message: error.message
        })
    }
}

const Login = async (req, res) => {

    const { password, email } = req.body;

    try {
        await mongoose.connect(process.env.MONGO_URI)
        const existingUser = await User.findOne({ email: email })

        if (!existingUser) {
            res.status(404).json({
                message: "Not found"
            })
        }

        else {

            const decryptPassword = await compare(password, existingUser.password)
            if (email == existingUser.email && decryptPassword) {
                const token = sign(
                    {
                        id: existingUser._id,
                        username: existingUser.username,
                        email: existingUser.email
                    }
                    ,
                    process.env.JWT_SECRET
                )

                res.json({
                    message: "Successfully Login",
                    token: token
                })
            }

            else {
                res.json({
                    message: "invalid "
                })
            }





        }

    }
    catch (error) {
        res.json({
            message: error.message
        })

    }
}

const allUsers = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        const Users = await User.find()
        res.json(
            {
                Users: Users
            }
        )

    }

    catch (error) {
        res.json(
            {
                message: error.message
            }
        )

    }
}


const getUserbyEmail = async (req, res) => {

    const { email } = req.params


    try {
        await mongoose.connect(process.env.MONGO_URI)
        const Users = await User.findOne({ email: email })
        res.json(
            {
                Users: Users
            }
        )

    }

    catch (error) {
        res.json(
            {
                message: error.message
            }
        )

    }
}






module.exports = { SignUp, Login, allUsers, getUserbyEmail,  }