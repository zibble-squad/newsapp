const asyncHandler = require('express-async-handler');
const generateToken = require('../utils/generateToken');
const User = require('../models/user');
const { mailer } = require('../mailer/mailer'); 
require('dotenv').config(); 

// @desc    Register a new user
// @route   POST /api/users
// @access  Public 
const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const { username, email, password, type } = req.body
        const userExists = await User.findOne({ email })
        if (userExists && userExists.active) {
            return res.status(400).json({
                success: false,
                msg: 'Entered email id already registered with us. Login to continue'
            })
        } else if (userExists && !userExists.active) {
            return res.status(200).json({
                success: false,
                msg: 'Account Created But Need To Activate. A Link Sent with your registered Phone Nummber'
            })
        }
        // set expiration time is 24 hours
        // For expiration !
        // const activeExpires = Date.now() + 24 * 3600 * 1000;
        var enteredEmail = req.body.email
        const user = new User({
            username,
            email,
            password,
            type,
            // activeExpires
        })
        // save user object in db
        user.save(function (err, user) {
            if (err) {
                return next(err)
            } else {
                // Sending Activation Mail !
                var myLink = 'Please Click <a href="' + `http://localhost:${process.env.PORT}/api/users/active?userId=${user._id}` + '">Here</a> To Activate Your Account.'
                mailer(enteredEmail, myLink)
                res.status(201).json({
                    success: true,
                    msg: 'The Activation Link has been sent to your ' + user.email + ',Please click the Activation Link within 24 hours'
                });
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Server issue',
            error: error
        });
    }

});
// @To activate a user account
const activateUser = async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await User.findOne({ _id: userId })
        if (user) {
            const updUser = await User.updateOne({ _id: userId }, { $set: { active: true } })
            if (updUser.acknowledged) {
                res.status(200).json({
                    success: true,
                    msg: 'User Has Been Activated Successfully !',
                    error: "no error"
                });
            } else {
                res.status(400).json({
                    success: false,
                    msg: 'User Not Activated.',
                    error: "User Not Activated Please Try Again."
                });
            }
        } else {
            res.status(400).json({
                success: false,
                msg: 'User Not Found.',
                error: "User Not Found"
            });
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'something went wrong Internal server error',
            error: err,
        });
    }
}
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public 
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && (await user.matchPassword(password)) && user.active) {
        if (user.type === "user") {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                type: user.type,
                token: generateToken(user._id),
            })
        } else {
            // --- To send more data if role other than user ---
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                type: user.type,
                token: generateToken(user._id),
            })
        }
    } else {
        res.status(401).json({
            success: false,
            msg: 'Unauthorized user'
        })
    }
})
// @desc    Get User Profile
// @route   GET /api/users/user-profile
// @access  Public 
const getUserData = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById({ _id: req.query.id })
        if (user) {
            res.status(200).json({
                success: true,
                _id: user._id,
                username: user.username,
                email: user.email,
                type: user.type,
            })
        } else {
            res.status(401).json({
                success: false,
                msg: 'user not found'
            })
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "internal Server error",
            error: err,
        })
    }
})

// @desc    POST Update User Profile
// @route   GET /api/users/update-profile
// @access  Public 
const updateUserData = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById({ _id: req.query.id })
        if (user) {
            user.username = req.body.username || user.username
            user.email = req.body.email || user.email
            user.type = req.body.type || user.type
            const updateUser = await user.save();
            res.status(200).json({
                success: true,
                _id: updateUser._id,
                username: updateUser.username,
                email: updateUser.email,
                type: updateUser.type,
                token: generateToken(updateUser._id),
            })
        } else {
            res.status(404).json({
                success: false,
                msg: "User Not Found",
            })
        }
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "internal Server error",
            error: err,
        })
    }
})

// // @desc    validating token
// // @route   POST /api/users/email-send
// // @access  Private
// const emailSend = async (req, res) => {
//     const { email } = req.body
//     const user = await User.findOne({ email })
//     const responseType = {}
//     if (user) {
//         let otpcode = Math.floor((Math.random() * 1000000) + 1)
//         const otpData = new Otp({
//             email: email,
//             code: otpcode,
//             expiresIn: new Date().getTime() + 300 * 1000
//         })
//         let otpResponse = await otpData.save()
//         responseType.statusText = "Success"
//         responseType.message = "Please check your Email Id"
//         mailer(email, otpcode)
//     } else {
//         responseType.statusText = "error"
//         responseType.message = "Email Id is not Exist"
//     }
//     res.status(200).json(responseType)
// }

// // @desc    validating token
// // @route   POST /api/users/validate-token
// // @access  Private
// const validateToken = asyncHandler(async (req, res) => {
//     const { email, code } = req.body
//     const data = await Otp.findOne({ email, code })
//     const response = {}
//     if (data) {
//         const currentTime = new Date().getTime()
//         const diff = data.expiresIn - currentTime
//         if (diff < 0) {
//             response.statusText = 'error'
//             response.message = 'Token Expire'
//         } else {
//             response.statusText = 'success'
//             response.message = 'Token Validated'
//         }
//     } else {
//         response.statusText = 'error'
//         response.message = 'Invalid Otp'
//     }
//     res.status(200).json(response)
// })

// // @desc    change password
// // @route   POST /api/users/change-password
// // @access  Private
// const changePassword = asyncHandler(async (req, res) => {
//     const { email, password } = req.body
//     const user = await User.findOne({ email })
//     if (user) {
//         user.password = password
//         user.save(function (err, user) {
//             if (err) {
//                 res.status(200).json({
//                     statusType: 'error',
//                     message: 'something went wrong'
//                 });
//             }
//             else {
//                 res.status(200).json({
//                     statusType: 'success',
//                     message: 'Password Updated Successfully, plz Login'
//                 });
//             }

//         });
//     }
// })



module.exports = {
    // registerUser, authUser, emailSend, changePassword, validateToken
    registerUser,
    activateUser,
    authUser,
    getUserData,
    updateUserData
}


