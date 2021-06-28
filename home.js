let addTask = document.getElementById("addTask")
let submitTask = document.getElementById("submitTask")

//immediately call this function in order to load tasks on page (if any)
getToDos()

submitTask.addEventListener("click", addTaskToDb)

function getToDos() {

  let request = new XMLHttpRequest()
  request.addEventListener(`load`, getToDosHandler)
  //GET request sends info from cookies to server. Will arrive in server as request.query.userName
  request.open(`GET`, `/todos`)
  request.send()
}

function getToDosHandler() {

  // LEFT OFF HERE: getToDos gets called when page loads, but if there is nothing in the db I will get an error because I cannot call json.parse on this.response
  
  // console.log("this.response =", this.response)
   let serverResponse = JSON.parse(this.response)

  // console.log("this.response =", this.response).tasks 
    //make sure there is tasks in the object
  if (serverResponse.tasks != undefined) {
    let tasks = serverResponse.tasks
    //connect mainDiv tag to a var
    let mainDiv = document.querySelector("#mainDiv")

    //clear existing content on page before adding new
    mainDiv.innerHTML = " "

    // console.log("tasks =", tasks)

      for (let i = 0; i < tasks.length; i++) {
    
        //make div tag and put inside of pDiv
        let div = document.createElement("div")
        mainDiv.appendChild(div)

        //create an input tag and put inside of div
        let input = document.createElement("input")
        input.type = "checkbox"
        input.id = tasks[i]
        input.addEventListener("click", removeTask)
        div.appendChild(input)

        //create a label tag and put inside of div
        let label = document.createElement("label")
        label.innerHTML = tasks[i]
        div.appendChild(label)
        
        // console.log("input.id =", input.id)
        // console.log("mainDiv.innerHTML =", mainDiv.innerHTML)
    }
  }
}

function addTaskToDb() {
//  console.log("addTask.value =", addTask.value)

  if (addTask.value != "") {
  
    let request = new XMLHttpRequest()
    request.addEventListener(`load`, addTaskToDbHandler)
    request.open(`POST`, `/addTask?task=` + addTask.value)
    addTask.value = ""

    request.send()
  }
}

function addTaskToDbHandler() {
  // console.log("this.response =", this.response)
  getToDos()

}

//remove task from db, tied to event listener on all checkboxes
function removeTask() {

  // console.log("removeTask function called")

  let request = new XMLHttpRequest()
  request.addEventListener(`load`, removeTaskHandler)
  request.open(`POST`, `/removeTask?task=` + this.id)

  // console.log ("this.response =", this.response)
  
  request.send()

}

function removeTaskHandler() {
  getToDos()
}