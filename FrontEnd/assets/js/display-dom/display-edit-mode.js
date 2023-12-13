import{showEditingModal} from './display-modal.js'

export function genererEditMode(){ //display editing interface or visitor

    if(checkToken()){ //if a token is received from login request
        document.querySelector(".editor-mode").style.display="block"; //display black banner on top
        document.querySelector(".filters").style.display="none"; //hide filters
        displayBtnModify(true);

    }
    else{ //login failed
        document.querySelector(".editor-mode").style.display="none"; //hide black banner
        document.querySelector(".filters").style.display=""; //show filters (flex by default)
        displayBtnModify(false);
    }
    
} // end of GenererEditMode function

function checkToken(){ // check if connection token is received from api
    let userConnected = false;
    let resp = sessionStorage.getItem("token"); //sessionstorage item is initialized by loginAdmin in requete.js
    
    if (resp!==null && resp!==""){ // login requested?
        resp = JSON.parse(resp);
        let token = resp.token;
        if (token!==""){ // if login was incorrect empty string is returned by loginAdmin function
            userConnected=true;
        } //endif
    } //end if resp ==null
    return userConnected; //true only if token is a non empty string
} // end function


function displayBtnModify(editMode){  // show/hide editing button if user connected or not
    let btn = document.querySelector(".btn-modify"); // button next to "Mes Projets" title
    if(editMode){ // if editing mode is allowed
        btn.innerHTML='<i class="fa-regular fa-pen-to-square"></i>Modifier'; // show button, text + icon
        btn.addEventListener("click",function(){ // on click
            showEditingModal(1); //trigger modal, function imported from another module
            // 1 as parameter is to set step as 1 (show gallery)
            // step 2 is adding photo
        });
    }
    else{
        btn.innerHTML=''; //hide button
    }

} //end of function