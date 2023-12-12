export function genererEditMode(){

    if(checkToken()){
        document.querySelector(".editor-mode").style.display="block"; 

    }
    else{
        document.querySelector(".editor-mode").style.display="none"; 
    }
    
}

function checkToken(){ // check if connection token is received from api
    let userConnected = false;
    let resp = sessionStorage.getItem("token"); //sessionstorage item is initialized by loginAdmin in requete.js
    if (resp!==null){ // login requested?
        resp = JSON.parse(resp);
        let token = resp.token;
        if (token!==""){ // if login was incorrect empty string is returned by loginAdmin function
            userConnected=true;
        } //endif
    } //end if resp ==null
    return userConnected; //true only if token is a non empty string
} // end function