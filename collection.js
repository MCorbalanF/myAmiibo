const root = document.getElementById("root");
let amiiboList = [];
//---------------------------------------------------------------------toast
function alertToast(text){
    const toast = document.querySelector("#toast");
    toast.querySelector(".toast-body").innerText = text
    const showToast = bootstrap.Toast.getOrCreateInstance(toast);
    showToast.show();
}

//--------------------------------------------------------------------pagination show more
let maxDisplayItem = 35;
let addDisplayedItems = 10;
const moreAmiibos = document.getElementById("showMore");
const paginationOptInput = document.querySelector("#paginationopt");


function refreshAmiibos(){
    root.innerHTML = "";
    const list = amiiboList.slice(0, maxDisplayItem);
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



//--------------------------------------------------------------------------sorting
let sortByName;

const sortInputName = document.getElementById("sortname")
sortInputName.addEventListener("click", setSortByName)
function setSortByName(){
    const sortedData = [...amiiboList];
    sortedData.sort((a, b) => {
        if (a.name < b.name) return sortByName ?  1 : -1;
        if (a.name > b.name) return sortByName ? -1 : 1;
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
            document.getElementById("close_sortbyname").remove();
            loadLocalStorage();
    refreshAmiibos();

        })

    }
    
   
    sortByName = !sortByName ;
    refreshAmiibos();
}


//--------------------------------------------------------------------------filter 
let filters = {
    name: "",
    type: "",
    amiiboSeries: "",
    character: "",
    gameSeries: "",
};


const inputType = document.getElementsByTagName("type");
const searchByNameInput = document.getElementById("searchname");

const typeList = document.getElementById("searchtype");
const gameseriesList = document.getElementById("searchgameseries");
const amiiboseriesList = document.getElementById("searchamiiboseries");
const characterList = document.getElementById("searchcharacter");
const outputSearchName = document.getElementById("outputsearchname");


//-------chatgpt help
function applyFilters() {
    return amiiboList.filter(item => {
        return Object.keys(filters).every(key => {
            return filters[key] === '' || item[key] === filters[key];
        });
    });
}
//------------------

searchByNameInput.addEventListener('input', filterName);
function filterName(event){
    filters.name = event.target.value.toLowerCase();
    const filteredAmiiboList = amiiboList.filter(amiibo => amiibo.name.toLowerCase().includes(filters.name));
    amiiboList = filteredAmiiboList;
    refreshAmiibos();
}


let filterByType ;
typeList.addEventListener('input', filterType);
function filterType(event){
    filters.type = event.target.value;
        
    if(filterByType === undefined){
        //addEraseDataButton( filterByType, typeList );
        const close = document.createElement("button");
        close.setAttribute("type", "button");
        close.setAttribute("class", "btn-close");
        close.setAttribute("aria-label", "Close");
        close.setAttribute("id", `close_${typeList.id}`);
        close.addEventListener("click", ()=>{
            filterByType = undefined;
            typeList.value = "";
            filters.type = "";
            document.querySelector(`#close_${typeList.id}`).remove();
            loadLocalStorage();
            refreshAmiibos();
        })
    
        typeList.insertAdjacentElement('afterend', close);
    }
    filterByType = !filterByType;
    amiiboList = applyFilters();
    refreshAmiibos();
}

let filterByGameseries;
gameseriesList.addEventListener('input', filterGameSeries);
function filterGameSeries(event){
    filters.gameSeries = event.target.value;

    if(filterByGameseries === undefined){
        const close = document.createElement("button");
        close.setAttribute("type", "button");
        close.setAttribute("class", "btn-close");
        close.setAttribute("aria-label", "Close");
        close.setAttribute("id", "close_filterByGameseries");
        gameseriesList.insertAdjacentElement('afterend', close);

        close.addEventListener("click", ()=>{
            filterByGameseries = undefined;
            gameseriesList.value = "";
            filters.gameseries = "";
            document.querySelector("#close_filterByGameseries").remove();
            loadLocalStorage();
            refreshAmiibos();
        })

    }
    filterByGameseries = !filterByGameseries;
    amiiboList = applyFilters();
    refreshAmiibos();
}

let filterByamiiboseries
amiiboseriesList.addEventListener('input', filterAmiiboSeries);
function filterAmiiboSeries(event){
    filters.amiiboseries = event.target.value;

    if(filterByamiiboseries === undefined){
        const close = document.createElement("button");
        close.setAttribute("type", "button");
        close.setAttribute("class", "btn-close");
        close.setAttribute("aria-label", "Close");
        close.setAttribute("id", "close_filterByamiiboseries");
        amiiboseriesList.insertAdjacentElement('afterend', close);

        close.addEventListener("click", ()=>{
            filterByamiiboseries = undefined;
            amiiboseriesList.value = "";
            filters.amiiboSeries = "";

            document.querySelector("#close_filterByamiiboseries").remove();
            loadLocalStorage();
            refreshAmiibos();
        })

    }
    filterByamiiboseries = !filterByamiiboseries;
    amiiboList = applyFilters();
    refreshAmiibos();
}

let filterByCharacter;
characterList.addEventListener('input', filterCharact);
function filterCharact(event){
    filters.character = event.target.value;
    if(filterByCharacter === undefined){
        const close = document.createElement("button");
        close.setAttribute("type", "button");
        close.setAttribute("class", "btn-close");
        close.setAttribute("aria-label", "Close");
        close.setAttribute("id", "close_filterByCharacter");
        characterList.insertAdjacentElement('afterend', close);

        close.addEventListener("click", ()=>{
            filterByCharacter = undefined;
            characterList.value = "";
            filters.character = "";
            document.querySelector("#close_filterByCharacter").remove();
            loadLocalStorage();
            refreshAmiibos();
        })

    }
    filterByCharacter = !filterByCharacter;
    amiiboList = applyFilters();
    refreshAmiibos();
}


//--------------------------------------------------------------------render
function saveElementToList(amiibo, list){
    const original = localStorage.getItem(list)
    const change = JSON.parse(original);

    if(!change.includes(amiibo.tail)){
        change.push(amiibo);
        localStorage.setItem(list, JSON.stringify(change)); 
        alertToast(`${amiibo.name} added to ${list}`)
    }else{
        alertToast(`this amiibo is in the list`)

    }

}

const cardTemplate = document.querySelector("#card").content;
function drawAmiiboCard(object){
    const card = cardTemplate.cloneNode(true)
    const id = object.head+object.tail;
    card.querySelector("#amiiboinfo").href = `details.html?id=${id}`;
    card.querySelector(".card").id = "card";

    const click = card.querySelector(".card")
    click.setAttribute('data-bs-target', `#${id}`);

    card.querySelector(".img-fluid").src = object.image;
    card.querySelector(".img-fluid").alt = object.name;
    card.querySelector(".card-title").textContent = object.name;
    card.querySelector(".card-text").textContent = object.amiiboSeries;

    //modal
  
    //card.querySelector(".amiibo-type").innerText = object.type;


    //add to other list:
    card.querySelector("#tobuy").addEventListener("click", function() {
        saveElementToList(object, "buy");
    } )
    card.querySelector("#tocollection").addEventListener("click", function() {
        saveElementToList(object, "collection");
    } )


    return card;
}




//--------------------------------------------------------------------load data
const tabs = [
    "fav", "collection", "buy"
]
let selectedTab = tabs[0];

const getTabDOM = tabs.map(tab =>{
    const click = document.querySelector(`#${tab}`);
    click.addEventListener("click",  () => {
        tabs.map(tab => document.querySelector(`#${tab}`).classList.remove("active"))

        selectedTab = tab;
        initialRender();
   })
})


function loadLocalStorage() {
    let amiibos
    if(localStorage.getItem(selectedTab) !== null){
         amiibos = localStorage.getItem(selectedTab);
    }else{
        amiibos = localStorage.setItem(selectedTab, JSON.stringify([]));
    }
        const active = document.querySelector(`#${selectedTab}`);
        active.classList.add("active")
    return amiibos ? amiiboList = JSON.parse(amiibos) : [];

}

const optionTemplate = document.querySelector("#filter").content;
async function loadFilters() {
    const filterList = [
        {
            filter: "type",
            var: typeList
        },
        {
            filter: "gameSeries",
            var: gameseriesList
        },
        {
            filter: "amiiboSeries",
            var: amiiboseriesList
        },
        {
            filter: "character",
            var: characterList
        },
    
    ];
    filterList.map(async list => {
        let isRepeated = [];
        amiiboList.map(type => {
            if(!isRepeated.includes(type[list.filter])){
                const element = optionTemplate.cloneNode(true)
                element.querySelector("option").value = type[list.filter];
                element.querySelector("option").classList = "dropdown-item";
                element.querySelector("option").textContent = type[list.filter];
                list.var.appendChild(element);
                isRepeated.push(type[list.filter]);
            }
        });  
   
    })
    
    const updateURL = `https://www.amiiboapi.com/api/lastupdated`;

    try {
        const response =  await fetch(updateURL);
        if(!response.ok){
            throw new Error("Fallo de la xarxa: " + response.statusText)
        } 
        const data = await response.json();
        const update = data.lastUpdated.toString();
        document.querySelector("#lastupdate").innerText = `Last Update: ${update.substring(0, 10)}`

    } catch(error){
        console.error("Error: ", error)
    }

      

}
  // Guardar datos en el localStorage
function saveCollection(amiibos) {
    localStorage.setItem(selectedTab, JSON.stringify(amiibos));
}






window.onload =  initialRender ;
function initialRender(){
    loadLocalStorage();
    refreshAmiibos();
    loadFilters();
}
