const root = document.getElementById("root");
let amiiboList = [];
//--------------------------------------------------------------------------sorting
let sortByName;

const sortInputName = document.getElementById("sortname")
sortInputName.addEventListener("click", setSortByName)
function setSortByName(){
    const sortedData = [...amiiboList];
    sortedData.sort((a, b) => {
        if (a.name < b.name) return sortByName ? -1 : 1;
        if (a.name > b.name) return sortByName ? 1 : -1;
        return 0;
    });
    amiiboList = sortedData ;
    sortInputName.querySelector(".material-symbols-outlined").textContent = sortByName ? "north" : "south";

    if(sortByName === undefined){
        const close = document.createElement("div");
        close.setAttribute("class", "btn p-0")
        close.setAttribute("id", "close_sortbyname")

        const icon = document.createElement("span");
        icon.setAttribute("class", "material-symbols-outlined")
        icon.innerText = "close";
        close.appendChild(icon);
        sortInputName.insertAdjacentElement('afterend', close);

        close.addEventListener("click", ()=>{
            sortByName = undefined;
            sortInputName.querySelector(".material-symbols-outlined").textContent = ""
            fetchAmiibo();
            document.getElementById("close_sortbyname").remove();
        })

    }
    
   
    sortByName = !sortByName ;
    refreshAmiibos();
}
 function sortListByName(){
   
 }

//--------------------------------------------------------------------------filter 
let filters = {
    name: "",
    type: "figure",
    amiiboseries: "",
    character: "",
    gameseries: "",
};


// filter list element
const inputType = document.getElementsByTagName("type");
const searchByNameInput = document.getElementById("searchname");

const typeList = document.getElementById("searchtype");
const gameseriesList = document.getElementById("searchgameseries");
const amiiboseriesList = document.getElementById("searchamiiboseries");
const characterList = document.getElementById("searchcharacter");
const outputSearchName = document.getElementById("outputsearchname")

searchByNameInput.addEventListener('input', filterName);
function filterName(event){
    filters.name = event.target.value;
    outputSearchName.querySelector("div").innerText = event.target.value;
    fetchAmiibo();
}
typeList.addEventListener('input', filterType);
function filterType(event){
    filters.type = event.target.value;
    fetchAmiibo();
}
gameseriesList.addEventListener('input', filterGameSeries);
function filterGameSeries(event){
    filters.gameseries = event.target.value;
    fetchAmiibo();
}
amiiboseriesList.addEventListener('input', filterGameSeries);
function filterGameSeries(event){
    filters.amiiboseries = event.target.value;
    fetchAmiibo();
}
characterList.addEventListener('input', filterGameSeries);
function filterGameSeries(event){
    filters.character = event.target.value;
    fetchAmiibo();
}
//-------------------------------------------------------------------------show more
//--------------------------------------------------------------------render
const cardTemplate = document.querySelector("#card").content;
function drawAmiiboCard(object){
    const card = cardTemplate.cloneNode(true)
    const id = object.head+object.tail;
    card.querySelector(".btn-primary").href = `details.html?id=${id}`;
    card.querySelector(".card").id = "card";

    const click = card.querySelector(".card")
    click.setAttribute('data-bs-target', `#${id}`);

    card.querySelector(".img-fluid").src = object.image;
    card.querySelector(".img-fluid").alt = object.name;
    card.querySelector(".card-title").textContent = object.name;
    card.querySelector(".card-text").textContent = object.amiiboSeries;

    //modal
  
    const modal = card.querySelector(".modal")
    card.querySelector(".modal").id = id;
    modal.setAttribute("aria-labelledby", `${id}Label`)

    card.querySelector(".modal-title").textContent = object.name;
    card.querySelector(".amiibo-type").innerText = object.type;

    card.querySelector(".modalimg").src = object.image;
    card.querySelector(".modalimg").alt = object.name;
    card.querySelector(".gameserie").innerText = object.gameSeries;
    card.querySelector(".amiiboserie").innerText = object.amiiboSeries;
    card.querySelector(".character").innerText = object.character;


    return card;
}
//--------------------------------------------------------------------render
function displayAmiibos(){
    
}
function refreshAmiibos(){
    root.innerHTML = "";
    const list = amiiboList //.slice(0, maxDisplayItem);
    list.map((amiibo, index) =>{
        root.appendChild(drawAmiiboCard(amiibo, index));
    });
    if(maxDisplayItem  >=  amiiboList.length){
        moreAmiibos.classList.add('d-none');
        paginationOptInput.querySelector("hr").classList.remove('d-none');
    }else{
        moreAmiibos.classList.remove('d-none');
        paginationOptInput.querySelector("hr").classList.add('d-none');
    }

}

//--------------------------------------------------------------------loading
function loadLocalStorage() {
    const amiibos = localStorage.getItem('savedAmiibos');
    //amiiboList = JSON.parse(amiibos);
    return amiibos ? amiiboList = JSON.parse(amiibos) : [];
}

  // Guardar datos en el localStorage
function saveCollection(amiibos) {
    localStorage.setItem('savedAmiibos', JSON.stringify(amiibos));
}

  



window.onload =  initialRender ;
function initialRender(){
    loadLocalStorage();
    refreshAmiibos();
}
