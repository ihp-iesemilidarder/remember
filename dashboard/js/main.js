import { DB } from "../../js/init.js";

const nameUser = document.querySelector("#profile > span");
const article = document.querySelector("article");
const menu = document.querySelector("aside");
const search = document.querySelector("aside #search");
const divPagination = document.querySelector("#pagination");
let currentPage = 1;
let rowsxsheet = 8;

// show the pagination
const showPagination=(items,rowsxsheet)=>{
    divPagination.innerHTML="";
    let sheetsNumbers = Math.ceil(items/rowsxsheet);
    console.log(sheetsNumbers);
    if(sheetsNumbers<=1) return false;
    for(let x=1;x<=sheetsNumbers;x++){
        let active=(currentPage==x)?"active":"";
        divPagination.innerHTML+=
        `
        <button id="${x}" class="buttonPagination ${active}">${x}</button>
        `;
    }
    divPagination.addEventListener("click",(e)=>{
        if(e.target.classList.contains("buttonPagination")){
            currentPage = e.target.id;
            let cat = article.getAttribute("data-category");
            (cat=="all")?loadItems():loadItems(cat);
        }
        let currentButton = document.querySelector("#pagination button.active");
        if (currentButton != null) currentButton.classList.remove("active");
        e.target.classList.add("active");
    });
}
//check if the item specified is liked
const existLike=(id)=>{
    let user = new DB("loginUser","sessionStorage").show()[0].user;
    let users = new DB("users","localStorage").show();
    user = users.find(el=>el.nick==user);
    if(user.likes.indexOf(id) != -1){
        return true;
    }else{
        return false;
    }
}

const existEvent=(typeEvent=String,id,exitBool=false)=>{
    let user = new DB("loginUser","sessionStorage").show()[0].user;
    let userObject = new DB("users","localStorage").show().find(el=>el.nick==user);
    if(typeEvent == "like"){
        if(userObject.hasOwnProperty("likes") == false || userObject.likes.indexOf(id) == -1){
          return (exitBool==false)?"far":false;
        }else{
            return (exitBool==false)?"fas":true;
        }
    }
}

const activeLike=(user,users,name)=>{
    let userObj = users.find(el=>el.nick == user);
    let likes;
    if(userObj.hasOwnProperty("likes") == false){
        likes=[];
    }else{
        likes = userObj.likes;
    }
    likes.push(name);
    new DB("users","localStorage").addProperty(user,"likes",likes);
}

const inactiveLike=(user,users,name)=>{
    let userObj = users.find(el=>el.nick == user);
    let index = userObj.likes.indexOf(name);
    if(index != -1){
        userObj.likes.splice(index,1);
    }else{
        return false;
    }
    let likes = userObj.likes;
    new DB("users","localStorage").addProperty(user,"likes",likes);
}

// this function means if the items specified is liked or not.
const likesManager=(name=String,addBool=Boolean)=>{
    let user = new DB("loginUser","sessionStorage").show()[0].user;
    let users = new DB("users","localStorage").show();
    if(addBool==true){
        activeLike(user,users,name);
    }else{
        inactiveLike(user,users,name);
    }
}
// function of the hearts, share and comment logos of each item
const articlesEvents=(e)=>{
    let dom = e.target;
    let clas;
    if(dom.getAttribute("class") != null){
        clas = dom.getAttribute("class").replace("icon ","");
    }
    var id = dom.parentNode.parentNode.getAttribute("id");
    switch(clas){
        case "far fa-heart":
            likesManager(id,true);
            dom.setAttribute("class","icon fas fa-heart");
        break;
        case "fas fa-heart":
            likesManager(id,false);
            let parentCategory = (article.getAttribute("data-category")!=null)?article.getAttribute("data-category"):null;
            (parentCategory == "favourites")?dom.parentNode.parentNode.remove():dom.setAttribute("class","icon far fa-heart"); 
        break;
        case "fas fa-share-alt":
        break;
        case "fas fa-comment":
        break;
    }
}

// this function execute the functions loadItems for print the categories, for each category's button and the search
const loadEvents=(e)=>{
    let clas = e.target.getAttribute("class");
    let active = document.querySelector("aside li[data-active]");
    let id = e.target.getAttribute("id");

    // event for search a title of category's group
    if(id == "search"){
        loadItems(article.getAttribute("data-category"),search.value);
    }

    if (active!=null && id != "search") document.querySelector("aside li[data-active]").removeAttribute("data-active");
    // if the user clicks to search, the currentPage is not initialize
    if (id != "search") currentPage=1;
    e.target.setAttribute("data-active","");
    switch(clas){
        case "music":
            loadItems("music");
        break;
        case "films":
            loadItems("films");
        break;
        case "series":
            loadItems("series");
        break;
        case "games":
            loadItems("games");
        break;
        case "restaurants":
            loadItems("restaurants");
        break;
        case "hotels":
            loadItems("hotels");
        break;
        case "trips":
            loadItems("trips");
        break;
        case "favourites":
            loadItems("favourites");
        break;
        case "all":
            loadItems();
        break;
    }
}

// execute the audio if the category is music else the description
const extra=(cat,element)=>{
    if(cat == "music"){
        return `
        <audio controls>
            <source src="../mov/${element.mp3}.mp3" type="audio/mpeg">
        </audio>
        `
    }else if(cat == "trips"){
        return "";
    }else{
        return `
        <p class="paragraph">${element.description}</p>
        `
    }
}

// this print each tag of the category specified, or all, or only the favourites
/*
    Parameters:
        data [Array] -> the object current
        category [String] -> all|favourites|films|games|hotels|music|restaurants|series|trips
        search [String] (optional) -> content the value cuurent of search's input
        favourties [Boolean] {default:false}
        currentPage -> current sheet's number
        rowsxsheet -> items' number by sheet
*/
const printItems=(data,category,search,favourites=false,currentPage,rowsxsheet)=>{

    //get the subarray specified by currrentPage and rowsxsheet
    currentPage--;
    let start = rowsxsheet*currentPage;
    let end = start + rowsxsheet;
    data = data.slice(start,end);

    article.setAttribute("data-category",category);
    article.innerHTML="";
    let output="";
    data.forEach(element => {
        let cat;
        if(category=="all" || category=="favourites"){
            cat = element.type;
        }else{
            cat = category;
        }
        // if the search exists, filter by item's name
        if(!search || String(element.title).toUpperCase().includes(search.toUpperCase())){
            // if the favourites exists only the items with hearts clicked
            if(!favourites || (favourites==true && existLike(element.img.split(".")[0])==true)){
                output+=`
                    <div class="wow animate__animated animate__flipInY category" id="${element.img.split(".")[0]}">
                        <div style="background-image: url(../img/${element.img});"></div>
                        <div>
                            <h2>${element.title}</h2>
                            <p>${element[(cat=="hotels"||cat=="restaurants"||cat=="trips")?"address":"authors"].toString()}</p>
                            <p>${element.categories.toString()}</p>
                            <p>${element[(cat=="hotels"||cat=="restaurants"||cat=="trips")?"tlf":"publishedAge"]}</p>
                            ${extra(cat, element)}
                            <i class="icon ${existEvent("like",element.img.split(".")[0])} fa-heart"></i>
                            <i class="icon fas fa-share-alt"></i>
                            <i class="icon fas fa-comment"></i>
                        </div>
                    </div>
                `;                 
            }
           
        }
    });
    article.innerHTML=output;
}

// if the 'loginUser' doesn't exist or the variable is expired, or the DB's user doesn't exist, close the session
const existUser=()=>{
    let session = new DB("loginUser","sessionStorage");
    let users = new DB("users","localStorage");
    let existInDB = (session.show()[0] == undefined)?null:users.existUser(session.show()[0].user);
    // In the url, get last path
    let path_current = window.location.pathname.split("/");
    path_current = path_current[path_current.length-2];
    if(session.show(true) == false || new Date(session.show()[0].dataExpires) < new Date() || (existInDB == false && path_current == "dashboard")) window.location.href="..";
}

// load the user's content
const loadContentUser=()=>{
    let user = new DB("loginUser","sessionStorage").show()[0];
    nameUser.textContent = user.user;
}

//load all the items specified
async function loadItems(file,search=false){
    // if the user load a category specified
    if(file && file != "favourites" && file != "all"){
        let path = "../json/"+file+".json";
        let resp = await fetch(path)
        let data = await resp.json();
        printItems(data,file,search,false,currentPage,rowsxsheet);
        showPagination(data.length,rowsxsheet);

    // if the user load "favourites" or "all"
    }else{
        article.innerHTML="";
        let files = ["../json/films.json","../json/games.json","../json/hotels.json","../json/music.json","../json/restaurants.json","../json/series.json","../json/trips.json"];
        let list = [];
        // get the objects each JSON and I join it in list
        for(let x=0;x<=files.length-1;x++){
            let resp = await fetch(files[x]);
            let data = await resp.json();
            data.filter(el=>list.push(el));
        }

        // if the load "favourites", now, the list will be the objects with likes active
        if(file=="favourites"){
            list = list.filter(el=>existEvent("like",el.img.split(".")[0],true));
            printItems(list,"favourites",search,true,currentPage,rowsxsheet);
            showPagination(list.length,rowsxsheet);
        }else{
            printItems(list,"all",search,false,currentPage,rowsxsheet);
            showPagination(list.length,rowsxsheet);
        }
    }

}

const init=()=>{
    existUser();
    loadContentUser();
    loadItems();
    menu.addEventListener("click",loadEvents);
    menu.addEventListener("keyup",loadEvents);
    article.addEventListener("click",articlesEvents);
}

init()