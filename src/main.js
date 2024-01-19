import './styles/style.scss'

// let userList = document.querySelector('#userList');
let userForm = document.querySelector('#userForm')

if(localStorage.getItem("user")){
    printlogOutButton()
    
} else {
    printLogInForm()
    // add register user function
    // add delite user function
}


function printLogInForm(){
    userForm.innerHTML = '';
    let inputEmail = document.createElement('input');
    inputEmail.placeholder = 'Epost';
    let inputPassword = document.createElement('input');
    inputPassword.type = 'password';
    inputPassword.placeholder = 'password';
    let loginButton = document.createElement('button');
    loginButton.innerText = 'Logga in';

    loginButton.addEventListener('click', ()=>{
        printLoggedInPage(inputEmail,inputPassword)
    } )
       
    userForm.append(inputEmail,inputPassword,loginButton)

}

function printLoggedInPage(inputEmail, inputPassword){
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
            printLoggedInUser(data)
        }else {
            alert('fel inlogg')
        }
      
    })
    
};

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