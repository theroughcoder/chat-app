import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv"; 
import userRouter from './router/userRouter.js'
import chatRouter from './router/chatRouter.js'

dotenv.config();
  
mongoose.connect(process.env.MONGODB_URL).then(()=> {console.log("Connect to DB")}
).catch(err => console.log(err.message))

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/users", userRouter); 
app.use("/api/chats", chatRouter);

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, '/frontend/build')));
app.get("*", (req, res) =>
res.sendFile(path.join(_dirname, 'frontend/build/index.html')));

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

// const httpServer = http.Server(app);
const server = createServer(app);
const io = new Server(server);       

const users = [];

io.on("connection", (socket) => {

  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);
    if(user){
      user.online = false;
      console.log('Offline', user.name);
    } 
  }); 

   socket.on('onLogin', (user)=>{
    const updatedUser ={
      ...user,
      online: true,
      socketId : socket.id,
      message: {}
    };
   
    const existUser = users.find((x) => x._id === updatedUser._id);
    if(existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
      console.log('online', existUser.name)
    }else{
      users.push(updatedUser);
    
      console.log('online', updatedUser.name)
    }
 
   })  
  
  //  socket.on('openChat', (id)=>{
  //     const user = users.filter((x)=> x._id === id);
  //     io.to(user.socketId).emit('chats', user.message);
  //  }) 
 
   socket.on('message', ({messageBody, id})=>{
 
     const user = users.find((x)=> x._id === id);
   
   if(user){

     io.to(user.socketId).emit('sendMessage', messageBody) 
   }
   })   
});        
  
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server at http://localhost:${port}`);
});

// app.listen(port, () => {
//   console.log(`Server is running at port ${port}`);
// });
