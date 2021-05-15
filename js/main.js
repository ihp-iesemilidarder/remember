import { aCloseMessage, aCloseRegister, aFormLogin } from "./animations.js";
import { DateOperators, DB } from "./init.js";

// constants globals for work.
const newUser = document.querySelector("#main i");
const divRegister = document.querySelector("#register");
const formRegister = document.querySelector("#register form");
const message = document.querySelector("#message");
const login = document.querySelector("#main > div");

//this function looks if the variable 'loginUser' contains the user
const loggin=(variable=String)=>{
    let session = new DB(variable,"sessionStorage").show();
    let users = new DB("users","localStorage");

    // look if exists the user
    if(session[0] == undefined){
        return false;
    
    // look if the data storaged in the variable is expired
    }else if(new Date() > new Date(session[0].dataExpires)){
        new DB(variable,"sessionStorage").remove();
        return false;
    // if the user doens't exist in the DB, but yes in the sessionStorage
    }else if(users.existUser(session[0].user) == false){
        new DB(variable,"sessionStorage").remove();
        return false;
    }
    return true;
}

// look if the user exists in the sessionStorage
const automaticSignIn=()=>{
    if (loggin("loginUser") == true) window.location.href="dashboard/";       
}

const tokenGeneator=(repeats=Number)=>{
    function random(){
        return Math.random().toString(36).substr(2);
    }
    let count = 0;
    let key = "";
    while(count<=repeats){
        key += random();
        count++;
    }
    return key;
}

const authorizedUser=(user=String,pass=String)=>{
    let userObject = new DB("users","localStorage").show().find(el=>el.nick == user);
    return (userObject.password == pass)?true:false;
}

// The user exists in the DB?
const userExist=(user=String,boolExit=false)=>{
    let l = new DB("users","localStorage").show();
    if(boolExit == false){
        return (l.find(el=>el.nick == user))?true:false;
    }else if(l.find(el=>el.nick == user)){
        return true;
    }else{
        return false;
    }
}


// login form's buttons
function eventsLogin(e){
    if(e.target.classList.contains("signin")){
        formLogin();
    }else if(e.target.classList.contains("fa-sign-in-alt")){
        enterLogin();
    }else if(e.target.classList.contains("fa-times")){
        closeLogin();
    }else{
        return false;
    }
}

const closeLogin=()=>{
    aFormLogin(login);
    setTimeout(()=>{
        login.style.display="none";
        login.innerHTML=`
            <img src="img/btn_shutdown_green.png" alt="login" class="signin">
        `;
        login.setAttribute("id","logo_main");
    },500);
    setTimeout(()=>{
        login.style.display="block";
    },1000);
}

const enterLogin=()=>{
    const loginUser = document.querySelector("#main > div form input[type='text']").value;
    let loginPassword = document.querySelector("#main > div form input[type='password']").value;
    // if the password is empty, the function sha512 return empty
    loginPassword = (loginPassword != "")?sha512(loginPassword):"";

    if(loginUser == "" || loginPassword == ""){
        printMessage("Faltan datos","rgb(255, 65, 65)",true);
    }else if(userExist(loginUser,true) == false){
        printMessage("Este usuario no esta registrado.","rgb(255, 65, 65)",true);
    }else if(userExist(loginUser,true) == true && authorizedUser(loginUser,loginPassword) == true){
        printMessage("Autorizado.","rgb(3, 208, 45)",true);
        let mySession = {
            user:loginUser,
            token:tokenGeneator(5),
            dataCurrent: new Date(),
            dataExpires: new DateOperators().increment(0,0,0,1,30,-1,-1),
            dataIncremented:false // if the user is logged by first time, increment the 'dataExpires' to 1,30h more.
        };
        new DB("loginUser","sessionStorage").add(mySession,true);
        automaticSignIn();
    }else{
        printMessage("usuario o contraseña invalido.","rgb(255, 65, 65)");
    }
}

// Get the register form's data 
const getDataForm=()=>{
    let data={
        nick:document.querySelector("#register form input[name='nick']").value,
        password:sha512(document.querySelector("#register form #password").value),
        pleasures:selectValues(document.querySelector("#register form #selectPleasures").selectedOptions),
        dateOfBirth:document.querySelector("#register form input[type='date']").value,
        gender:document.querySelector("#register #gender").dataset.value
    };
    return data;
}

// for print a message in the window
const printMessage=(text=String,color=String,exit=false)=>{
    let mes = document.querySelector("#message");
    mes.textContent = text;
    mes.style.backgroundColor = color;
    mes.style.display = "block";
    setTimeout(()=>{
        aCloseMessage(message);
        setTimeout(()=>{
            message.style.display = "none";
            message.innerHTML = "";
        },1000);        
    },2000);
    if(exit==true) return false;
}

// convert all the multiple select's results to array
const selectValues=(list=HTMLCollection)=>{
    let val=[];
    for(let el of list){
        val.push(el.value);
    }
    return val;
}

const passwordsMatch=()=>{
    let passwd = document.querySelector("#register #password").value;
    let passwd1 = document.querySelector("#register #match_password").value;
    return (passwd != passwd1)?false:true;
    
}

const formValidate=()=>{
    let data = getDataForm();
    let empty = Object.entries(data).filter(el=>el[1]=="");
    if(empty.length>0){
        return false;
    }
    return true;
}

const register=()=>{
    divRegister.addEventListener("click",eventsRegister);
}

const formLogin=()=>{
    aFormLogin(login);
    setTimeout(()=>{
        login.style.display="none";
        login.innerHTML=`
            <h2>¡login!</h2>
            <form method="POST">
                <div class="input-container">
                    <i class="fas fa-user icon"></i>
                    <input type="text" class="input-field">
                </div>
                <div class="input-container">
                    <i class="fas fa-unlock-alt icon"></i>
                    <input type="password" class="input-field">
                </div>
                <div class="buttons">
                    <i class="fas fa-sign-in-alt"></i>
                    <i class="fas fa-times"></i>
                </div>
            </form>
        `;
        login.setAttribute("id","login");
    },500);
    setTimeout(()=>{
        login.style.display="block";
    },1000);
}

const genderClear=()=>{
    let genderList = document.querySelectorAll(".chooseGender");
    let gender = document.querySelector("#register #gender");
    gender.setAttribute("data-value","");
    genderList.forEach((el)=>{
        el.setAttribute("data-active","false");
        el.classList.remove("genderSelected");
    });
}

const chooseGender=(dom)=>{
    let gender = document.querySelector("#register #gender");
    if(!dom.getAttribute("data-active") || dom.getAttribute("data-active") == "false"){
        genderClear();
        dom.classList.toggle("genderSelected");
        dom.setAttribute("data-active",true);
        gender.setAttribute("data-value",dom.id);
    }else{
        dom.classList.toggle("genderSelected");
        dom.setAttribute("data-active",false);
        gender.setAttribute("data-value","");
    }
}

function eventsRegister(e){
    // close sign in's popup
    if(e.target.classList.contains("fa-times")){
        closeRegister();
    // gender's selector functions
    }else if(e.target.classList.contains("chooseGender")){
        chooseGender(e.target);
    // to send the sign in's form
    }else if(e.target.id == "send" || e.target.classList.contains("fa-sign-in-alt")){
        let user = document.querySelector("#register form input[name='nick']").value;
        if(formValidate(formRegister.elements) == false){
            printMessage("Valores incorrectos, o faltan datos","rgb(255, 65, 65)");
        }else if(passwordsMatch() == false){
            printMessage("La contraseñas no coinciden","rgb(255, 65, 65)");
        }else if(userExist(user) == true){
            printMessage("Este usuario existe en la DB","rgb(255, 65, 65)");
        }else{
            let data = getDataForm();
            new DB("users","localStorage").add(data);
            printMessage("Guardado correctamente","rgb(3, 208, 45)");   
        }
    }
}

const closeRegister=()=>{
    formRegister.reset();
    genderClear();
    aCloseRegister(divRegister);
    setTimeout(()=>{
        divRegister.style.display="none";
    },1000);
}
// show register's popup
const addUser=()=>{
    divRegister.style.display="block";
}

const init=()=>{
    automaticSignIn();
    // function new user to sign in
    newUser.addEventListener("click",addUser);
    register();
    login.addEventListener("click",eventsLogin);
}
init();