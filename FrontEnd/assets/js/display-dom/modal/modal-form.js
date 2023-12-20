import {configServerAddress} from '../../../config/config.js';
import {addNewProject} from '../../req-api/request-post.js';
import {updateMainGallery} from './display-modal.js';


let btnValid = document.querySelector(".modal-btn-valid"); //***get Dom element from the modal in html
let container = document.querySelector(".modal-content-main"); //* * * get Dom element from the modal in html
let modalErrorMsg = document.querySelector(".modal-content-errormsg"); //* * * get Dom element from the modal in html
let bufferInput = document.createElement("input"); //* * *  the buffer is created to keep value of file input, when we delete it in the form to display the vignette instead
bufferInput.type = "file";


export function displayForm(){ //* * *  display "add photo" form : input file, input text and select category
    //* * * html code created and tested in external html document
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
    fileInput.addEventListener("change",function(){loadInputImage(fileInput);}); //* * *  call function when new image is loaded

    document.getElementById("input-new-title").addEventListener("change",checkFormAjout);
}//* * *  End of function display form


function loadInputImage(fileInput){ //* * * when image is chosen from input file
    document.getElementById("new-file-name").textContent =fileInput.files[0].name;

    let vignette = document.createElement("img"); //* * * img created to display vignette of selected file
    bufferInput = fileInput; //* * *  we copy the file input in buffer to be able to use it later to prepare the formData Body (as main file input will be deleted, then not accessible, to display the vignette)
    

    let srcImg = URL.createObjectURL(fileInput.files[0]); //* * * create a valid url source for the vignette
    
    vignette.src=srcImg; //* * *  assign correct url source
    vignette.style.height="100%";
    vignette.style.objectFit="contain"; //* * * manage vignette size
    let div = document.querySelector(".form-select-picture");
    div.innerHTML=""; //* * *  we delete the whole div (<i>, input file, label , <p>)
    div.appendChild(vignette); //* * *  to show only the vignette
    checkFormAjout(); //* * * trigger the form validation when file is loaded
}// End of function


export function fillCategories(){ //* * *  load categories and fill the select in the form
    let select = document.getElementById("select-new-category");

    let optionNull = document.createElement("option"); //* * *  create first "useless" option
        optionNull.value=0;
        optionNull.textContent=" - Choisissez une catégorie -";
        select.appendChild(optionNull);

    let categories = window.localStorage.getItem("categories"); //* * * load all works from local storage
    categories = JSON.parse(categories);
    for (let i = 0 ; i < categories.length ; i++){ //* * * create an option for every category 
        let option = document.createElement("option");
        option.value=categories[i].id; //* * *  we store the id of category in value attribute
        option.textContent=categories[i].name;
        select.appendChild(option);
    } //* * *  end of for

    select.addEventListener("change",function(){ //* * *  when select is updated
        checkFormAjout(); //* * * trigger the form validation 
        optionNull.disabled=true; //* * * make the first "useless" unclikable
    });
}

function checkFormAjout(){ //* * *  after change of each input, check form validation to make the main buttom button clickable
    modalErrorMsg.textContent=""; //* * * 

    let test1 = document.querySelector(".form-select-picture img");
    let test2 = document.getElementById("input-new-title").checkValidity();
    let test3 = document.getElementById("select-new-category").checkValidity();
    let test4 = parseInt(document.getElementById("select-new-category").value);

    if(test1 && test2 && test3 && (test4!==0)){ //* * *  if all good
        btnValid.style.backgroundColor=null; //* * * set the button color back to default (olive green)
        btnValid.addEventListener("click", validFormAjout); //* * *  make the button launch the project addition
    }
    else{ //* * *  if form invalid
        btnValid.removeEventListener("click", validFormAjout); 
        btnValid.style.backgroundColor="#aaa"; //* * * button is grey
       
    }
} //* * *  end of form validation

export function checkFormMsg(){ //* * *  on button click, check form validation and display error msg if necessary
    if(btnValid.style.backgroundColor==="rgb(170, 170, 170)"){ //* * * validation is just tested by button color : color is grey 170 by previous CheckformAjout function
        modalErrorMsg.textContent="Veuillez remplir correctement tous les champs."; //* * *  if button is grey, we display error msg
     }
   
} //* * *  end of function

export async function validFormAjout(){ //* * * form is valid, button is clickable, then we can add new project

    let url = await configServerAddress();  //* * * get url of current server (dev, prod...)
    let body = prepareBody(); //* * *  call the preparation of form data Body for the api request
    let resp = await addNewProject(url,body); //* * *  call function from "requetes" module
    
    if (resp[0]===201){ //* * * if response status sent from api is 201 (insertion ok)
        await updateMainGallery(true); //* * * update projets gallery in main window. Parameter true is sent to force a validation message
    }

} //* * * end of function

function prepareBody(){  //* * *  prepare the formData body for the Api request
    let fData = new FormData();
    //* * * get values from the form
    fData.append("image", bufferInput.files[0]);
    fData.append("title", document.getElementById("input-new-title").value );
    fData.append("category", document.getElementById("select-new-category").value);
    return fData;

} //* * *  end of function