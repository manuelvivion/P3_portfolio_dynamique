
export async function deleteProject(url,id){
    alert(url+"projet à effacer : "+id);
 
     try{
         let authToken = window.sessionStorage.getItem("token");
        
        //* * *  envoie requete post à l'API
                 const reponse = await fetch(`${url}works/${id}`,{
                     method: "DELETE",
                     headers: { 
                     accept:"application/json",
                     Authorization: `Bearer ${authToken}`
                     }
                 });//* * * end fetch
             
         //* * No need to parse the reponse (nothing sent back but the status)
         console.log("status: "+reponse.status);
         
         if (reponse.status === 204 ){ //* * * if deletion went good, status 204
             window.localStorage.removeItem("projets"); //* * * we delete localstorage to force request to the server to reload projects added recently
         }
 
         else{ //* * *  if problem when deletion
             throw new error("La suppression du nouveau projet n'a pas pus s'effectuer correctement");
         }
 
         return (reponse.status);
 
      } //* * *  End of try
     catch(erreur){
         //* * * console.log("Une erreur est survenue : " + error.message)
         alert("Une erreur est survenue : " + erreur.message+" Contactez l'administrateur du site")
     }//* * *  end of catch  
 } 
 