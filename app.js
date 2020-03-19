let storageData = localStorage.favorites ? JSON.parse(localStorage.favorites) : [];
const searchUrl = "business&apiKey=1607dbe0f68548328a153148fe3b9431";
const apiKey = `&apikey=${api_key}`;
const title = document.querySelector('.bannerTitle');
const imageBanner = document.querySelector('.bannerImage');
const modal = document.querySelector('.modal');

const images = {
    health: "https://images.unsplash.com/photo-1477332552946-cfb384aeaf1c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    business: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    technology: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    science: "https://images.unsplash.com/photo-1475906089153-644d9452ce87?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    entertainment: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    sports: "https://images.unsplash.com/photo-1556719779-e1413cb43bb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
}

const links = document.querySelectorAll('.link');
links.forEach(link => {
    link.addEventListener('click', function() {
        searchBySection(link.id)
    });
});

const homePage = document.querySelector('.logo');
homePage.addEventListener('click', getTopHeadlines);

function getTopHeadlines() {
    fetch("http://newsapi.org/v2/top-headlines?country=us" + apiKey)
    .then(response => response.json())
    .then(data => {
            displayTitle("Top News Stories from around the globe")
            const filteredArticles = data.articles.filter(article => article.description)
            postArticles(filteredArticles);        
        })
    .catch(err => console.log(err))
}

function searchByKeyword(keyword) {
    fetch("http://newsapi.org/v2/everything?q=" + keyword + apiKey)
    .then(response => response.json())
    .then(data => {
            const filteredArticles = data.articles.filter(article => article.description)
            imageBanner.setAttribute("src", "https://images.unsplash.com/photo-1518672703296-e3022657f7b9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80");
            displayTitle("Search By Topic")
            postArticles(filteredArticles, keyword);
        })
    .catch(err => console.log(err))
}

function searchBySection(section) {
    const searchUrl = "http://newsapi.org/v2/top-headlines?country=us&category=";
    fetch(searchUrl + section + apiKey)
    .then(response => response.json())
    .then(data => {
        imageBanner.setAttribute("src", images[section]);
        const filteredArticles = data.articles.filter(article => article.description)
        postArticles(filteredArticles);
        displayTitle(`${section} news`);
    })
    .catch(err => console.log(err))

}

function postArticles(data, keyword) {
    let html = '';
    const articleContainer = document.querySelector('.articles');
    const messageContainer = document.querySelector('.message');
    if (data.length === 0) {
        const message = `<h2 class="mess">Sorry we couldn't find any articles for "${keyword}"</h2>`;
        const messageTwo = `<h2 class="mess">You have no saved articles</h2>`;
        messageContainer.innerHTML = `${keyword ? message : messageTwo}`;
        articleContainer.innerHTML = '';
    } else {
        messageContainer.innerHTML = keyword ? `<p class="mess">Search results for "${keyword}"` : '';
        data.forEach(article => {
            html += `
            <div class="articleCard">
            <div class="heart">${article.saved ? `<i class="fas delete fa-trash-alt"></i>`: `<i class="fas save fa-heart"></i>`}</div>
            <img src="${article.urlToImage ? article.urlToImage : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80"}" alt="${article.title}">
            <h2>${article.title}</h2>
            <p class="author">${article.author && article.author.length < 30 ? article.author: ''}</p>
            <hr>
            <p class="description">${article.description}</p>
            <a href="${article.url}" target="_blank" >Read More...</a>
            </div>`;
            articleContainer.innerHTML = html;
        })
        addListeners();
    };
}

function displayTitle(text) {
    title.classList.add('hidden')
    setTimeout(function() {
        title.textContent = `${text.toUpperCase()}`;
        title.classList.remove('hidden');
    }, 1000)
}

const formButton = document.querySelector('.submitForm');
formButton.addEventListener('click', function(e) {
    console.log('clicked')
    e.preventDefault();
    validateSubmit();
})


const favoritesLink = document.querySelector('.favorites');
favoritesLink.addEventListener('click', function() {
    displayTitle("Saved Articles");
    const data = JSON.parse(localStorage.getItem("favorites"));
    postArticles(data)
})

function validateSubmit() {
    const inputEl = document.querySelector("#searchForm input");
    const value = inputEl.value.trim();
    console.log(value)
    if (value.length < 3) {
        inputEl.setCustomValidity('Your Search is too short');
    } else if (value.length > 20) {
        inputEl.setCustomValidity('Your search is too long');
    } else {
        inputEl.setCustomValidity('');
        searchByKeyword(inputEl.value.trim());
        inputEl.value = '';
    }
}

//Load articles on page load
document.addEventListener('DOMContentLoaded', function() {
    getTopHeadlines();
    console.log(localStorage.favorites)
})

function addListeners() {
    const likeButtons = document.querySelectorAll('.heart');
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const url = this.parentElement.querySelector('a').getAttribute('href');
            if (Array.from(button.querySelector("i").classList).includes('save')) {
                const urlToImage = this.parentElement.querySelector('img').getAttribute('src');
                const title = this.parentElement.querySelector('h2').innerText;
                const author = this.parentElement.querySelector('.author').innerText;
                const description = this.parentElement.querySelector('.description').innerText;
                const heart = this.querySelector("i");
                modal.textContent = 'Article Saved to Favorites'
                modal.classList.remove('hidden');
                heart.classList.add('liked');
                setTimeout(function() {
                    modal.classList.add('hidden');
                }, 1500)
                setTimeout(function() { 
                    heart.classList.remove('liked')
                },500)
                saveToStorage(urlToImage, title, author, description, url)
            } else {
                removeFromStorage(url);
            }
            
        })
    })
}

function saveToStorage(urlToImage, title, author, description, url, saved) {
    const newArticle = {
        urlToImage,
        title,
        author,
        description,
        url,
        saved: true
    };
    const idArray = storageData.map(item => item.url)
    if (!idArray.includes(url)) {
        storageData.push(newArticle);
        localStorage.setItem("favorites", JSON.stringify(storageData));
    }
}

function removeFromStorage(id) {
    storageData = storageData.filter(item => item.url !== id);
    localStorage.setItem("favorites", JSON.stringify(storageData));
    const data = JSON.parse(localStorage.getItem("favorites"));
    modal.textContent = 'Article Removed from Favorites'
    modal.classList.remove('hidden');
    setTimeout(function() {
        modal.classList.add('hidden');
    }, 1000)
    postArticles(data)
}

