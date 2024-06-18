
/* Get elements */
const root = document.getElementById("root");
const loadingSpinner = document.getElementById('loadingSpinner');

//global variables
let amiiboList = [];
let showAmiiboList = [];
let myCollection = [];
//----------------------------------------------------------------------------------------------fetching
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
            showAmiiboList = [...amiiboList];
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
            
                let isRepeated = [];
                data.amiibo.map(type=>{
                    if(!isRepeated.includes(type.name)){
                        const element = optionTemplate.cloneNode(true)
                        element.querySelector("option").value = type.name;
                        element.querySelector("option").classList = "dropdown-item";
                        element.querySelector("option").textContent = type.name;
                        list.var.appendChild(element);
                        isRepeated.push(type.name)
                    }
                        
                        
                    
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

function refreshAmiibos(){
    root.innerHTML = "";
    const list = amiiboList.slice(0, maxDisplayItem);
    list.map((amiibo, index) =>{
        root.appendChild(drawAmiiboCard(amiibo));
    });
    if(maxDisplayItem  >=  amiiboList.length){
        moreAmiibos.classList.add('d-none');
        paginationOptInput.querySelector("hr").classList.remove('d-none');
    }else{
        moreAmiibos.classList.remove('d-none');
        paginationOptInput.querySelector("hr").classList.add('d-none');
    }
}
/*-----------------------------------------------------------------------------------------localstorage */
    const tabs = [
        "fav", "collection", "buy"
        ];
    let selectedTab = tabs[0];
    
    function loadLocalStorage() {
        tabs.map(a =>{
            if(localStorage.getItem(a) === null){
                localStorage.setItem(a, JSON.stringify([]));
           }
        })
    }
    function checkLocalStorageObj( object, list ){
        let savedCollection = JSON.parse(localStorage.getItem(list)) || [];
        const alreadySaved = savedCollection.some(amiibo => amiibo.tail === object.tail);
        return alreadySaved;
    }
    function getLocalStorageList( list ){
        let savedCollection = JSON.parse(localStorage.getItem(list)) || [];
        return savedCollection;
    }
    function handleAddListInput(object, list) {
        let localStorageList = getLocalStorageList(list)
        if (checkLocalStorageObj(object, list )) {
            let index = localStorageList.findIndex(element => JSON.stringify(element) === JSON.stringify(object));
            localStorageList.splice(index,1);
            localStorage.setItem(list, JSON.stringify(localStorageList));
            loadLocalStorage();
            alertToast(`${object.name} erased from ${list}!`)

        }else{
            localStorageList.push(object);
            localStorage.setItem(list, JSON.stringify(localStorageList));
            loadLocalStorage();
            alertToast(`Amiibo ${object.name} added to ${list}!`)
        }
    }   
    
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
    const sortIcon = sortInputName.querySelector("span");
    sortByName ? sortIcon.textContent = "north" : sortIcon.textContent = "south";
    sortIcon.classList.remove("d-none");


    
    if(sortByName === undefined){
        const close = document.createElement("div");
        close.setAttribute("class", "btn p-0")
        close.setAttribute("id", "close_sortbyname")

        const icon = document.createElement("span");
        icon.setAttribute("class", "material-symbols-outlined")
        icon.innerText = "close";
        close.appendChild(icon);
        sortInputName.insertAdjacentElement('afterend', close);
        sortInputName.insertAdjacentElement('afterbegin', sortIcon);

        close.addEventListener("click", ()=>{
            sortByName = undefined;
            sortInputName.querySelector(".material-symbols-outlined").textContent = ""
            fetchAmiibo();
            document.getElementById("close_sortbyname").remove();
            sortIcon.classList.add("d-none");
        })

    }
    
   
    sortByName = !sortByName ;
    refreshAmiibos();
}


//--------------------------------------------------------------------------------------filter 
let filters = {
    name: "",
    type: "",
    amiiboSeries: "",
    character: "",
    gameseries: "",
};


// filter list element
const inputType = document.getElementsByTagName("type");
const searchByNameInput = document.getElementById("searchname");
const outputSearchName = document.getElementById("outputsearchname");
searchByNameInput.addEventListener('input', filterName);
function filterName(event){
    filters.name = event.target.value;
    outputSearchName.querySelector("div").innerText = event.target.value;
    fetchAmiibo();
};


const hidefavInput = document.getElementById("hidefavinput");
hidefavInput.addEventListener('click',filterHideFav)
function filterHideFav(){
    checkManualFilter();
    refreshAmiibos();
};

const hideCollectionInput = document.getElementById("hidecolecinput");
hideCollectionInput.addEventListener('click',filterHideCollection)
function filterHideCollection(){
    checkManualFilter();
    refreshAmiibos();
};

const hideBuyInput = document.getElementById("hidebuyinput");
hideBuyInput.addEventListener('click',filterHideBuy)
function filterHideBuy(){
    checkManualFilter();
    refreshAmiibos();
};

function checkManualFilter(){
    const favlist = getLocalStorageList("fav").map(item => item.tail);
    const collectionlist = getLocalStorageList("collection").map(item => item.tail);
    const buylist = getLocalStorageList("buy").map(item => item.tail);
    amiiboList = [...showAmiiboList];

    if (hidefavInput.checked) {
        amiiboList = amiiboList.filter(item => !favlist.includes(item.tail));
    }
    if (hideCollectionInput.checked) {
        amiiboList = amiiboList.filter(item => !collectionlist.includes(item.tail));
    }
    if (hideBuyInput.checked) {
        amiiboList = amiiboList.filter(item => !buylist.includes(item.tail));
    }
};
const typeList = document.querySelector("#searchtype");
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
};


const gameseriesList = document.getElementById("searchgameseries");
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
};


const amiiboseriesList = document.getElementById("searchamiiboseries");
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


const characterList = document.getElementById("searchcharacter");
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
const cardTemplate = document.querySelector("#card").content;
function drawAmiiboCard(object){
    //draw card
    const card = cardTemplate.cloneNode(true)
    const id = object.head+object.tail;
    card.querySelector(".card").id = "card";
    card.querySelector("a").setAttribute("href", `details.html?id=${id}`) ;
    card.querySelector(".img-fluid").src = object.image;

    card.querySelector(".img-fluid").alt = object.name;
    card.querySelector(".card-title").textContent = object.name;
    card.querySelector(".card-text").textContent = object.amiiboSeries;
    card.querySelector("#detailbtn").href = `details.html?id=${id}`;

    function checkParams(list){
        let savedCollection = JSON.parse(localStorage.getItem(list)) || [];
        const alreadySaved = savedCollection.some(savedAmiibo => savedAmiibo.tail === object.tail);
        return alreadySaved;
    }

    //fav
    const fav = card.querySelector("#favbutton");
    fav.querySelector("span").classList.add("material-icons-outlined");
    fav.querySelector("span").innerText = checkParams("fav") ? "star" : "star_border" ;
    fav.addEventListener("click", function(){
        handleAddListInput(object, "fav");
        fav.querySelector("span").innerText = checkParams("fav") ? "star" : "star_border" ;
    } )
    

    //subactions
    const colec = card.querySelector("#colecbutton");
    colec.classList.add("material-icons");
    colec.innerText = checkParams("collection") ? "bookmark" :  "bookmark_border" ;
    colec.addEventListener("click", function(){
        handleAddListInput(object, "collection");
        colec.innerText = checkParams("collection") ? "bookmark" :  "bookmark_border" ;
    } )
    const buy = card.querySelector("#buybutton");
    buy.innerText =  "sell" ;
    buy.classList = checkParams("buy") ? buy.classList = "material-icons" : buy.classList =  "material-symbols-outlined" ;
    buy.addEventListener("click", function(){
        handleAddListInput(object, "buy");
        buy.classList = checkParams("buy") ? buy.classList = "material-icons" : buy.classList =  "material-symbols-outlined" ;
    } )


    return card;
}



function alertToast(text){
    const toast = document.querySelector("#toast");
    toast.querySelector(".toast-body").innerText = text
    const showToast = bootstrap.Toast.getOrCreateInstance(toast);
    showToast.show();
}


//--------------------------------------------------------------initializer

window.onload =  initialRender ;
async function initialRender(){

    await fetchFilters();


    //fetchAmiibo();
    loadLocalStorage();
    filterType({ target: { value: 'figure' } });

}
