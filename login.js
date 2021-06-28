let username = document.getElementById("username")
let submitUsername = document.getElementById("submitUsername")

let newPassword = document.getElementById("newPassword")
let submitNewPassword = document.getElementById("submitNewPassword")

let existingPassword = document.getElementById("existingPassword")
let submitExistingPassword = document.getElementById("submitExistingPassword")

let paragraph = document.getElementById("paragraph")

submitUsername.addEventListener("click", checkForUsername)
submitNewPassword.addEventListener("click", addPassword)
submitExistingPassword.addEventListener("click", sendExistingPassword)

//check for existing username. if it doesn't exist, add it
function checkForUsername() {

  let requestBody = {
    username: username.value
  }

  let request = new XMLHttpRequest()
  request.addEventListener(`load`, usernameConfirmation)
  request.open(`POST`, `/username-check`)
  request.setRequestHeader("Content-Type", "application/json")

  request.send(JSON.stringify(requestBody))
}

function usernameConfirmation() {
  //console.log(this.response)

  if (this.response == "username added") {
    //add username to cookies here
    document.cookie = "username=" + username.value

    //show new password HTML code
    newPasswordSection.style.display = "block"
  } 
  else {
    existingPasswordSection.style.display = "block"
  }
  //hide username HTML code
  usernameSection.style.display = "none"
}

//sends new password to db
function addPassword() {

  let requestBody = {
    username: username.value,
    password: newPassword.value
  }

  let request = new XMLHttpRequest()
  request.addEventListener(`load`, addPasswordHandler)
  request.open(`POST`, `/add-password`)
  request.setRequestHeader("Content-Type", "application/json")

  request.send(JSON.stringify(requestBody))
}

function addPasswordHandler() {
  if (this.response == "password added") {
    //add password to cookies
    document.cookie = "password=" + newPassword.value
    location.href = "/home"
  }
}

//checks to see if password and email match in db
function sendExistingPassword() {

   let requestBody = {
    username: username.value,
    password: existingPassword.value
  }

  let request = new XMLHttpRequest()
  request.addEventListener(`load`, passwordConfirmed)
  request.open(`POST`, `/confirm-password`)
  request.setRequestHeader("Content-Type", "application/json")

  // console.log("requestBody =", requestBody)

  request.send(JSON.stringify(requestBody))
}

function passwordConfirmed() {
  if (this.response == "correct password") {
    //WOULD BE COOL TO ASK SERVER FOR DB CONTENTS HERE, NOT SURE IF IT'S POSSIBLE..
    location.href = "/home"
  }
  else {
    paragraph.innerHTML = "incorrect password"
  }
}
