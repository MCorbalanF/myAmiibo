/* get root  */
const root = document.querySelector('#root')
const template = document.querySelector('#details').content;
const details = template.cloneNode(true)
const loadingSpinner = document.getElementById('loadingSpinner');

//---------------------
const gameList = document.querySelector('#gamelist').content;
const useList = document.querySelector('#uselist').content;

//-------------------------------------------------------------------toast
function alertToast(text){
    const toast = document.querySelector("#toast");
    toast.querySelector(".toast-body").innerText = text
    const showToast = bootstrap.Toast.getOrCreateInstance(toast);
    showToast.show();
}

/* fetch de dades */
async function fetchAmiiboDetails(amiiboId) {

    const tail = amiiboId.toString();
    const url = `https://www.amiiboapi.com/api/amiibo/?tail=${tail.substring(8, 16)}&showusage`; 
    root.innerHTML = "";
    loadingSpinner.classList.remove('d-none');
   
    try {
        const response =  await fetch(url);
        if(!response.ok){
            throw new Error("Fallo de la xarxa: " + response.statusText)
        } 
        const data = await response.json();
        
            displayAmiiboDetails(data.amiibo[0]);
            loadingSpinner.classList.add('d-none');


    } catch(error){
        console.error("Error: ", error)
    }
   await fetch(url)
        .then(response => response.json())
        .then(data => {
               
            })
        .catch(error => console.error('Error:', error));
}

/* Draw amiibo details */
function displayAmiiboDetails(amiibo) {
    document.querySelector("title").innerText = ` ${amiibo.name} - ${amiibo.type} `;
    details.querySelector(".card-title").textContent = amiibo.name
    details.querySelector("img").src = amiibo.image
    details.querySelector(".fullimage").src = amiibo.image
    
    details.querySelector(".amiibotype").innerText = amiibo.type;
    details.querySelector(".gameserie").innerText = amiibo.gameSeries;
    details.querySelector(".amiiboserie").innerText = amiibo.amiiboSeries;
    details.querySelector(".character").innerText = amiibo.character;

    details.querySelector(".releaseau").innerText = amiibo.release.au;
    details.querySelector(".releaseeu").innerText = amiibo.release.eu;
    details.querySelector(".releasejp").innerText = amiibo.release.jp;
    details.querySelector(".releasena").innerText = amiibo.release.na;
    /*fav */
    const icon = details.querySelector("#iconfav");

    function changeFavIcon(){
        let savedCollection = JSON.parse(localStorage.getItem('savedAmiibos')) || [];
        const alreadySaved = savedCollection.some(savedAmiibo => savedAmiibo.name === amiibo.name);
        icon.innerText = alreadySaved ? "favorite" : "favorite_border";

    }   
    changeFavIcon();

    details.querySelector("#fav").addEventListener("click", function() {
        handleFavInput(amiibo); 
        changeFavIcon();
    })

    /*Usage */
    if(amiibo.gamesSwitch.length !== 0){
        const gameLists = gameList.cloneNode(true)

        gameLists.querySelector("h3").textContent = "Switch";

        amiibo.gamesSwitch.map(platform => {
            const gameUses = useList.cloneNode(true);

            gameUses.querySelector("li").textContent = platform.gameName;
            const span = document.createElement("span");
            span.setAttribute("class", "badge text-bg-primary rounded-pill");
            span.innerText = platform.amiiboUsage.length;
            gameUses.querySelector("li").appendChild(span);
            const tail = platform.gameID[0].toString();
            gameUses.querySelector("li").setAttribute("href",`#${tail.substring(8, 16)}` );
            gameUses.querySelector("li").setAttribute("aria-controls",`${tail.substring(8, 16)}` );
            gameUses.querySelector("li").classList.add('bg-danger');
            gameUses.querySelector(".collapse").id = `${tail.substring(8, 16)}`;
            //
            if(platform.amiiboUsage.length !== 0){
                platform.amiiboUsage.map(use => {
                    const newUse = document.createElement("li")
                    newUse.setAttribute("class"," w-75 list-group-item mx-auto d-flex justify-content-between align-items-center text-body-secondary px-5")
                    newUse.innerText = use.Usage;
                    gameUses.querySelector(".list-group").appendChild(newUse);
                })
            }
            gameLists.querySelector("ul").appendChild(gameUses)
        })
        details.querySelector("#vgamiibo").appendChild(gameLists)
    }
    if(amiibo.gamesWiiU.length !== 0){
        const gameLists = gameList.cloneNode(true)

        gameLists.querySelector("h3").textContent = "Wii U";

        amiibo.gamesWiiU.map(platform => {
            const gameUses = useList.cloneNode(true);

            gameUses.querySelector("li").textContent = platform.gameName;
            const span = document.createElement("span");
            span.setAttribute("class", "badge text-bg-primary rounded-pill");
            span.innerText = platform.amiiboUsage.length;
            gameUses.querySelector("li").appendChild(span);
            const tail = platform.gameID[0].toString();
            gameUses.querySelector("li").setAttribute("href",`#${tail.substring(8, 16)}` );
            gameUses.querySelector("li").setAttribute("aria-controls",`${tail.substring(8, 16)}` );
            gameUses.querySelector("li").classList.add('bg-primary');
            gameUses.querySelector(".collapse").id = `${tail.substring(8, 16)}`;
            //
            if(platform.amiiboUsage.length !== 0){
                platform.amiiboUsage.map(use => {
                    const newUse = document.createElement("li")
                    newUse.setAttribute("class"," w-75 list-group-item mx-auto d-flex justify-content-between align-items-center text-body-secondary px-5")
                    newUse.innerText = use.Usage;
                    gameUses.querySelector(".list-group").appendChild(newUse);
                })
            }
            gameLists.querySelector("ul").appendChild(gameUses)
        })
        details.querySelector("#vgamiibo").appendChild(gameLists)
    }
    if(amiibo.games3DS.length !== 0){
        const gameLists = gameList.cloneNode(true)

        gameLists.querySelector("h3").textContent = "3DS";

        amiibo.games3DS.map(platform => {
            const gameUses = useList.cloneNode(true);

            gameUses.querySelector("li").textContent = platform.gameName;
            const span = document.createElement("span");
            span.setAttribute("class", "badge text-bg-primary rounded-pill");
            span.innerText = platform.amiiboUsage.length;
            gameUses.querySelector("li").appendChild(span);
            const tail = platform.gameID[0].toString();
            gameUses.querySelector("li").setAttribute("href",`#${tail.substring(8, 16)}` );
            gameUses.querySelector("li").setAttribute("aria-controls",`${tail.substring(8, 16)}` );
            gameUses.querySelector("li").classList.add('bg-light', 'text-black');
            gameUses.querySelector(".collapse").id = `${tail.substring(8, 16)}`;
            //
            if(platform.amiiboUsage.length !== 0){
                platform.amiiboUsage.map(use => {
                    const newUse = document.createElement("li")
                    newUse.setAttribute("class"," w-75 list-group-item mx-auto d-flex justify-content-between align-items-center text-body-secondary px-5")
                    newUse.innerText = use.Usage;
                    gameUses.querySelector(".list-group").appendChild(newUse);
                })
            }
            gameLists.querySelector("ul").appendChild(gameUses)
        })
        details.querySelector("#vgamiibo").appendChild(gameLists)
    }

    //render
    root.appendChild(details)
}

function loadLocalStorage() {
    const amiibos = localStorage.getItem('savedAmiibos');
    return amiibos ? myCollection = JSON.parse(amiibos) : [];
  }


function handleFavInput(amiibo) {
    let savedCollection = JSON.parse(localStorage.getItem('savedAmiibos')) || [];
    const alreadySaved = savedCollection.some(savedAmiibo => savedAmiibo.name === amiibo.name);
    if (alreadySaved) {
        savedCollection = savedCollection.filter(savedAmiibo => savedAmiibo.name !== amiibo.name);
        localStorage.setItem('savedAmiibos', JSON.stringify(savedCollection));
        loadLocalStorage();
        alertToast(`${amiibo.name} erased from collection!`)

    }else{
        savedCollection.push(amiibo);
        localStorage.setItem('savedAmiibos', JSON.stringify(savedCollection));
        loadLocalStorage();
        alertToast(`Amiibo ${amiibo.name} guardado!`)
    }
}   

window.onload =  initialRender ;
function initialRender(){
    if (window.location.pathname.endsWith('details.html')) {
        // Obtiene la ID del amiibo de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const amiiboId = urlParams.get('id');

        if (amiiboId) {
            fetchAmiiboDetails(amiiboId);
        }
    }
}