#PROJECTE FINAL CIFO 2024 FRONTEND
# Memòria Tècnica del Projecte My Amiibo App

<https://main--myamiibo.netlify.app/trivia>

## 1. Introducció

### 1.1. Descripció del projecte
My amiibo app es una app dissenyada per mostrar els amiibos que estan al mercat actualment al a venta. S' ha establert com una manera de fer un portafoli laboral en el ambit de programació. Y a l'hora, practicar els elements que hem faltaben practicar del front end.


Que es un amiibo?:
Un amiibo es una serie de figures de coleccionistes, distribuida per nintendo.  Aquestes figures conten amb un xip NFC aprop de la base. La seva funcionalitat es doble, ja que no nomes son figures de adorn que utilitzis per a casa, tambe poden ferse servir dintre de videojocs preparats per a la tecnologia, aquestos adintre tenen unes funcions molt especifiques depenen del joc, poden ser varies o molt especifiques dintre de cada joc.

Tenen tot tipus de formats, series i altres. Per aixo s' ha tornat un article de coleccionista molt valorat.

La app consisteix en una llistat de tots els amiibos, mostrarlos i poderlos filtrarlos per diferents valors, en aquets els usuaris poden marcar quins son els seus amiibos favorits, els amiibos que son de la seva colecció personal, i els amiibos que volen ser adquirits a futur.

### 1.2. Públic objectiu

Coleccionistes de amiibos, curiosos o jugadors de nintendo 

 Els coleccionistes tenen una necesitat important de mantenir un control de la seva colecció, ja que si no es te control s' escomença a tenir problemes de compres o de espai, l' app et permet coneixer tots els amiibos que et faltin per comprar i els que ja tens en posesio, per si un cas compres algun ja tens un llistat per verificar. Apart, pots fer un llistat dels teus favorits per si vols comprarlos o usarlos als teus jocs. Ja que als detalls es pot veure el us de cada un a cada joc.



## 2. Planificació

### 2.1. Requisits funcionals

Per iniciar el projecte es va estimar que es necesitaria lo seguent:
- una landing page
- una pagina de detalls
- pagina de coleccio del usuari
- pagina del trivia
- ficar amiibos a favorits
- afegir amiibos a una llista de coleccio
- afegir amiibos a una llista de desitgats
- borrar aquets de totes les llistes abans esmentades
- un trivia aprofitant la API, de manera aleatoria y sense utilitzar preguntes predeterminades


   S' ha picat codi desde el 20 de maig fins al 21 de juny. 
    Primerament es va fer el llistat del fetch que arriba directament dela API per a tenir nomes el llistat, poc a poc es va implementar la paginació, el UI/UX i altres petites funcions d' usuari.

    Al'hora es va finalitzar els detalls del index.html i es va finalitzar la pagina dels detalls dels amiibos per a tenir tota la informació disponible en una sola pagina.

    Apart d' aixo, es va implementar el localstorage per a guardar els amiibos dintre del teu navegador i tambe el apartat "My collection" per a tenir un llistat dels teus amiibos. Tambe s' ha inclos 3 botons per incloure els amiibos a 3 llistats: Favorits, Coleccio i per comprar.

    Finalment es va finalitzar el trivia, consta de preguntes aleatories, respostes aleatories, puntatge, Scoreboard de punts , un multiplicador de punts i una conta enrere. Sistema de punts i altres punts forts


### 2.2. Requisits no funcionals
- la pagina ha de carregar rapid, encara que no hi hagi dades carregades
- simplificar el us de engatzematge de dades per evitar proteccio de usuari fent servir e local storage
- ser lo suficientment simple i llegible per a cuansevol usuari, i poder accedir a les dades de manera senzila
- aprofitar el maxim el API de amiibos proporcionat.


### 2.3. Diagrama de flux

 	[alt ](./flux.png)

## 3. Disseny de la Interfície

### 3.1. Estructura HTML
L' estructura es basica.
conte: Capçal, cos i peu de pagina.
Al capçal es mostra la informacio de navegacio del usuari
En el cos es mostra la informacio del usuari
i en el peu informació adicional.

S' ha utilitzat la etiqueta template del html per a amagar els templates utilitzats en el projecte.

### 3.2. Disseny CSS
Per al CSS s' ha utilitzat el framework bootstrap.
La majoria d' estils s' han fet al html,
pero hi han algunes clases personalitzades, per afegir animacions, i altres detalls menors per al trivia i el cos de la pagina.


### 3.3. Disseny Responsiu
Bootrsap esta preparat per als mediaqueries i tamanys de pantalles movils, per lo que no s' ha fet un gran esforç apart de algunes cosetes aqui i alla de la grid i altres petits detalls per afavorir.
Pero, s' hauria de repasar fer una ui/ux per a usuari de movil molt mes intuitiva

## 4. Funcionalitats i JavaScript

### 4.1. Funcionalitats principals
S' ha realitzat tota la implementacio de interactivitat, amb vanilla JS, per lo tant, tota funcio esta 
emprada i codificada amb JS.

### 4.2. Estructura del codi JavaScript

Encara que hi ha espai a la optimizacio del codi, a traves de crear clases, i importar algunes funcions que s' utilitzen globalment, s' ha decidit crear un arxiu per pagina per simplificar la tasca. No es la solució mes escalable, pero es tractaba de mostrar les dades crues, tenint en conte la naturalesa del amiibo i les seves funcionalitats, no hem preocupa la escalbilitat, per lo que s' ha disposat a fer scrips manuals a cada pagina.

S' ha afegit tot tipus de comentaris per localitzar per seccions de funcionalitats. 

### 4.3. Integració amb l'HTML i el CSS
S' ha implementat tota la manipulacio del DOM amb JS amb els seguents funcions: querySelector(), getElementById(), querySelectorAll(). Entre els templates i els ids de cada element, s' ha pogut modificar tot de manera senzilla.

## 5. Implementació

S'ha  fet servir VSCode amb, Eslint, thunderclient i altres petites funcionalitats.
Les versions s' han nat implementat a traves de github, a dos repositoris, un repositori privat per al CIFO
i un repositori public per a penjaro a traves de netlify.

No s' han realitzat branques al ser un projecte unipersonal, en cas de mantenir una escalabilitat s' hauria de fer una branca per cada pagina que es vulgi implementar o afegir.

## 6. Annexos

### 6.1. Codi font
[GitHub](https://github.com/MCorbalanF/myAmiibo)

### 6.2. Recursos addicionals
-----------
