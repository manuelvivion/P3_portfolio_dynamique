import {configServerAddress} from '../../config/config.js';
import {deleteProject} from '../req-api/requetes.js';

let modal = document.querySelector(".modal");
let btnClose = document.querySelector(".modal-btn-close");
let btnValid = document.querySelector(".modal-btn-valid");
let modalTitle = document.querySelector(".modal-content h3");

export function showEditingModal(step){
  modal.style.display="flex";
 
  switch(step) {
        case 1: // step 1 : show gallerie with trash bin buttons and "ajouter photo" button
            btnClose.addEventListener("click", closeModal);
            btnValid.textContent="Ajouter une photo";
            modalTitle.textContent="Galerie photo";
            displayGalleryModal();
        break;

        case 2: // step 2 : Add a photo
        // code block
        break;
    default:
      // code block
  } 
  

}

function closeModal(){
    btnClose.removeEventListener("click", closeModal);
    modal.style.display="none";

}

async function displayGalleryModal(){
    //set div "modal-content-main" attributes
    let container = document.querySelector(".modal-content-main");
    container.className="";
    container.classList.add("gallery-modal"); //class created in css file ; display grid with 5 columns

    let projets = window.localStorage.getItem("projets"); //load all works from local storage
    projets = JSON.parse(projets);
    for(let project of projets){ // for each project in the db
       let article = document.createElement("article");
       article.style.width="100%";
       article.style.position="relative";
       container.appendChild(article);

       let img = document.createElement("img");
       img.src=project.imageUrl;
       img.alt=project.title;
       img.style.width="100%";
       article.appendChild(img);

       let icon = document.createElement("i");
       icon.className="fa-solid fa-trash-can";
       icon.dataset.id=project.id;
       article.appendChild(icon);
       let url = await configServerAddress(); // get actual host adress ; beta, dev, prod
       icon.addEventListener("click",async function(event){
            await deleteProject(url, event.target.dataset.id);
       });


    } // end for each project


}