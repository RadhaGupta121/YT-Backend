
const User = require('../models/UserSchema.js');
const ImageUpload = require('../utils/cloudinary.js');
const jwt = require('jsonwebtoken');
const generateAccessAndRefreshToken = async (userId) => {
   
    const user = await User.findById(userId);
    console.log("this is userId getting from param", userId, "\nthis is user created:", user)
    const accesstoken = user.generateAccesstoken(userId);
    const refreshToken = user.generateRefreshToken(userId);
    console.log("from function accesstoken:", accesstoken, "refreshtoken", refreshToken)
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accesstoken, refreshToken };
}
const registerUser = async (req, res) => {
    //save the above data in mongodb along with this generate accToken, refToken and store refToken in db
    // const user = await new userSchema();
    // const isExist = await user.findOne({ $or: [{ email: email }, { userName: userName }] })
    try {

        const { name, email, password, userName } = req.body;
        if ([name, email, password, userName].some((item) => item?.trim() === "")) {
            res.send({ message: "All fields require" });
        }
        // console.log(req.files);
        const avtarLocalPath = req.files?.avatar?.[0]?.path;
        const coverLocalPath = req.files?.coverImage?.[0]?.path;
        if (!avtarLocalPath) res.send({ message: "Avatar image is required" });
        const cloudinaryAvtarpath = await ImageUpload(avtarLocalPath);
        let cloudniaryCoverPath = "";
        coverLocalPath ? cloudniaryCoverPath = await ImageUpload(coverLocalPath) : "";
        cloudniaryCoverPath ? cloudniaryCoverPath = cloudniaryCoverPath.url : "";
        const avatar = cloudinaryAvtarpath.url;
        const coverImage = cloudniaryCoverPath;
        // console.log("avtar",avatar,coverImage,)
        const isExist = await User.find({email:email});
        //   console.log(isExist);
        if (isExist.length>0) res.send({ message: "User already exist by this mail or username" })
        else {
            const userCreated = new User({ name, email, password, userName, avatar, coverImage });
            // console.log("this is userCreated", userCreated);
            // console.log(userCreated._id);
            const userId=userCreated._id
            const refreshToken = userCreated.generateRefreshToken(userId);
            // console.log("from function refreshtoken", refreshToken)
            userCreated.refreshToken = refreshToken;
            userCreated.save();
            const accessToken=userCreated.generateAccesstoken(userId);
            const options = {
                httpOnly: true,
                secure: true
            }
            // console.log("this is accessToken", accessToken);
            res.status(200).
                cookie('accessToken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .json({ message: "User Register Successfully", userCreated, accessToken, refreshToken });
        }
        // const refreshToken=userCreated. generateRefreshToken(userCreated._id);
        // userCreated.refreshToken=refreshToken;
        // await userCreated.save();
        // res.json({message:true,userinfo:userCreated});
        // console.log(userCreated);
    }

    catch (error) {
        console.log(error);
    }
}

const loginUser = async (req, res) => {
    try {
        if (req.body.email === '' && req.body.userName === '') res.send({ message: "Please fill either emailid or username" })
        const isExist = await User.findOne({ $or: [{ email: req.body.email }, { userName: req.body.userName }] });
        if (!isExist) res.status(201).json({ message: "User not found" });
        else {

            const isCorrectPassword = await isExist.comparePassword(req.body.password, isExist.password)
            if (!isCorrectPassword) res.status(201).json({ message: "Invalid password" });
            else{
                const { accesstoken, refreshToken } = await generateAccessAndRefreshToken(isExist._id);
                const options = {
                    httpOnly: true,
                    secure: true
                }
                console.log("this is accesstoken", accesstoken);
                res.status(200).
                    cookie('accesstoken', accesstoken, options)
                    .cookie('refreshToken', refreshToken, options)
                    .json({ message: "User loggined in Successfully", isExist, accesstoken, refreshToken });
            }
           
        }
    } catch (error) {
        console.log(error);
    }
}

const lougoutUser = async (req, res) => {

    const userId = req.user;
    const logoutOutput = await User.findById(userId);
    logoutOutput.refreshToken = "";
    logoutOutput.save({ validateBeforeSave: false });
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200)
        .clearCookie("accesstoken", options)
        .clearCookie('refreshToken', options)
        .json({ message: "User logout successfully" });

}
const refreshAccessToken = async (req, res) => {
    const tokens = req.cookies.refreshToken || req.body.refreshToken;
    if (!tokens) {
        res.status(201).json({ message: "Unauthorized access, no token available" })
    }
    else {
        const decodedToken = jwt.verify(tokens, process.env.Refresh_Token_Key);
        const user = User.findById(decodedToken.userId);
        if (tokens !== user?.refreshToken) {
            res.status(201).json({ message: "login expired" });
        }
        else {
            const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id);
            const options = {
                httpOnly: true,
                secure: true
            }
            res.status(200)
                .cookie('accesstoken', accessToken, options)
                .cookie('refreshToken', refreshToken, options)
                .json({ message: "Logged in successfully" })
        }
    }
}
const changeCurrentPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user);
        const comparePasswordResult = user.isCorrectPassword(oldPassword);
        if (!comparePasswordResult) res.status(201).json({ message: "Wrong old Password" });
        else {
            user.password = newPassword;
            await user.save({ validateBeforeSave: false });
            res.status(200).json({ message: "password updated successfully" })
        }

    } catch (error) {
        console.log(error)
    }
}
const getCurrentUser = async (req, res) => {
    const userId = req.user;
    console.log("this is userId from getCurrentUser",userId);
    const user = await User.findById(userId).select('-password');
    if (!user) res.status(201).status({ message: "User not found by given id" })
    else {
        res.status(200).json({ message: "User found", user: user })
    }
}
module.exports = { registerUser, loginUser, lougoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser };