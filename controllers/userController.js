const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const User = require('../models/userModel')
const HttpError = require('../models/errorModel')
const {v4: uuidv4} = require('uuid')

//=================Register User==================//
//POST: api/users/register
//UNPROTECTED

const  registerUser = async (req, res, next) => {
    try {
        const {name, email, password, password2} = req.body
        if(!name || !email || !password || !password2) {
            return next(new HttpError("Please enter all fields", 422))
    }
    const newEmail = email.toLowerCase()
    const emailExists = await User.findOne({email: newEmail})
    if(emailExists) {
        return next(new HttpError("Email already exists", 422))
    }
    if((password.trim()).length < 6) {
        return next(new HttpError("Password must be at least 6 characters", 422))
    }
    if(password !== password2) {
        return next(new HttpError("Passwords do not match", 422))
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    const newUser = await User.create({
        name,
        email: newEmail,
        password: hashPassword
    })
    res.status(201).json(`new User ${newUser.email} registered`)
}
    catch (error) {
        return next(new HttpError("User registration failed", 422))
    }
    
}

//=================Login a Registered User==================//
//POST: api/users/login
//UNPROTECTED

const  loginUser = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        console.log(password);
        if(!email || !password) {
            return next(new HttpError("Please enter all fields", 422))
        }
        const newEmail = email.toLowerCase()
        let user = await User.findOne({email: newEmail})
        console.log(user);
        if(!user) {
            return next(new HttpError("User does not exist", 422))
        }
        user=user.toObject()
        const comparePass = await bcrypt.compare(password, user.password)
        
        if(!comparePass) {
            return next(new HttpError("Invalid credentials", 422))
        }
        const {_id:id, name}=user;
        const token = jwt.sign({id, name}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
        res.status(200).json({id, name, token})
    } catch (error){
        console.log(error)
        return next(new HttpError("Login failed", 422))
    }
    
}

//=================User Profile
//POST: api/users/:id
//PROTECTED

const  getUser = async (req, res, next) => {
    try{
        const {id} = req.params
        const user = await User.findById(id).select("-password");
        if(!user) {
            return next(new HttpError("User does not exist", 422))

    }
    res.status(200).json(user)
    }
    catch (error){
        return next(new HttpError(error))
    }
    res.json("User Profile")
}


//=================Change USER AVATAR
//POST: api/users/:change-avatar
//PROTECTED

const  changeAvatar = async (req, res, next) => {
    try{
        if(!req.file.avatar) {
            return next(new HttpError("Please upload an image", 422))
        }
        // find user from database
        const user = await User.findById(req.user.id)
        //delete old avatar
        if(user.avatar) {
            fs.unlink(path.join(__dirname, '../uploads',user.avatar), (err) => {
                if(err) { return next(new HttpError(err, 422))
            }
        })
        }
       const {avatar} = req.file;
       //check file size
       if(avatar.size > 500000) {
           return next(new HttpError("File size too large. Should be less than 500kb", 422))
       }
       let fileName;
       fileName = avatar.name;
       let splittedFileName = fileName.split(".");

       const newFilename = splittedFilename[0] + "-" + uuid() + "." + splittedFileName[splittedFileName.length - 1];
       avatar.mv(__dirname, "..", "uploads",newFilename, async (err)=>{
           if(err) return next(new HttpError(err, 422))
       });
 
       //update database
       const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar: newFilename}, {new: true})
       if(!updatedAvatar) {
           return next(new HttpError("User does not exist", 422))
       }
       res.status(200).json(updatedAvatar)
       //save avatar
       user.avatar = avatar
       await user.save()
       res.status(200).json("Avatar changed")
    }
    catch(error){
        return next(new HttpError(error))
    }
}

//=================EDIT USER DETAILS()
//POST: api/users/edit-user
//PROTECTED

const  editUser = async (req, res, next) => {
    try{
        const {name, email, currentPassword, newPassword, confirmPassword} = req.body
        if(!name || !email || !currentPassword || !newPassword || !confirmPassword) {
            return next(new HttpError("Please enter all fields", 422))
        }
    
        let user = await User.findById(req.user.id)
        if(!user) {
            return next(new HttpError("User does not exist", 422))
        }
        if(newPassword !== confirmPassword) {
            return next(new HttpError("Passwords do not match", 422))
        }
        user = user.toObject()
        
        const comparePass = await bcrypt.compare(currentPassword, user.password)
        if(!comparePass) {
            return next(new HttpError("Invalid credentials", 422))
        }
        const hashPassword = await bcrypt.hash(newPassword, 10)
        
        const emailExist = await User.findOne({email})
        if(!emailExist) {
            return next(new HttpError("Email already exists", 422))
        }
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {name, email, password: hashPassword}, {new: true})
        if(!updatedUser) {
            return next(new HttpError("User does not exist", 422))
        }
        res.status(200).json(updatedUser)

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)
        user.password = hash

        //update user info in database
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: hash}, {new: true})
        res.status(200).json(newInfo)
    } catch(error){
        return next(new HttpError(error))
    }
}



//=================GET AUTHORS
//POST: api/users/authors
//UNPROTECTED

const  getAuthors = async (req, res, next) => {
    try{
        const authors = await User.find({}).select("-password");
        res.json(authors);
    }
    catch (error){
        return next(new HttpError(error))
    }
}

module.exports={
    registerUser,loginUser,getUser,changeAvatar,editUser,getAuthors}

