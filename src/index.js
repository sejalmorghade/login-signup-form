const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const Collection = require('./config')

const app = express()

// convert data into json format
app.use(express.json())

app.use(express.urlencoded({extended: false}))



// use EJS as the view engine
app.set('view engine','ejs')

// static file
app.use(express.static("public"))

app.get("/",(req, res)=>{
  res.render("login")
})

app.get("/signup",(req, res)=>{
  res.render("signup")
})

// Register user
app.post("/signup",async(req, res)=>{

  const data = {
    name: req.body.username,
    password: req.body.password
  }

  // check ifthe user already exists in the database
  const existingUser = await Collection.findOne({name: data.name})

  if(existingUser)
  {
    res.send("User already exist. Please choose a differnt username.")
  }
  else
  {
    // hast the password using bcrypt
    const saltRounds = 10;  // number of salt round for bcrypt
    const hashedPassword = await bcrypt.hash(data.password,saltRounds)

    data.password = hashedPassword //replace the hast password with original password

    const userdata = await Collection.insertMany(data)
    console.log(userdata)
  }

  // check ifthe data is stored in the database
  const dataStored = await Collection.findOne({name: data.name})

  if(dataStored)
  {
    res.render("login")
  }
  else
  {
    res.send("network issue... try again later")
  }
  

})

// login user
app.post("/login",async(req, res)=>{
  try{
    const check = await Collection.findOne({name: req.body.username})

    if(!check)
    {
      res.send("User name cannot found")
    }

    // compare the hast password from the database with the plain text
    const isPasswordMatch = await bcrypt.compare(req.body.password,check.password)

    if(isPasswordMatch)
    {
      res.render("home")
    }
    else
    {
      req.send("Wrong password")
    }
  }
  catch
  {
    res.send("Wrong Details")
  }
})


const port = 5000

app.listen(port,()=>{
  console.log(`Server running on Port: ${port}`)
})