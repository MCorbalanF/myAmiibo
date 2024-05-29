
/* Get elements */
const root = document.getElementById("root");
const loadingSpinner = document.getElementById('loadingSpinner');

/*bootstrap modals */


//global variables
let amiiboList = [];
let myCollection = [];
//--------------------------------------------------------------------------sorting
let sortByName;

const sortInputName = document.getElementById("sortname")
sortInputName.addEventListener("click", setSortByName)
function setSortByName(){
    const sortedData = [...amiiboList];
    sortedData.sort((a, b) => {
        if (a.name < b.name) return sortByName ? 1 : -1;
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
            fetchAmiibo();
            document.getElementById("close_sortbyname").remove();
        })

    }
    
   
    sortByName = !sortByName ;
    refreshAmiibos();
}


//--------------------------------------------------------------------------filter 
let filters = {
    name: "",
    type: "",
    amiiboseries: "",
    character: "",
    gameSeries: "",
};


// filter list element
const inputType = document.getElementsByTagName("type");
const searchByNameInput = document.getElementById("searchname");

const typeList = document.querySelector("#searchtype");
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

const addEraseDataButton = (toggle, dom) => {

    const close = document.createElement("button");
    close.setAttribute("type", "button");
    close.setAttribute("class", "btn-close");
    close.setAttribute("aria-label", "Close");
    close.setAttribute("id", `close_${dom.id}`);
    close.addEventListener("click", ()=>{
        toggle = undefined;
        dom.value = "";
        filters.type = "";
        document.querySelector(`#close_${dom.id}`).remove();
        fetchAmiibo();
    })

    dom.insertAdjacentElement('afterend', close);
    
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
            fetchAmiibo();
        })
    
        typeList.insertAdjacentElement('afterend', close);
    }
    filterByType = !filterByType;
    fetchAmiibo();
}

let filterByGameseries;
gameseriesList.addEventListener('input', filterGameSeries);
function filterGameSeries(event){
    filters.gameseries = event.target.value;

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
            fetchAmiibo();
        })

    }
    filterByGameseries = !filterByGameseries;

    fetchAmiibo();
}

let filterByamiiboseries
amiiboseriesList.addEventListener('input', filterAmiiboSeries);
function filterAmiiboSeries(event){
    filters.amiiboSeries = event.target.value;

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
            fetchAmiibo();
        })

    }
    filterByamiiboseries = !filterByamiiboseries;
    fetchAmiibo();
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
            fetchAmiibo();
        })

    }
    filterByCharacter = !filterByCharacter;

    fetchAmiibo();
}
//-------------------------------------------------------------------------show more
let maxDisplayItem = 35;
let addDisplayedItems = 10;

const paginationOptInput = document.querySelector("#paginationopt")

const itemPerPagesInput = document.querySelector("#itemperpages")
itemPerPagesInput.addEventListener("input",setItemPerPages);
function setItemPerPages(event){
    maxDisplayItem = parseInt(event.target.value);
    fetchAmiibo();
}
const itemAddedInput = document.querySelector("#itemadded")
itemAddedInput.addEventListener("input",setAddedItem);
function setAddedItem(event){
    addDisplayedItems = parseInt(event.target.value);
    refreshAmiibos();
}

const moreAmiibos = document.getElementById("showMore")
moreAmiibos.addEventListener("click", addMoreAmiibos)
function addMoreAmiibos(){
    maxDisplayItem += addDisplayedItems;
    refreshAmiibos();
}

/*---------------------------------------------------------------------------Draws */

const optionTemplate = document.querySelector("#filter").content;
async function fetchFilters() {
    const filterList = [
        {
            filter: "type",
            var: typeList
        },
        {
            filter: "gameseries",
            var: gameseriesList
        },
        {
            filter: "amiiboseries",
            var: amiiboseriesList
        },
        {
            filter: "character",
            var: characterList
        },
    
    ];
    const url = `https://www.amiiboapi.com/api/`;

    filterList.map(async list => {
        try {
            const response =  await fetch(`${url}/${list.filter}`);
            if(!response.ok){
                throw new Error("Fallo de la xarxa: " + response.statusText)
            } 
            const data = await response.json();
            
        
                data.amiibo.map(type=>{
                    
                        const element = optionTemplate.cloneNode(true)
                        element.querySelector("option").value = type.name;
                        element.querySelector("option").classList = "dropdown-item";
                        element.querySelector("option").textContent = type.name;
                        list.var.appendChild(element);
                        
                    
                });  
                

        } catch(error){
            console.error("Error: ", error)
        }

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

//dibujar carta de amiibo principal
const cardTemplate = document.querySelector("#card").content;
function drawAmiiboCard(object, index){
    const card = cardTemplate.cloneNode(true)
    const id = object.head+object.tail;
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
    modal.querySelector("#detailbtn").href = `details.html?id=${id}`;


    modal.querySelector(".modal-title").textContent = object.name;
    modal.querySelector(".amiibo-type").innerText = object.type;
    modal.querySelector(".modalimg").src = object.image;
    modal.querySelector(".modalimg").alt = object.name;
    modal.querySelector(".gameserie").innerText = object.gameSeries;
    modal.querySelector(".amiiboserie").innerText = object.amiiboSeries;
    modal.querySelector(".character").innerText = object.character;
    /*fav */

    function changeFavIcon(){
        let savedCollection = JSON.parse(localStorage.getItem('savedAmiibos')) || [];
        const alreadySaved = savedCollection.some(savedAmiibo => savedAmiibo.name === amiiboList[index].name);
        if (alreadySaved) { 
            modal.querySelector("#iconfav").innerText = "favorite";
         }else{
            modal.querySelector("#iconfav").innerText = "favorite_border";
         }
    }
    changeFavIcon();
    modal.querySelector("#fav").addEventListener("click", function() {
        handleFavInput(index); 
        changeFavIcon();
    })
    
    return card;
}





function alertToast(text){
    const toast = document.querySelector("#toast");
    toast.querySelector(".toast-body").innerText = text
    const showToast = bootstrap.Toast.getOrCreateInstance(toast);
    showToast.show();
}

//-----------------------------------------------------------------------------fetching
async function fetchAmiibo(){
    let url = `https://www.amiiboapi.com/api/amiibo/`
    root.innerHTML = "";
    loadingSpinner.classList.remove('d-none');
    paginationOptInput.classList.add('d-none');

    //ajudat per chatgpt
        const params = [];
        for (const key in filters) {
            if (filters[key]) {
                params.push(`${key}=${filters[key]}`);
            }
        }
        
        if (params.length > 0) {
            url += '?' + params.join('&');
        }
    //------------------------
    try {
        const response =  await fetch(url);
        if(!response.ok){
            throw new Error("Fallo de la xarxa: " + response.statusText)
        } 
        const data = await response.json();
        
            amiiboList = data.amiibo;
            
            if(maxDisplayItem >= data.amiibo.length){
                paginationOptInput.classList.add('d-none');

            }else{
                document.querySelector("#nodata").classList.remove('d-none');

                paginationOptInput.classList.remove('d-none');

            };
            if(data.amiibo.length === 0 ){
                document.querySelector("#nodata").classList.remove('d-none');

            }else{
                document.querySelector("#nodata").classList.add('d-none');
                
            }
            loadingSpinner.classList.add('d-none');
            paginationOptInput.classList.remove('d-none');

    } catch(error){
        console.error("Error: ", error)
    }

    refreshAmiibos();
}



//------------------------------------------------------------------------------render
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
/*-------------------------------------------------------------------------------fav */
    // Leer datos del localStorage o usar el JSON por defecto
    function loadLocalStorage() {
        const amiibos = localStorage.getItem('savedAmiibos');
        return amiibos ? myCollection = JSON.parse(amiibos) : [];
      }


    function handleFavInput(index) {
        let savedCollection = JSON.parse(localStorage.getItem('savedAmiibos')) || [];
        const alreadySaved = savedCollection.some(savedAmiibo => savedAmiibo.name === amiiboList[index].name);
        if (alreadySaved) {
            savedCollection = savedCollection.filter(savedAmiibo => savedAmiibo.name !== amiiboList[index].name);
            localStorage.setItem('savedAmiibos', JSON.stringify(savedCollection));
            loadLocalStorage();
            alertToast(`${amiiboList[index].name} erased from collection!`)

        }else{
            myCollection.push(amiiboList[index]);
            localStorage.setItem('savedAmiibos', JSON.stringify(myCollection));
            loadLocalStorage();
            alertToast(`Amiibo ${amiiboList[index].name} guardado!`)
        }
    }   
//--------------------------------------------------------------initializer

window.onload =  initialRender ;
async function initialRender(){

    await fetchFilters();


    //fetchAmiibo();
    loadLocalStorage();
    filterType({ target: { value: 'figure' } });

}
