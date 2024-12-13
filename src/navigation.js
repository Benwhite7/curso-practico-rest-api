let page = 1;
let maxPage;
let infiniteScroll;

searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
});

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends=';
});

arrowBtn.addEventListener('click', () => {
    // location.hash = '#home=';
    if (location.hostname !== 'localhost') {
        location.hash = 'home'
    } else {
        history.back();
    }
    
})

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll,false);

function navigator() {

    if (infiniteScroll) {
        window.removeEventListener('scroll', infiniteScroll, { passive: false});
        infiniteScroll = undefined;
    }

    if(location.hash.startsWith('#trends')) {
        trendsPage();
    } else if(location.hash.startsWith('#search=')) {
        searchPage();
    } else if(location.hash.startsWith('#movie=')) {
        moviePage();
    } else if(location.hash.startsWith('#categories=')) {
        categoriesPage();
    } else {
        homePage();
    }

    if (infiniteScroll) {
        window.addEventListener('scroll', infiniteScroll, { passive: false});
    }
}

function trendsPage(){
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    headerCategoryTitle.innerText = 'Tendencias';
    getTrendingMovies();
    infiniteScroll = getPaginatedTrendingMovies;
}
function searchPage(){
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=');
    getMoviesBySearch(query);
    infiniteScroll = getPaginatedMoviesBySearch(query);
}
function moviePage(){
    headerSection.classList.add('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=');

    getMovieId(movieId);
}
function categoriesPage(){
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, categoryData] = location.hash.split('=');
    const [categoryId, categoryName] = categoryData.split('-');
    headerCategoryTitle.innerText = categoryName;

    getMoviesByCategorie(categoryId);
    infiniteScroll = getPaginatedMoviesByCategorie(categoryId);
}
function homePage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');
    getTrendingMoviesPreview();
    getCategoriesPreview();
    getLikedMovies();
}

