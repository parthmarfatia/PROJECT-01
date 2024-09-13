const express = require('express')
const users = require('./MOCK_DATA.json')
const fs = require('fs')

const app = express();
const PORT = 8000

app.use(express.urlencoded({extended: false}))


app.get('/users',(req, res) => {
    const html = `
        <ul>
            ${users.map((user)=> `<li>${user.first_name}</li>`).join('')}
        </ul?
    `
    res.send(html)
})

app.route('/api/users')
.get((req, res) => {
    return res.json(users)
})
.post((req, res) => {
    const body = req.body
    users.push({...body, id: users.length + 1})
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=>{
        return res.json({status: "success", id: users.length})
    })
})



app.route('/api/users/:id')
.get((req, res) => {
    const id = Number(req.params.id)
    return res.json(users.find((user)=> user.id === id))
})
.patch((req, res) => {
    const id = Number(req.params.id)
    const body = req.body
    const index = users.findIndex((user) => user.id === id)
    users[index] = {id, ...body}
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=>{
        return res.json({status: "success", id: users.length})
    })
})
.delete((req, res) => {
    const id = Number(req.params.id)
    const remainingUsers = users.filter((user)=> user.id !== id)
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(remainingUsers), (err, data)=>{
        return res.json({status: "success", id: id})
    })
})

app.listen(PORT,()=>console.log('Server has started'))