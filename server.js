const app = require("express")();
const httpServer = require("http").createServer(app);
// const options = { /* ... */ };
const io = require("socket.io")(httpServer,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    },
});

const PORT=7000
const users={}


app.get("/",(req,res)=>
{
    return res.status(201).json({name:"server"});
})


io.on("connection", socket => { 
    console.log("someone connected and socket id "+ socket.id)
    // console.log(socket);
    socket.on("disconnect",()=>
    {
        console.log(`socket id ${socket.id} got disconnected`);
        for(let user in users)
        {
            if(users[user]==socket.id)
            {
                delete users[user];
            }
        }
        // console.log(users)
        io.emit("all_user",users);
    })
    socket.on("new_user",(username)=>
    {
        console.log("new user: "+username);
        users[username]=socket.id;
        // console.log(users);
        io.emit("all_user",users);
    })

    socket.on("send_message",(body)=>
    {   console.log("inside server");
        // console.log(body);
        const socketId=users[body.reciever];
        io.to(socketId).emit("new_message",body);
    })

});

httpServer.listen(PORT,()=>
{
    console.log(`sever at ${PORT}`);
});