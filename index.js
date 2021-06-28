let express = require("express")
let app = express()
app.listen(3000)

//look in public folder if endpoint doesn't exist
let staticFiles = express.static(`public`)
app.use(staticFiles)

//endpoint for login page, called by browser
app.get(`/`, async (request, response) => {
 response.sendFile(__dirname + "/login.html")
})

//code to access mongodb. works with mongodb package.
let mongodb = require("mongodb")

const mongoUrl = "mongodb+srv://student:mrcode123@mrcode.uopds.mongodb.net/todo?retryWrites=true&w=majority"
 
let db
let mongoClient = mongodb.MongoClient(mongoUrl, { useUnifiedTopology: true })
 
mongoClient.connect((error, mongoDb) => {
 if (error) {
   console.log(error)
 }
 else {
   db = mongoDb.db(`todo`)
 }
})

//enables index.js to send over info in JSON format. works with body-parser package.
let bodyParser = require("body-parser")
let json = bodyParser.json()
app.use(json)


//endpoint for username check, called by checkForUsername function in login.js
app.post(`/username-check`, async (request, response) => {

  // console.log("request.body", request.body)

  let username = await db.collection("tasks").findOne(
    {
    username: request.body.username
    })

  if (username == null) {

    await db.collection("tasks").insertOne(
      {
      username: request.body.username
      })
    response.send("username added")
  }
  else {
    response.send("username already exists")
  }
})

//endpoint for adding new password to db, called by addPassword function in login.js
app.post(`/add-password`, async (request, response) => {
  
  let passwordAdded = await db.collection(`tasks`).updateOne(
    {
      username: request.body.username
    },

    {
       $set: {
         password: request.body.password
       }
    })

// TODO: THESE STATEMENTS SHOULD BE EVERYWHERE IN ORDER TO MAKE SURE THINGS ARE GETTING INTO DB. SHOULD I BE USING CATCH/TRY?
    if (passwordAdded == null) {
      response.send("error")
    }
    else {
      response.send("password added")
    }
})

//endpoint confirms password called by sendExistingPassword function in login.js
app.post(`/confirm-password`, async (request, response) => {

// console.log("request.body.username =", request.body.username)
// console.log("request.body.password =", request.body.password)
// console.log("request.body =", request.body)

  let passwordConfirmed = await db.collection(`tasks`).findOne(
    {
      username: request.body.username,
      password: request.body.password
    })

// console.log("passwordConfirmed =", passwordConfirmed)

  if (passwordConfirmed == null) {
    response.send("incorrect password")
  }
  else {
    response.send("correct password")
  }

})

//endpoint for home.html, called by addPasswordHandler and confirmPasswordHandler
app.get(`/home`, async (request, response) => {
 response.sendFile(__dirname + "/home.html")
})


//endpoint for function getToDos from home.js.
app.get(`/todos`, async (request, response) => {

  let userDocument = await db.collection(`tasks`).findOne(
    {
      username: request.headers.cookie.split(`;`)[0].split(`=`)[1],

      password: request.headers.cookie.split(`;`)[1].split(`=`)[1]

    })
    // console.log("cookies =", request.headers.cookie)

    // console.log("userDocument =", userDocument)

    //send back entire document from db
    response.send(userDocument)
    
})

//endpoint for function addTaskToDb from home.js.
app.post(`/addTask`, async (request, response) => {

// console.log("request.query =", request.query)
 
//go into db and locate object with username and password from cookies.
  await db.collection(`tasks`).updateOne(
    {
      username: request.headers.cookie.split(`;`)[0].split(`=`)[1],

      password: request.headers.cookie.split(`;`)[1].split(`=`)[1]

    },
  
    {
      //add a new field called "task" and make its value an array which contains request.query.task. Then add additional elements to the same array by using the Update Operator called $each. If I don't use the Update Operator called $each, there is a new array added to the array.
     $addToSet: 
      {
         tasks: 
         {
           $each: [request.query.task]
         }
      }
    }
  )
  response.send()
})
        
// endpoint to remove task when checkbox is clicked
app.post(`/removeTask`, async (request, response) => {
  await db.collection(`tasks`).updateOne(
    {
      username: request.headers.cookie.split(`;`)[0].split(`=`)[1],

      password: request.headers.cookie.split(`;`)[1].split(`=`)[1]

    },
  
    {
     $pull: 
      {
         tasks: request.query.task
      }
    }
  )
  // console.log("request.query.task=", request.query.task)

  response.send("task removed from db")
})
