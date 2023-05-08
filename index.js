const express = require("express");
const app = new express();
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');


const port = process.env.PORT || 4500;



const users = [{}];

app.use(cors());

app.get("/", (req, res) => {
    res.send("hello it is me")
})

const server = http.createServer(app);

const io = socketIO(server);
io.on("connection", (socket) => {
    console.log("new connection");
    socket.on('joined', ({ user }) => {
        users[socket.id] = users;
        console.log(`${user} is joined`)
        socket.broadcast.emit('userjoined', { user: "Admin", message: `${users[socket.id]} has joined` })
        socket.emit('welcome', { user: "Admin", message: "welcome to the chat" });

    })
    socket.on('message', ({ message, id }) => {
        io.emit('sendmessage', { user: users[id], message, id })

    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', { user: "Admin", message: `${users[socket.id]} has leaved` })
        console.log('userleft')
    })
})




server.listen(port, () => {
    console.log(`it is connected to port http://localhost:${port}`);
})