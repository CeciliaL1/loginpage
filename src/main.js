import './styles/style.scss'

/**
 * Selectors
 */
let userForm = document.querySelector('#userForm');
let registerForm = document.querySelector('#register')

/**
 * Check if there is a user in localStorage
 */
if(localStorage.getItem("user")){
    const userInLocalStorage = JSON.parse(localStorage.getItem("user"));
    printlogOutButton()
    printLoggedInUser(userInLocalStorage);
    printDeleteUserButton(userInLocalStorage);
    
} else {
    printLogInForm()
}

/**
 * Functions 
 */

function printRegisterform(){
    userForm.innerHTML = '';
    let registerHeading = document.createElement('h1');
    registerHeading.innerHTML = 'Registrera ny anvädare'
    let registerName = document.createElement('input')
    registerName.placeholder = 'Ange namn';
    let registerEmail = document.createElement('input');
    registerEmail.placeholder = 'Ange Epost';
    let registerPassword = document.createElement('input');
    registerPassword.type = 'password';
    registerPassword.placeholder = 'Ange lösenord';
    let sendRegisterButton = document.createElement('button');
    sendRegisterButton.innerText = 'Skicka';

    sendRegisterButton.addEventListener('click', () =>{
        checkIfUserExist(registerName, registerEmail, registerPassword)
    })
    registerForm.append(registerHeading, registerName,registerEmail,registerPassword, sendRegisterButton);
    
}

function checkIfUserExist(name, email, password){
    let inputRegisterUser = { email: email.value}

    fetch('http://localhost:3000/users/check',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(inputRegisterUser)
    })
    .then (res => res.json())
    .then(data => {
        if(data){
            alert('Användaren finns logga in')
            printLogInForm();
        } else {
    
            registerUser(name,email,password);
        }

})
}


function registerUser(name, email, password){
    let inputRegisterUser = {name: name.value, email: email.value, password: password.value}

    fetch('http://localhost:3000/users/add',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(inputRegisterUser)
    })
    .then (res => res.json())
    .then(data => {
     
        // print user is registred page
        })
}

function printLogInForm(){
    userForm.innerHTML = '';
    registerForm.innerHTML = '';
    let logInHeading = document.createElement('h1');
    logInHeading.innerHTML = 'Logga in'
    let inputEmail = document.createElement('input');
    inputEmail.placeholder = 'Epost';
    let inputPassword = document.createElement('input');
    inputPassword.type = 'password';
    inputPassword.placeholder = 'password';
    let loginButton = document.createElement('button');
    loginButton.innerText = 'Logga in';
    let registerButton = document.createElement('button');
    registerButton.innerText = 'Registrera dig';
    

    loginButton.addEventListener('click', ()=>{
        getLogInFromAPI(inputEmail,inputPassword)
    } )
       registerButton.addEventListener('click', printRegisterform);

    userForm.append(logInHeading, inputEmail,inputPassword,loginButton, registerButton)

    
}


function getLogInFromAPI(inputEmail, inputPassword){
    let sendUser = {email: inputEmail.value, password: inputPassword.value}

    fetch('http://localhost:3000/login',{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(sendUser)
    })
    .then(res => res.json())
    .then(data => {
    
        if(data.user){
            localStorage.setItem("user" , JSON.stringify(data));
            printlogOutButton();
            printLoggedInUser(data);
            printDeleteUserButton(data);
        }else {
            alert('fel inlogg')
        }
      
    })
  
    
};

function printDeleteUserButton(data){
    let deleteUserButton = document.createElement('button');
    deleteUserButton.innerText = 'Ta bort användare';

    deleteUserButton.addEventListener('click', ()=>{
        deleteUser(data);
        localStorage.removeItem("user");
    })

    userForm.appendChild(deleteUserButton);
    
}


function deleteUser(data){
    userForm.innerHTML = '';
    const deletedUser = data.user;
    const deletedUserMail = data.email;
    let id = data.id;

    fetch('http://localhost:3000/users' +'/' + id, {
        method : "DELETE"
    })

    printLogInForm();
    let deletedMessage = document.createElement('p');
    deletedMessage.innerText = `Användaren ${deletedUser} med mailen ${deletedUserMail} är nu borttagen, vänligen logga in med en annan användare eller resistrera en ny`;

    userForm.appendChild(deletedMessage);
    setTimeout(() => {
        deletedMessage.innerText ='';
    }, 5000);
    


   
}

function printLoggedInUser(data){
    let loggedInInfo = document.createElement('p');
    loggedInInfo.innerText = `Du är inloggad som ${data.user}`;
    userForm.append(loggedInInfo);
}
    

function printlogOutButton(){
    userForm.innerHTML ='';

    let logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logga ut';
    userForm.appendChild(logoutButton);

    logoutButton.addEventListener('click', ()  =>{
        localStorage.removeItem("user");
        printLogInForm();
    })

}