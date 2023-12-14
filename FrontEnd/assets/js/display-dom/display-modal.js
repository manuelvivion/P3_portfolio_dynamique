import {configServerAddress} from '../../config/config.js';
import {deleteProject, addNewProject, getAllWorks} from '../req-api/requetes.js';
import {genererProjetsDom} from './display-projects.js';

let modal = document.querySelector(".modal");
let btnClose = document.querySelector(".modal-btn-close");
let btnBack = document.querySelector(".modal-btn-back");
let btnValid = document.querySelector(".modal-btn-valid");
let modalTitle = document.querySelector(".modal-content h3");
let container = document.querySelector(".modal-content-main");

function goTo1(){showEditingModal(1);}
function goTo2(){showEditingModal(2);}

btnBack.removeEventListener("click",goTo1);
btnBack.addEventListener("click",goTo1);

export function showEditingModal(step){ //open modal and display current task, deleting or adding
  modal.style.display="flex";
  modal.addEventListener("click", function(event){ //close the modal by clicking outside
    if(event.target.id==="modal1"){closeModal();}
  });
  btnClose.addEventListener("click", closeModal); // close the modal by clicking cross
  btnValid.addEventListener("click",goTo2);
  
 
  switch(step) {
        case 1: // step 1 : show gallerie with trash bin buttons and "ajouter photo" button
            
            btnBack.className ="modal-btn-back";
            btnValid.textContent="Ajouter une photo";
            btnValid.style.backgroundColor="";
            modalTitle.textContent="Galerie photo";
            container.innerHTML=""; // we empty main content
            container.className=""; //remova all class to delete style
            displayGalleryModal();
        break;

        case 2: // step 2 : Add a photo
            btnBack.className ="modal-btn-back fa-solid fa-arrow-left";
            btnValid.removeEventListener("click",goTo2);
            btnValid.textContent="Valider";
            btnValid.style.backgroundColor="#aaa";
            modalTitle.textContent="Ajout photo";
            container.innerHTML=""; // we empty main content
            container.className=""; //remova all class to delete style
           
            displayForm();
            fillCategories();


        break;
    default:
      // code block
  } //end switch
  

} // end display modal function

function closeModal(){ // close the modal
    btnClose.removeEventListener("click", closeModal); //keep it clean
    modal.style.display="none"; //modal still in html code but hidden with css

} // end of close function

async function displayGalleryModal(){ //display vignettes with clickable delete button (trashcan)
    //set div "modal-content-main" attributes
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
            await deleteProject(url, event.target.dataset.id); //call delete function from requete module
            //update projets gallery in main window
            //update modal gallery
       });


    } // end for each project


} // end of display modal gallery

function displayForm(){
    //html code created and tested in external html document
    container.innerHTML=` 
    <form class="form-new-project">
            <div class="form-select-picture">
                <i class="fa-regular fa-image"></i>
                <input type="file" name="input-new-file" id="input-new-file" hidden required accept="image/png, image/jpeg">
                <!--our custom file upload button-->
                <label for="input-new-file">+ Ajouter photo</label>
                <p id="new-file-name">.jpg .png 4Mo max.</p>
            </div>
            <label>Titre</label>
            <input type="text" name="input-new-title" id="input-new-title" required>
            <label>Catégorie</label>
            <select id="select-new-category" required>
            </select>
        </form>
    `;

    let fileInput = document.getElementById("input-new-file");
    fileInput.addEventListener("change",function(){
        document.getElementById("new-file-name").textContent =fileInput.files[0].name;

        let vignette = document.createElement("img");
        let srcImg = URL.createObjectURL(fileInput.files[0]);
        //console.log(fileInput.files);
        vignette.src=srcImg;
        vignette.style.height="100%";
        vignette.style.objectFit="contain";
        let div = document.querySelector(".form-select-picture");
        //div.innerHTML="";
        div.appendChild(vignette);
        checkFormAjout();
    });

    document.getElementById("input-new-title").addEventListener("change",checkFormAjout);
}

function fillCategories(){
    let select = document.getElementById("select-new-category");

    let optionNull = document.createElement("option");
        optionNull.value=0;
        optionNull.textContent=" - Choisissez une catégorie -";
        select.appendChild(optionNull);

    let categories = window.localStorage.getItem("categories"); //load all works from local storage
    categories = JSON.parse(categories);
    for (let i = 0 ; i < categories.length ; i++){
        let option = document.createElement("option");
        option.value=categories[i].id;
        option.textContent=categories[i].name;
        select.appendChild(option);
    }

    select.addEventListener("change",function(){
        checkFormAjout();
        optionNull.disabled=true;
    });
}

function checkFormAjout(){
    //let test1 = document.getElementById("input-new-file").checkValidity();
    let test1 = document.querySelector(".form-select-picture img");
    let test2 = document.getElementById("input-new-title").checkValidity();
    let test3 = document.getElementById("select-new-category").checkValidity();
    let test4 = parseInt(document.getElementById("select-new-category").value);

    if(test1 && test2 && test3 && (test4!==0)){
        btnValid.style.backgroundColor=null;
        btnValid.addEventListener("click", validFormAjout);
    }
    else{
        btnValid.removeEventListener("click", validFormAjout);
        btnValid.style.backgroundColor="#aaa";
    }
}

async function validFormAjout(){
    
    let body = prepareBody();
    let url = await configServerAddress(); 
    let resp = await addNewProject(url,body);
    
    console.log("reponse ajout :"+resp);
    if (resp[0]===201){
        
        let projets = await getAllWorks(url); // api request  to get all projects
        genererProjetsDom(projets); //display projects on the website
        closeModal();
    }

}

function prepareBody(){
    let myFileInput = document.getElementById("input-new-file");
    let fData = new FormData();
    fData.append("image", myFileInput.files[0]);
    fData.append("title", document.getElementById("input-new-title").value );
    fData.append("category", document.getElementById("select-new-category").value);
    return fData;

}