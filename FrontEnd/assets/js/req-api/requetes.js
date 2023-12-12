export async function getAllWorks(url){
    
    try{
        //window.localStorage.removeItem("projets"); //line to test my localstorage
        //we try to get datas from local storage to save 1 requete
        let projets = window.localStorage.getItem("projets");

        if (projets === null) { // if no dtat in local storage, we fetch
            // Récupération des projets depuis l'API
            const reponse = await fetch(`${url}works`);// the last backslash of the url is already in 'url' variable
            projets = await reponse.json();
            // Transformation des projets en JSON
            const listeProjets = JSON.stringify(projets);
            // Stockage des informations dans le localStorage
            window.localStorage.setItem("projets", listeProjets);
        } else {
            projets = JSON.parse(projets);
            console.log("projets en local storage");
        }       

        
        return projets;

    } // End of try
    catch(error){
        //console.log("Une erreur est survenue : " + error.message)
        alert("Une erreur est survenue : " + error.message+" Contactez l'administrateur du site")
    }// end of catch

}

export async function getAllCategories(url){
    
    try{
        //window.localStorage.removeItem("categories"); //line to test my localstorage
        //we try to get datas from local storage to save 1 requete
        let categories = window.localStorage.getItem("categories");

        if (categories === null) { // if no dtat in local storage, we fetch
            // Récupération des categories depuis l'API
            const reponse = await fetch(`${url}categories`);// the last backslash of the url is already in 'url' variable
            categories = await reponse.json();
            // Transformation des categories en JSON
            const listeCategories = JSON.stringify(categories);
            // Stockage des informations dans le localStorage
            window.localStorage.setItem("categories", listeCategories);
        } else {
            categories = JSON.parse(categories);
            console.log("categories en local storage");
        }       

        return categories;

    } // End of try
    catch(error){
        //console.log("Une erreur est survenue : " + error.message)
        alert("Une erreur est survenue : " + error.message+" Contactez l'administrateur du site")
    }// end of catch

}

export async function loginAdmin(url){

    try{
        let loginOK = false;
        
        let inputEmail = document.getElementById("input-email");
        let inputPwd= document.getElementById("input-pwd");
        let userInfos = {
                email : inputEmail.value,
                password : inputPwd.value
            };
        let chargeUtile = JSON.stringify(userInfos); //prepare infos in JSON format
            // envoie requete post à l'API
                const reponse = await fetch(`${url}users/login`,{
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: chargeUtile
                });//end fetch
            
        let profilInfos = await reponse.json(); //object

            // Transformation de l'objet réponse en JSON
        const tabInfos = JSON.stringify(profilInfos);
            // Stockage des informations dans le localStorage
        
        if (profilInfos.token){ // request and identification went right, we get a token back
            window.localStorage.setItem("token", tabInfos);
            loginOK=true;
        }    

    
        return loginOK;

    } // End of try
    catch(error){
        //console.log("Une erreur est survenue : " + error.message)
        alert("Une erreur est survenue : " + error.message+" Contactez l'administrateur du site")
    }// end of catch

}