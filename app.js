const searchUrl = "business&apiKey=1607dbe0f68548328a153148fe3b9431";
const apiKey = `&apikey=${api_key}`;

const images = {
    health: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2089&q=80",
    business: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    technology: "https://images.unsplash.com/photo-1455165814004-1126a7199f9b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    science: "https://images.unsplash.com/photo-1534777410147-084a460870fc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=60",
    entertainment: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
    sports: "https://images.unsplash.com/photo-1558006252-bc08d8bb0cf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
}

const links = document.querySelectorAll('.link');
links.forEach(link => {
    link.addEventListener('click', function() {
        searchBySection(link.id)
    });
});

function searchByKeyword(keyword) {
    const query = `q=${keyword}`;
    fetch(searchUrl + query + "&" + apiKey)
    .then(response => response.json())
    .then(data => console.log(data));
}

function searchById(id) {
    const searchUrl = "https://content.guardianapis.com/";
    fetch(searchUrl + id + "?" + apiKey)
    .then(response => response.json())
    .then(data => console.log(data));
}

function searchBySection(section) {
    const searchUrl = "http://newsapi.org/v2/top-headlines?country=us&category=";
    fetch(searchUrl + section + apiKey)
    .then(response => response.json())
    .then(data => {
        const imageBanner = document.querySelector('.banner')
        imageBanner.setAttribute("src", images[section]);
        postArticles(data.articles)
    })
}

function postArticles(data) {
    let html = ''
    const articleContainer = document.querySelector('.articles');
    data.forEach(article => {
        html += `
            <div class="articleCard">
                <img src="${article.urlToImage}" alt="${article.title}">
                <h2>${article.title}</h2>
                <p class="author">${article.author}</p>
                <hr>
                <p class="description>${article.description}</p>
                <a src="${article.url}">Read More...</a>
            </div>`;
        articleContainer.innerHTML = html;
    })
}

