import {configServerAddress} from '../config/config.js';
import {loginAdmin} from './req-api/request-post.js';

//* * * init display --------

const formInputs = document.querySelectorAll("#form-login input");
const errorMsg = document.querySelector(".error-msg");
errorMsg.innerHTML="";

//* * *  we add listener to show red border when invalid field
 for (let i=0 ; i<formInputs.length ; i++){ //* * *  for both inputs in the form
     formInputs[i].classList.remove("input-invalid"); //* * * remove red border
     formInputs[i].addEventListener("blur", function(event){ //* * * when we leave the input
         displayRedBorders(event); //** call function below
     }); //* * *  end of event listener
 } //* * *  end of for


//* * * ------------ set the behaviour of "connect" button
const btConnect = document.querySelector("#form-login button");
btConnect.addEventListener("click", function(event){
    event.preventDefault(); //stop the page refreshment
    clickConnect();
}); //* * End addEventListener


async function clickConnect(){ //* * Launch login request if form is correctly filled
    const formOk = verifForm(); // check the form
    if (formOk[0]){ //form valid or not
        const url = await configServerAddress(); //get server information
        const loginOk = await loginAdmin(url); //call login request
            if(loginOk){ //* * *  email and pwd correct => token sent back
                location.href="index.html"; // navigate to homepage
            }
            else{
                errorMsg.innerHTML="identifiant inconnu ou mot de passe incorrect";
            }
    }
    else{
        const messageErrorForm =[ //* * List of error message, depending on the incorrect input
            "Veuillez saisir une adresse email valide.",
            "Le format du mot de passe est incorrecte.<br>4 caractères min.",
            "Format de l'adresse email ET du mot de passe incorrectes."
        ]
        errorMsg.innerHTML=messageErrorForm[formOk[1]-1]; //* * * message based on errorCode from verifForm function
        
    }

}
function verifForm(){ //* * * we check the form by .checkValidity on both inputs
    errorMsg.innerHTML="";
    let formValid = true;
    let errorCode = 0; //* * * 1:mail 2:pwd 3 : both

    for (let i=0 ; i<formInputs.length ; i++){ //* * *  for both inputs in the form, array is global variable
        if(!formInputs[i].checkValidity()){
            formValid = false;
            errorCode+=i+1; //* * * * * *  +1 if mail, +2 if pwd
            
        }
    }

    return [formValid,errorCode];
} //* * *  end function

function displayRedBorders(event){ //display red borders and error msg if input invalid
    if(!event.target.checkValidity()){ //* * * if input not valid (based on pattern and required )
        event.target.classList.add("input-invalid"); //* * * add red border
        errorMsg.innerHTML="";//* * * delete message
    }
    else{ //* * * else ; input = valid
        event.target.classList.remove("input-invalid"); //* * * remove red border
        errorMsg.innerHTML="";//* * * delete message
    }
}