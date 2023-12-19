export async function getAllWorks(url){
    
    try{
        //* * * * * * window.localStorage.removeItem("projets"); //* * * line to test my localstorage
        //* * * we try to get datas from local storage to save 1 requete
        let projets = window.localStorage.getItem("projets");

        if (projets === null) { //* * *  if no dtat in local storage, we fetch
            //* * *  Récupération des projets depuis l'API
            const reponse = await fetch(`${url}works`);//* * *  the last backslash of the url is already in 'url' variable
            projets = await reponse.json();
            //* * *  Transformation des projets en JSON
            const listeProjets = JSON.stringify(projets);
            //* * *  Stockage des informations dans le localStorage
            window.localStorage.setItem("projets", listeProjets);
        } else {
            projets = JSON.parse(projets);
            console.log("projets en local storage");
        }       

        
        return projets;

    } //* * *  End of try
    catch(error){
        //* * * console.log("Une erreur est survenue : " + error.message)
        alert("Une erreur est survenue : " + error.message+" Contactez l'administrateur du site")
    }//* * *  end of catch

}

export async function getAllCategories(url){
    
    try{
        
        //* * * we try to get datas from local storage to save 1 requete
        let categories = window.localStorage.getItem("categories");

        if (categories === null) { //* * *  if no dtat in local storage, we fetch
            //* * *  Récupération des categories depuis l'API
            const reponse = await fetch(`${url}categories`);//* * *  the last backslash of the url is already in 'url' variable
            categories = await reponse.json();
            //* * *  Transformation des categories en JSON
            const listeCategories = JSON.stringify(categories);
            //* * *  Stockage des informations dans le localStorage
            window.localStorage.setItem("categories", listeCategories);
        } else {
            categories = JSON.parse(categories);
            console.log("categories en local storage");
        }       

        return categories;

    } //* * *  End of try
    catch(error){
        //* * * console.log("Une erreur est survenue : " + error.message)
        alert("Une erreur est survenue : " + error.message+" Contactez l'administrateur du site")
    }//* * *  end of catch

}



