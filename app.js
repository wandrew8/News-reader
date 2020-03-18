const searchUrl = "business&apiKey=1607dbe0f68548328a153148fe3b9431";
const apiKey = `&apikey=${api_key}`;
const title = document.querySelector('.bannerTitle')

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
            const filteredArticles = data.articles.filter(article => article.description)
            postArticles(filteredArticles);        })
    .catch(err => console.log(err))
}

function searchByKeyword(keyword) {
    fetch("http://newsapi.org/v2/everything?q=" + keyword + apiKey)
    .then(response => response.json())
    .then(data => {
            const filteredArticles = data.articles.filter(article => article.description)
            postArticles(filteredArticles, keyword);
        })
    .catch(err => console.log(err))
}

function searchBySection(section) {
    const searchUrl = "http://newsapi.org/v2/top-headlines?country=us&category=";
    fetch(searchUrl + section + apiKey)
    .then(response => response.json())
    .then(data => {
        const imageBanner = document.querySelector('.bannerImage')
        imageBanner.setAttribute("src", images[section]);
        const filteredArticles = data.articles.filter(article => article.description)
        postArticles(filteredArticles);
        displayTitle(section);
    })
    .catch(err => console.log(err))

}

function postArticles(data, keyword) {
    let html = '';
    const articleContainer = document.querySelector('.articles');
    const errorContainer = document.querySelector('.errors');
    if (data.length === 0) {
        const error = `<h2 class="error">Sorry we couldn't find any articles for ${keyword}</h2>`;
        errorContainer.innerHTML = error;
        articleContainer.innerHTML = '';
    } else {
        errorContainer.innerHTML = '';
        data.forEach(article => {
            html += `
            <div class="articleCard">
            <img src="${article.urlToImage ? article.urlToImage : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2100&q=80"}" alt="${article.title}">
            <h2>${article.title}</h2>
            <p class="author">${article.author && article.author.length < 30 ? article.author: ''}</p>
            <hr>
            <p class="description">${article.description}</p>
            <a href="${article.url}">Read More...</a>
            </div>`;
            articleContainer.innerHTML = html;
        })
    };
}

function displayTitle(text) {
    title.classList.add('hidden')
    setTimeout(function() {
        title.textContent = `${text.toUpperCase()} NEWS`;
        title.classList.remove('hidden');
    }, 1000)
}

const formButton = document.querySelector('.submitForm');
formButton.addEventListener('click', function(e) {
    console.log('clicked')
    e.preventDefault();
    validateSubmit();
})

function validateSubmit() {
    const inputEl = document.querySelector("#searchForm input");
    const value = inputEl.value.trim();
    console.log(value)
    if (!value) {
        inputEl.setCustomValidity('Please enter a search query');
    } else if (value.length < 3) {
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
document.addEventListener('DOMContentLoaded', getTopHeadlines)