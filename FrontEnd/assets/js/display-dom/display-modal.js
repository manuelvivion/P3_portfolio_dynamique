import {configServerAddress} from '../../config/config.js';
import {deleteProject, addNewProject, getAllWorks} from '../req-api/requetes.js';
import {genererProjetsDom} from './display-projects.js';

let modal = document.querySelector(".modal"); //get Dom element from the modal in html
let btnClose = document.querySelector(".modal-btn-close"); //get Dom element from the modal in html
let btnBack = document.querySelector(".modal-btn-back"); //get Dom element from the modal in html
let btnValid = document.querySelector(".modal-btn-valid"); //get Dom element from the modal in html
let modalTitle = document.querySelector(".modal-content h3"); //get Dom element from the modal in html
let container = document.querySelector(".modal-content-main"); //get Dom element from the modal in html
let bufferInput = document.createElement("input"); // the buffer is created to keep value of file input, when we delete it in the form to display the vignette instead
bufferInput.type = "file";

function goTo1(){showEditingModal(1);} // function created to be ablle to pass parameters to the callback func
function goTo2(){showEditingModal(2);} // function created to be ablle to pass parameters to the callback func

btnBack.removeEventListener("click",goTo1); // arrow left button
btnBack.addEventListener("click",goTo1); // click -> go to step 1 : gallery with trashcan icon

// End of declarations ----------------


export function showEditingModal(step){ //open modal and display current task, deleting or adding
  modal.style.display="flex"; //show the whole modal

  modal.addEventListener("click", function(event){ //close the modal by clicking outside
    if(event.target.id==="modal1"){closeModal();}
  });

  btnClose.addEventListener("click", closeModal); // close the modal by clicking cross
  btnValid.addEventListener("click",goTo2); //click "ajouter photo" -> go to step 2 (add photo), in the modal
  
 
  switch(step) {
        case 1: // step 1 : show gallerie with trash bin buttons and "ajouter photo" button
            
            btnBack.className ="modal-btn-back"; //only this class for the <i>, so not visible
            btnValid.textContent="Ajouter une photo"; //set the button text
            btnValid.style.backgroundColor=""; //olive green color, default set in css
            modalTitle.textContent="Galerie photo"; //set text of the title of the modal
            container.innerHTML=""; // we empty main content
            container.className=""; //remova all class to delete style
            displayGalleryModal(); // call the function to display all projects vignettes with trashcan
        break;

        case 2: // step 2 : Add a photo
            btnBack.className ="modal-btn-back fa-solid fa-arrow-left"; //set all classes of the <i>, arrow becomes visible
            btnValid.removeEventListener("click",goTo2); //change the role of the main bottom button
            btnValid.textContent="Valider"; //set text of button
            btnValid.style.backgroundColor="#aaa"; // set button color to grey before form validation
            modalTitle.textContent="Ajout photo"; //text of the title
            container.innerHTML=""; // we empty main content
            container.className=""; //remova all class to delete style
           
            displayForm(); // get the form ready ; file input, text input, select
            fillCategories(); //function to load categories from localstorage and fill the select input


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
       let article = document.createElement("article"); //1 article = 1 project
       article.style.width="100%";
       article.style.position="relative";
       container.appendChild(article);

       let img = document.createElement("img"); // project main image
       img.src=project.imageUrl; //img src from loaded datas
       img.alt=project.title;
       img.style.width="100%";
       article.appendChild(img);

       let icon = document.createElement("i"); // display trashcan as icon, for each project
       icon.className="fa-solid fa-trash-can";
       icon.dataset.id=project.id; //we save the id of current project in the dataset
       article.appendChild(icon);
       let url = await configServerAddress(); // get actual host adress ; beta, dev, prod
       icon.addEventListener("click",async function(event){ //click on trashcan -> delete project
            let resp = await deleteProject(url, event.target.dataset.id); //call delete function from requete module
            //update projets gallery in main window
            //update modal gallery
            if (resp[0]===200){ //if response status sent from api is 201 (insertion ok)
        
                let projets = await getAllWorks(url); // api request  to get all projects
                genererProjetsDom(projets); //refresh the display of all projects on the website
                closeModal(); //close the modal
            }
       });


    } // end for each project


} // end of function display modal gallery



function displayForm(){ // display "add photo" form : input file, input text and select category
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
    fileInput.addEventListener("change",function(){ //when image is chosen from input file
        document.getElementById("new-file-name").textContent =fileInput.files[0].name;

        let vignette = document.createElement("img"); //img created to display vignette of selected file
        bufferInput = fileInput; // we copy the file input in buffer to be able to use it later to prepare the formData Body (as main file input will be deleted, then not accessible, to display the vignette)
        

        let srcImg = URL.createObjectURL(fileInput.files[0]); //create a valid url source for the vignette
        
        vignette.src=srcImg; // assign correct url source
        vignette.style.height="100%";
        vignette.style.objectFit="contain"; //manage vignette size
        let div = document.querySelector(".form-select-picture");
        div.innerHTML=""; // we delete the whole div (<i>, input file, label , <p>)
        div.appendChild(vignette); // to show only the vignette
        checkFormAjout(); //trigger the form validation when file is loaded
    }); // End of function when new image is loaded

    document.getElementById("input-new-title").addEventListener("change",checkFormAjout);
}// End of function display form




function fillCategories(){ // load categories and fill the select in the form
    let select = document.getElementById("select-new-category");

    let optionNull = document.createElement("option"); // create first "useless" option
        optionNull.value=0;
        optionNull.textContent=" - Choisissez une catégorie -";
        select.appendChild(optionNull);

    let categories = window.localStorage.getItem("categories"); //load all works from local storage
    categories = JSON.parse(categories);
    for (let i = 0 ; i < categories.length ; i++){ //create an option for every category 
        let option = document.createElement("option");
        option.value=categories[i].id; // we store the id of category in value attribute
        option.textContent=categories[i].name;
        select.appendChild(option);
    } // end of for

    select.addEventListener("change",function(){ // when select is updated
        checkFormAjout(); //trigger the form validation 
        optionNull.disabled=true; //make the first "useless" unclikable
    });
}

function checkFormAjout(){ // after change of each input, check form validation to make the main buttom button clickable
    
    let test1 = document.querySelector(".form-select-picture img");
    let test2 = document.getElementById("input-new-title").checkValidity();
    let test3 = document.getElementById("select-new-category").checkValidity();
    let test4 = parseInt(document.getElementById("select-new-category").value);

    if(test1 && test2 && test3 && (test4!==0)){ // if all good
        btnValid.style.backgroundColor=null; //set the button color back to default (olive green)
        btnValid.addEventListener("click", validFormAjout); // make the button launch the project addition
    }
    else{ // if form invalid
        btnValid.removeEventListener("click", validFormAjout);  //no click possible
        btnValid.style.backgroundColor="#aaa"; //button is grey
    }
} // end of form validation

async function validFormAjout(){ //form is valid, button is clickable, then we can add new project
    
    let body = prepareBody(); // call the preparation of form data Body for the api request
    let url = await configServerAddress();  //get url of current server (dev, prod...)
    let resp = await addNewProject(url,body); // call function from "requetes" module
    
    if (resp[0]===201){ //if response status sent from api is 201 (insertion ok)
        
        let projets = await getAllWorks(url); // api request  to get all projects
        genererProjetsDom(projets); //refresh the display of all projects on the website
        closeModal(); //close the modal
    }

} //end of function

function prepareBody(){  // prepare the formData body for the Api request
    let fData = new FormData();
    //get values from the form
    fData.append("image", bufferInput.files[0]);
    fData.append("title", document.getElementById("input-new-title").value );
    fData.append("category", document.getElementById("select-new-category").value);
    return fData;

} // end of function