const mongoose = require('mongoose')
const connect = mongoose.connect("mongodb://localhost:27017/Login-Page")

// check database connected or not

connect.then(()=>{
  console.log("Database connected Successfully")
})
.catch(()=>{
  console.log("Database cannot be connected")
})

// Create a schema
const LoginSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  }
})

// Collection part

const Collection = new mongoose.model("users",LoginSchema)

module.exports = Collection