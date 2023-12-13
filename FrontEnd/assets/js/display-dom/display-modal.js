let modal = document.querySelector(".modal");
let btnClose = document.querySelector(".modal-btn-close");
let btnValid = document.querySelector(".modal-btn-valid");
let modalTitle = document.querySelector(".modal-content h3");

export function showEditingModal(step){
  modal.style.display="flex";
 
  btnClose.addEventListener("click", closeModal);
  btnValid.textContent="Ajouter une photo";
  modalTitle.textContent="Galerie photo";

}

function closeModal(){
    btnClose.removeEventListener("click", closeModal);
    modal.style.display="none";

}