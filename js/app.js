//Project 5: Public API Requests

//Creating global variables
const search = document.querySelector('.search-container');
const gallery = document.querySelector('.gallery');
const body = document.querySelector('body');

//Create searchbar
search.innerHTML = 
    `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`;
const searchButton = document.querySelector('.search-submit');
const searchInput = document.querySelector('.search-input');
let input = searchInput.textContent;

//Create message if search yields no results
const noResultsDiv = document.createElement('div');
noResultsDiv.textContent = 'Sorry, no one by that name';
noResultsDiv.style.color = 'white';
noResultsDiv.style.display = 'none';
noResultsDiv.style.fontSize = 'xx-large';
gallery.appendChild(noResultsDiv);

//Run Fetch request, requesting 12 users, all from the US
fetch('https://randomuser.me/api/?results=12&nat=us')
    .then(response => response.json())
    .then(data => {
        displayEmployee(data.results);
        cardListener(data.results);
    })

//Create gallery
function displayEmployee(data) {
    data.map(data => {
        const card = document.createElement('div');
        card.className = 'card';
        gallery.appendChild(card);
        card.innerHTML = `
            <div class="card-img-container">
                <img class="card-img" src="${data.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${data.name.first}`+ " " + `${data.name.last}</h3>
                <p class="card-text">${data.email}</p>
                <p class="card-text cap">${data.location.city}</p>
            </div>
        `;
    });


    //Add search functionality

    //Search function, called in event listeners below
    function searchPeople(userInput) {
        let total = 12;
        const searchButton = document.querySelector('.search-submit');
        const searchInput = document.querySelector('.search-input');
        let input = searchInput.value;
        const cards = document.querySelectorAll('.card');
        const cardNames = document.querySelectorAll('.card-name');
        
        for (let i = 0; i < cardNames.length; i += 1) {
            if (cardNames[i].innerText.toLowerCase().includes(input.toLowerCase())
                || input.value === '') {
                    cards[i].style.display = '';
            } else {
                total -= 1;
                cards[i].style.display = 'none';
            }
        }
        if (total === 0) {
            noResultsDiv.style.display = '';
        } else {
            noResultsDiv.style.display = 'none';
        }
    }

    //Add event listeners for keyup and Search button click.
    searchInput.addEventListener('keyup', (e) => {
        searchPeople(input);
    });

    searchButton.addEventListener('click', (e) => {
        searchPeople(input);
    });
}

//Create card event listeners
function cardListener (data) {
    const cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i += 1) {
        cards[i].addEventListener('click', (e) => displayModal(data, i))
    }
}

//Create modal

function displayModal(data, i) {

    //format birthday for use on Modal
    const fullBirthdate = data[i].dob.date;
    let ymd = fullBirthdate.substring(0, 10);
    const birthmonth = ymd.substring(5,7);
    const birthdate = ymd.substring(8);
    const birthYear = ymd.substring(2,4);
    const finalBirthdate = birthmonth + "/" + 
                            birthdate + "/" +
                            birthYear;
    
    //create modal
    let modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    body.appendChild(modalContainer);
    modalContainer.innerHTML = `
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${data[i].picture.medium}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${data[i].name.first} ${data[i].name.last}</h3>
                <p class="modal-text">${data[i].email}</p>
                <p class="modal-text cap">${data[i].location.city}</p>
                <hr>
                <p class="modal-text">${data[i].phone}</p>
                <p class="modal-text">${data[i].location.street.number} 
                                        ${data[i].location.street.name}, 
                                        ${data[i].location.city}, 
                                        ${data[i].location.state}  
                                        ${data[i].location.postcode}</p>
                <p class="modal-text">Birthday: ${finalBirthdate}</p>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `;
    const close = document.getElementById('modal-close-btn');
    const next = document.getElementById('modal-next');
    const prev = document.getElementById('modal-prev');
    
//Disabling prev/next buttons if on first or last person    
    if (i === 0) {
        prev.disabled = true;
        prev.style.backgroundColor = 'white';
        prev.style.color = 'white';
        next.disabled = false
    } else if (i + 1 === 12) {
        next.disabled = true
        next.style.backgroundColor = 'white';
        next.style.color = 'white';
        prev.disabled = false;
    } else {
        prev.disabled = false;
        next.disabled = false
    }

//Adding event listeners to close, next, and prev buttons.
    close.addEventListener('click', (e) => {
        modalContainer.remove();
    })

    next.addEventListener('click', (e) => {
        i += 1;
        modalContainer.remove();
        displayModal(data, i);
    })

    prev.addEventListener('click', (e) => {
        i -= 1;
        modalContainer.remove();
        displayModal(data, i);
    })
    
}