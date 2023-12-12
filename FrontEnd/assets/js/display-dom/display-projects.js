
export function genererProjetsDom(projets) { //we get all projects datas from the api to show them on the website, in the div "gallery"
    
    try{ // we cature errors to tell the user

        const divGallery = document.querySelector(".gallery"); 
        divGallery.innerHTML=""; //delete the gallery if we already have content

        for (let i = 0; i < projets.length; i++) { //for every projects we got from api
            let figure = document.createElement("figure"); //we display them in a figure html element
            figure.dataset.id=projets[i].id; //we add current id in data-id
            figure.innerHTML=`
                                <img src="${projets[i].imageUrl}" alt="${projets[i].title}">
                                <figcaption>${projets[i].title}</figcaption>
                                `;
            divGallery.appendChild(figure); //when ready, we add figure to html content 
        }

    } // End of try
    catch(error){
        //console.log("Une erreur est survenue : " + error.message)
        alert("Une erreur est survenue : " + error.message+" Contactez l'administrateur du site")
    }// end of catch

}// end of function genererProjetsDom

export function genererFiltresDom(categories,projets) { //we get all categories datas from the api to show them on the website, in the div "filters"
    
    try{ // we cature errors to tell the user
        const divFilters = document.querySelector(".filters"); 
        divFilters.innerHTML=""; //delete the filters if we already have content

        let btAll= document.createElement("button"); //we create a button to display all categories
            btAll.dataset.id=0; //we add current id in data-id
            btAll.classList.add("selected-category");  //green olive background by defult
            btAll.innerHTML="Tous";
            divFilters.appendChild(btAll); //when ready, we add button to html content
           
            btAll.addEventListener("click",function(event){
                let idCat =event.target.dataset.id ; //for all categories, we force id =0;
                sortProjects(idCat,projets); //call function to sort and display projects on DOM
            });

        for (let i = 0; i < categories.length; i++) { //for every categories we got from api
            let btFiltre= document.createElement("button"); //we display them in a button element
            btFiltre.dataset.id=categories[i].id; //we add current id in data-id
            btFiltre.innerHTML=categories[i].name;
            divFilters.appendChild(btFiltre); //when ready, we add button to html content 

            btFiltre.addEventListener("click",function(event){
                let idCat =event.target.dataset.id ;
                sortProjects(idCat,projets); //call function to sort and display projects on DOM
            });
        }

    } // End of try
    catch(error){
        //console.log("Une erreur est survenue : " + error.message)
        alert("Une erreur est survenue : " + error.message+" Contactez l'administrateur du site")
    }// end of catch

}// end of function generercategoriesDom

function sortProjects(id,projets){ //update the gallery display according to user's choice (=button dataset id)

    sessionStorage.setItem("selected-category", id );
    remindButton(id); //call the function to highlight current category button

    try{ // we cature errors to tell the user
        const divGallery = document.querySelector(".gallery"); 
        divGallery.innerHTML=""; //delete the gallery if we already have content

        if (id==="0"){ // if "tous" btn is clicked
            genererProjetsDom(projets); //display all projects
        }
        else{ //
            const filteredList=projets.filter((project) => project.categoryId==id); //comparison category/bouton id
            genererProjetsDom(filteredList); //we display the filtered projects copied in a new array
        }
        

    } // End of try
    catch(error){
        //console.log("Une erreur est survenue : " + error.message)
        alert("Une erreur est survenue : " + error.message+" Contactez l'administrateur du site")
    }// end of catch

}// end function sortProjects

function remindButton(id){ //highlight the button of current selected category
    const listButtons = document.querySelectorAll(".filters button");
    for (let i=0;i<listButtons.length;i++){
        listButtons[i].classList.remove("selected-category"); //remove every possible highlight
            if(i==id){
                listButtons[i].classList.add("selected-category"); //highlight only correct button (idcategory)
            }
    }

}//end of remindButton function