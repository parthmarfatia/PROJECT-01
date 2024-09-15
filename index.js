const express = require('express')
const fs = require('fs')
const mongoose = require('mongoose');

const app = express();
const PORT = 8000

mongoose.connect("mongodb://127.0.0.1:27017/youtube-app-1")
.then(()=>console.log('mongo connected'))
.catch(err=>console.log(err))

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    jobTitle:{
        type: String
    },
    gender:{
        type: String
    }
},{timestamps: true})

const User = mongoose.model("user", userSchema)

app.use(express.urlencoded({extended: false}))

app.use((req, res, next) => {
    fs.appendFile('log.txt', `${Date.now()}: ${req.method}: ${req.path}\n`,(err, data) => {
        next()
    })
})


app.get('/users',async (req, res) => {
    const allDbUsers = await User.find({})
    const html = `
        <ul>
            ${allDbUsers.map((user)=> `<li>${user.firstName}-${user.email}</li>`).join('')}
        </ul>
    `
    res.send(html)
})

app.route('/api/users')
.get(async (req, res) => {
    const allDbUsers = await User.find({})
    return res.json(allDbUsers)
})
.post(async (req, res) => {
    const body = req.body
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        return res.status(400).json({message:'All fields are required'})
    }
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title
    })
    console.log('result', result)
    return res.status(201).json({message:'Success'})
})



app.route('/api/users/:id')
.get(async (req, res) => {
    const id = Number(req.params.id)
    const user = await User.findById(req.params.id)
    if(!user) return res.status(404).json({error:"user not found"})
    return res.json(user)
})
.patch(async (req, res) => {
    const body = req.body
    await User.findByIdAndUpdate(req.params.id, {
        firstName: body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title
    })
    return res.json({status: "success"})
})
.delete(async (req, res) => {
   await User.findByIdAndDelete(req.params.id)
   return res.json({status: "Success"})
})

app.listen(PORT,()=>console.log('Server has started'))