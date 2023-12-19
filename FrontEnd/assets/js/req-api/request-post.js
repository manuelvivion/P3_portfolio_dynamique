export async function loginAdmin(url){

    try{
        let loginOK = false;
        
        let inputEmail = document.getElementById("input-email");
        let inputPwd= document.getElementById("input-pwd");
        let userInfos = {
                email : inputEmail.value,
                password : inputPwd.value
            };
        let chargeUtile = JSON.stringify(userInfos); //* * * prepare infos in JSON format
            //* * *  envoie requete post à l'API
                const reponse = await fetch(`${url}users/login`,{
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: chargeUtile
                });//* * * end fetch
            
        let profilInfos = await reponse.json(); //* * * object

        if (reponse.status === 200 ){ //* * *  request and identification went right, we get a token back
            sessionStorage.setItem("token", profilInfos.token);
            loginOK=true;
        }   
        else{
            sessionStorage.setItem("token", "");
        } 

        return loginOK;

    } //* * *  End of try
    catch(error){
        //* * * console.log("Une erreur est survenue : " + error.message)
        alert("Une erreur est survenue : " + error.message+" Contactez l'administrateur du site")
    }//* * *  end of catch

}

export async function addNewProject(url,body){
    try{
        let authToken = window.sessionStorage.getItem("token");
        
       //* * *  envoie requete post à l'API
                const reponse = await fetch(`${url}works`,{
                    method: "POST",
                    headers: { 
                    accept : "application/json",
                    Authorization: `Bearer ${authToken}`
                    },
                    body: body
                });//* * * end fetch
            
        let addedProject = await reponse.json(); //* * * object
        
        if (reponse.status == 201){ //* * * if insertion went good
            window.localStorage.removeItem("projets"); //* * * we delete localstorage to force request to the server to reload projects added recently
        }
        else{ //* * *  if problem when inserting
            addedProject = {};
            throw new error("L'ajout du nouveau projet n'a pas pus s'effectuer correctement");
        }

        return [reponse.status,addedProject];

    } //* * *  End of try
    catch(erreur){
        //* * * console.log("Une erreur est survenue : " + error.message)
        alert("Une erreur est survenue : " + erreur.message+" Contactez l'administrateur du site")
    }//* * *  end of catch
}

