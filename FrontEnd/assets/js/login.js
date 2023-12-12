import {configServerAddress} from '../config/config.js';
import {loginAdmin} from './req-api/requetes.js';

//init display --------

const formInputs = document.querySelectorAll("#form-login input");
const errorMsg = document.querySelector(".error-msg");
errorMsg.innerHTML="";

// we add listener to show red border when invalid field
 for (let i=0 ; i<formInputs.length ; i++){ // for both inputs in the form
     formInputs[i].classList.remove("input-invalid"); //remove red border
     formInputs[i].addEventListener("blur", function(event){ //when we leave the input
         if(!event.target.checkValidity()){ //if input not valid (based on pattern and required )
            event.target.classList.add("input-invalid"); //remove red border
            errorMsg.innerHTML="";
        }
        else{ //else
            event.target.classList.remove("input-invalid"); //remove red border
            errorMsg.innerHTML="";
        }
     }); // end of event listener
 } // end of for


//------------
const btConnect = document.querySelector("#form-login button");
btConnect.addEventListener("click",async function(event){
    event.preventDefault();
    const formOk = verifForm();
    if (formOk[0]){
        const url = await configServerAddress();
        const loginOk = await loginAdmin(url);
            if(loginOk){ // email and pwd correct => token sent back
                location.href="index.html";
            }
            else{
                errorMsg.innerHTML="identifiant inconnu ou mot de passe incorrect";
                //alert ("identifiant inconnu ou mot de passe incorrect")
            }


    }
    else{
        const messageErrorForm =[
            "Veuillez saisir une adresse email valide.",
            "Le format du mot de passe est incorrecte.<br>4 caractères min.",
            "Format de l'adresse email ET du mot de passe incorrectes."
        ]
        errorMsg.innerHTML=messageErrorForm[formOk[1]-1]; //message based on errorCode from verifForm function
        //alert(messageErrorForm[formOk[1]-1]); //message based on errorCode from verifForm function
    }

    //location.href="index.html";
});

function verifForm(){ //we check the form by .checkValidity on both inputs
    errorMsg.innerHTML="";
    let formValid = true;
    let errorCode = 0; //1:mail 2:pwd 3 : both

    for (let i=0 ; i<formInputs.length ; i++){ // for both inputs in the form, array is global variable
        if(!formInputs[i].checkValidity()){
            formValid = false;
            errorCode+=i+1; // +1 if mail, +2 if pwd
            
        }
    }

    return [formValid,errorCode];
} // end function