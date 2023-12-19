import {deleteProject} from '../../req-api/request-delete.js';
import {configServerAddress} from '../../../config/config.js';
import {updateMainGallery} from './display-modal.js';

let container = document.querySelector(".modal-content-main"); //* * * get Dom element from the modal in html


export async function displayGalleryModal(){ //* * * display vignettes with clickable delete button (trashcan)
    //* * * set div "modal-content-main" attributes
    container.classList.add("gallery-modal"); //* * * class created in css file ; display grid with 5 columns

    let projets = window.localStorage.getItem("projets"); //* * * load all works from local storage
    projets = JSON.parse(projets);
    for(let project of projets){ //* * *  for each project in the db
       let article = document.createElement("article"); //* * * 1 article = 1 project
       article.style.width="100%";
       article.style.position="relative";
       container.appendChild(article);

       let img = document.createElement("img"); //* * *  project main image
       img.src=project.imageUrl; //* * * img src from loaded datas
       img.alt=project.title;
       img.style.width="100%";
       article.appendChild(img);

       let icon = document.createElement("i"); //* * *  display trashcan as icon, for each project
       icon.className="fa-solid fa-trash-can";
       icon.dataset.id=project.id; //* * * we save the id of current project in the dataset
       article.appendChild(icon);
       icon.addEventListener("click",function(event){
            deleteSelectedProject(event);
       });

    } //* * *  end for each project


} //* * *  end of function display modal gallery

export async function deleteSelectedProject(event){ //* * * click on trashcan -> delete project
        let url = await configServerAddress(); //* * *  get actual host adress ; beta, dev, prod
        let resp = await deleteProject(url, event.target.dataset.id); //* * * call delete function from requete module
        
        if (resp === 204){ //* * * if response status sent from api is 201 (insertion ok)
            await updateMainGallery(); //* * * update projets gallery in main window
        }
   }