import {configServerAddress} from '../../../config/config.js';
import {getAllWorks} from '../../req-api/request-get.js';
import {genererProjetsDom} from '../display-projects.js';
import {displayGalleryModal} from './modal-gallery.js';
import {fillCategories,displayForm,checkFormMsg,validFormAjout} from './modal-form.js';

let modal = document.querySelector(".modal"); //***get Dom element from the modal in html
let btnClose = document.querySelector(".modal-btn-close"); //***get Dom element from the modal in html
let btnBack = document.querySelector(".modal-btn-back"); //***get Dom element from the modal in html
let btnValid = document.querySelector(".modal-btn-valid"); //***get Dom element from the modal in html
let modalTitle = document.querySelector(".modal-content h3"); //* * * get Dom element from the modal in html
let container = document.querySelector(".modal-content-main"); //* * * get Dom element from the modal in html
let modalErrorMsg = document.querySelector(".modal-content-errormsg"); //* * * get Dom element from the modal in html


function goTo1(){showEditingModal(1);} //* * *  function created to be ablle to pass parameters to the callback func
function goTo2(){showEditingModal(2);} //* * *  function created to be ablle to pass parameters to the callback func

btnBack.removeEventListener("click",goTo1); //* * *  arrow left button
btnBack.addEventListener("click",goTo1); //* * *  click -> go to step 1 : gallery with trashcan icon

//* * *  End of declarations ----------------


export function showEditingModal(step){ //* * * open modal and display current task, deleting or adding
  modal.style.display="flex"; //* * * show the whole modal
  modalErrorMsg.textContent="";
  modal.addEventListener("click", function(event){ //* * * close the modal by clicking outside
    if(event.target.id==="modal1"){closeModal();}
  });

  btnClose.addEventListener("click", closeModal); //* * *  close the modal by clicking cross
  btnValid.addEventListener("click",goTo2); //* * * click "ajouter photo" -> go to step 2 (add photo), in the modal
  btnValid.removeEventListener("click",validFormAjout);
  
 
  switch(step) {
        case 1: //* * *  step 1 : show gallerie with trash bin buttons and "ajouter photo" button
            modalStep1(); //function called to manage display of step 1 (gallery+trashcans)
        break;

        case 2: //* * *  step 2 : Add a photo
            modalStep2(); //function called to manage display of step 1 (gallery+trashcans)
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


function closeModal(){ //* * *  close the modal
    btnClose.removeEventListener("click", closeModal); //* * * keep it clean
    modal.style.display="none"; //* * * modal still in html code but hidden with css

} //* * *  end of close function


export async function updateMainGallery(){
    // step 3 modal??
    let url = await configServerAddress();  //* * * get url of current server (dev, prod...)
    let projets = await getAllWorks(url); //* * *  api request  to get all projects
    genererProjetsDom(projets); //* * * refresh the display of all projects on the website
    closeModal(); //* * * close the modal

}