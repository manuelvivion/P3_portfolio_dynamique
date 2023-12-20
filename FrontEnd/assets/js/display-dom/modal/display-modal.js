import {configServerAddress} from '../../../config/config.js';
import {getAllWorks} from '../../req-api/request-get.js';
import {genererProjetsDom} from '../display-projects.js';
import {deleteSelectedProject, displayGalleryModal} from './modal-gallery.js';
import {fillCategories,displayForm,checkFormMsg,validFormAjout} from './modal-form.js';

let modal = document.querySelector(".modal"); //***get Dom element from the modal in html
let btnClose = document.querySelector(".modal-btn-close"); //***get Dom element from the modal in html
let btnBack = document.querySelector(".modal-btn-back"); //***get Dom element from the modal in html
let btnValid = document.querySelector(".modal-btn-valid"); //***get Dom element from the modal in html
let modalTitle = document.querySelector(".modal-content h3"); //* * * get Dom element from the modal in html
let container = document.querySelector(".modal-content-main"); //* * * get Dom element from the modal in html
let modalErrorMsg = document.querySelector(".modal-content-errormsg"); //* * * get Dom element from the modal in html
let footer = document.querySelector(".modal-content-footer"); //* * * get Dom element from the modal in html


function goTo1(){showEditingModal(1);} //* * *  function created to be ablle to pass parameters to the callback func
function goTo2(){showEditingModal(2);} //* * *  function created to be ablle to pass parameters to the callback func

btnBack.removeEventListener("click",goTo1); //* * *  arrow left button
btnBack.addEventListener("click",goTo1); //* * *  click -> go to step 1 : gallery with trashcan icon

//* * *  End of declarations ----------------


export function showEditingModal(step){ //* * * open modal and display current task, deleting or adding
  modal.style.display="flex"; //* * * show the whole modal
  modal.addEventListener("click", function(event){ //* * * close the modal by clicking outside
    if(event.target.id==="modal1"){closeModal();}
    });

    footer.style.display=null; //* * * make the footer visible again
    modalErrorMsg.textContent=""; //* * * hide error message
    let divFooter2 = document.querySelector(".modal-content-footer-2"); //* * * catch the 2nd footer, only for Cancel and OK buttons on deletions
    divFooter2.innerHTML=""; //* * * empty the second footer
    divFooter2.className="modal-content-footer-2"; //* * *  just keep default class; remove style of original footer

  btnClose.addEventListener("click", closeModal); //* * *  close the modal by clicking cross
  btnValid.removeEventListener("click",validFormAjout);
  btnValid.removeEventListener("click",closeModal);
  btnValid.addEventListener("click",goTo2); //* * * click "ajouter photo" -> go to step 2 (add photo), in the modal
  
  
 
  switch(step) {
        case 1: //* * *  step 1 : show gallerie with trash bin buttons and "ajouter photo" button
            modalStep1(); //function called to manage display of step 1 (gallery+trashcans)
        break;

        case 2: //* * *  step 2 : Add a photo
            modalStep2(); //function called to manage display of step 1 (gallery+trashcans)
        break;

        case 3: //* * *  step 3 : confirm the deletion of project
            modalStep3(); //function called to show the delete confirmation
        break;

        case 4: //* * *  step 4 : Show confirmation of new project added
            modalStep4(); //function called to show the  confirmation
        break;

    default:
      //* * *  code block
  } //* * * end switch
  

} //* * *  end display modal function

function modalStep1(){
    btnBack.className ="modal-btn-back"; //* * * only this class for the <i>, so not visible
    btnValid.textContent="Ajouter une photo"; //* * * set the button text
    btnValid.style.backgroundColor=""; //* * * olive green color, default set in css
    btnValid.removeEventListener("click",checkFormMsg);
    modalTitle.textContent="Galerie photo"; //* * * set text of the title of the modal
    container.innerHTML=""; //* * *  we empty main content
    container.className=""; //* * * remova all class to delete style
    displayGalleryModal(); //* * *  call the function to display all projects vignettes with trashcan

}

function modalStep2(){

    btnBack.className ="modal-btn-back fa-solid fa-arrow-left"; //* * * set all classes of the <i>, arrow becomes visible
    btnValid.removeEventListener("click",goTo2); //* * * change the role of the main bottom button
    btnValid.addEventListener("click",checkFormMsg); 
    btnValid.textContent="Valider"; //* * * set text of button
    btnValid.style.backgroundColor="#aaa"; //* * *  set button color to grey before form validation
    modalTitle.textContent="Ajout photo"; //* * * text of the title
    container.innerHTML=""; //* * *  we empty main content
    container.className=""; //* * * remova all class to delete style
   
    displayForm(); //* * *  get the form ready ; file input, text input, select
    fillCategories(); //* * * function to load categories from localstorage and fill the select input



}

function modalStep3(){ //* * * manage display of modal to confirm or not the deletion

    btnBack.className ="modal-btn-back"; //* * * remove all classes of the <i>, arrow becomes invisible
   
    container.innerHTML=""; //* * *  we empty main content
    container.className=""; //* * * remova all class to delete style
    footer.style.display="none"; //* * * hide original footer
    modalTitle.textContent="Confirmez la Suppression"; //* * change title
    
    let idProjet = sessionStorage.getItem("idProjet"); //* * * get the id of projet from session storage, saved from modal-gallery.js 
    let listeProjets = JSON.parse(window.localStorage.getItem("projets")); //* * * make it object
    let filteredList = listeProjets.filter((project) => project.id==idProjet); //* * * filter the whole array to get only the one project with matching id
    let titreProjet = filteredList[0].title; //* * * get the title of project we want to delete
    fillContent3(titreProjet,idProjet); //* * *send id and title to the fonction that manage displaying buttons, text... in the modal
}


function fillContent3(titreProjet, idProjet){ //* * * show content of modal to validate the deletion

    let p = document.createElement("p");
    p.style.margin="20px auto";
    p.style.textAlign="centered";
    p.innerHTML=`Voulez vous vraiment supprimer la photo <br> <span style="font-size:large;line-height:30px;">${titreProjet}</span> ?`; // ask confirmation. reminding name of project
    container.appendChild(p); //* * *  container is main content div in the modal

    let divFooter = document.querySelector(".modal-content-footer-2"); //* * *catch the second footer
    divFooter.className="modal-content-footer modal-content-footer-2"; //* * * paste original footer style to this second footer
    divFooter.style.display="flex"; //* * * flex mode to show buttons on the same line
    document.querySelector(".modal-content").appendChild(divFooter);

    let btnCancel= document.createElement("button"); //* ** cancel button
    btnCancel.classList.add("modal-btn-valid");
    btnCancel.style.margin="5px 20px";
    btnCancel.style.backgroundColor="#fff";
    btnCancel.style.color="#1D6154";
    btnCancel.style.border="2px solid #1D6154";
    btnCancel.textContent="Annuler";
    btnCancel.addEventListener("click",goTo1); // * click -> go back to modal step 1 (gallery)
    divFooter.appendChild(btnCancel);

    let btnOk= document.createElement("button"); //* * * Button Ok
    btnOk.classList.add("modal-btn-valid");
    btnOk.style.margin="5px 20px";
    btnOk.textContent="Valider";
    btnOk.addEventListener("click",function(){ //* * * on click
        deleteSelectedProject(idProjet); //* * * launch the delete request with id of project
    });
    divFooter.appendChild(btnOk);
}

function modalStep4(){

    modalTitle.textContent="Ajout confirmé";
    btnBack.className ="modal-btn-back"; //* * * remove all classes of the <i>, arrow becomes invisible
    container.innerHTML=""; //* * *  we empty main content
    container.className=""; //* * * remova all class to delete style
    btnValid.textContent="OK"; //* * * set the button text
    btnValid.style.backgroundColor=""; //* * * olive green color, default set in css
    btnValid.removeEventListener("click",validFormAjout);
    btnValid.removeEventListener("click",goTo2);
    btnValid.addEventListener("click",closeModal); //close the confirmation message

    
}


function closeModal(){ //* * *  close the modal
    btnClose.removeEventListener("click", closeModal); //* * * keep it clean
    modal.style.display="none"; //* * * modal still in html code but hidden with css

} //* * *  end of close function


export async function updateMainGallery(confirm){ //parameter confirm : boolean 
    
    let url = await configServerAddress();  //* * * get url of current server (dev, prod...)
    let projets = await getAllWorks(url); //* * *  api request  to get all projects
    genererProjetsDom(projets); //* * * refresh the display of all projects on the website

    if(confirm){
        showEditingModal(4);
    }
    else{
        closeModal(); //* * * close the modal without confirmation
    }

}