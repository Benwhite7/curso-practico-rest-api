const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    'api_key': API_KEY,
    'language': navigator.language || "es"
  },
});


function likedMoviesList() {
  const item = JSON.parse(localStorage.getItem('liked_movies'));
  let movies;
  if (item) {
    movies = item
  } else {
    movies = {};
  }

  return movies;
}

function likeMovie(movie) {
  const likedMovies = likedMoviesList();

  if(likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined
  } else {
    likedMovies[movie.id] = movie 
  }
  
  localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
  getLikedMovies();
}

let options = {
  root: null,
  rootMargin: "0px",
  threshold: 1.0,
};

let lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach(entrie => {
    if (entrie.isIntersecting) {
      const url = entrie.target.getAttribute('data-img', )
      entrie.target.setAttribute('src', url);
    }
  });
});

async function getTrendingMoviesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/day?api_key=' + API_KEY);
    const data = await res.json();
    const movies = data.results;
    createMovieItem(movies, trendingMoviesPreviewList,{lazyLoad : false, clean : true});
}

function createCategories(categories,container){
  container.innerHTML="";
  categories.forEach(category=>{
    const categoryContainer=document.createElement('div');
    categoryContainer.classList.add('category-container');
    const categoryTitle=document.createElement('h3');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id','id'+ category.id);
    categoryTitle.addEventListener('click',()=>{
      location.hash=`#category=${category.id}-${category.name}`;
    });
    const categoryTitleText=document.createTextNode(category.name);
    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  });
}

async function getCategoriesPreview() {
    const { data } = await api('genre/movie/list?language=es');
    const categories = data.genres;
    categoriesPreviewList.innerHTML = "";
    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.style.background = '#fbfafb';
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.addEventListener('click', () => {
          location.hash = `#categories=${category.id}-${category.name}`;
        })
        const categoryTitleText = document.createTextNode(category.name);

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        categoriesPreviewList.appendChild(categoryContainer);
    });
}

async function getMoviesByCategorie(id) {
  const {data} = await api('discover/movie', {
    params: {
      with_genres : id,
    }
  });
  const movies = data.results;
  maxPage = data.total_pages;
  createMovieItem(movies, genericSection, {lazyLoad : true, clean : true});
  window.scroll(0,0);
}

function getPaginatedMoviesByCategorie(id) {
  return async function () {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const {data} = await api('discover/movie', {
        params: {
          with_genres : id,
          page
        }
      });
      const movies = data.results;
      createMovieItem(movies, genericSection,{lazyLoad : true, clean : false});
    }
  }
  
}

async function getMoviesBySearch(query) {
  const {data} = await api('search/movie', {
    params: {
      query,
    }
  });
  const movies = data.results;
  maxPage = data.total_pages;
  createMovieItem(movies, genericSection, {lazyLoad : false, clean : true});
  window.scroll(0,0);
}

function getPaginatedMoviesBySearch(query) {
  return async function () {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const {data} = await api('search/movie', {
        params: {
          query,
          page,
        }
      });
      const movies = data.results;
      createMovieItem(movies, genericSection,{lazyLoad : false, clean : false});
    }
  }
  
}

async function getTrendingMovies() {
  const {data} = await api('trending/movie/day');
  const movies = data.results;
  maxPage = data.total_pages;
  createMovieItem(movies, genericSection,{lazyLoad : false, clean : true});

  // window.addEventListener('scroll', getPaginatedTrendingMovies)

  // const btnLoadMore = document.createElement('button');
  // btnLoadMore.classList.add('chargeMore');
  // btnLoadMore.innerText = 'Cargar mas';
  // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
  // genericSection.appendChild(btnLoadMore);
}

async function getPaginatedTrendingMovies() {
  const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

  const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
  const pageIsNotMax = page < maxPage;

  if (scrollIsBottom && pageIsNotMax) {
    // const btnDrop = document.querySelector('.chargeMore');
    // btnDrop.remove();
    page++;
    const {data} = await api('trending/movie/day', {
      params: {
        page,
      }
    });
    const movies = data.results;
    createMovieItem(movies, genericSection,{lazyLoad : false, clean : false});
  }
  // const btnLoadMore = document.createElement('button');
  // btnLoadMore.classList.add('chargeMore');
  // btnLoadMore.innerText = 'Cargar mas';
  // btnLoadMore.addEventListener('click', getPaginatedTrendingMovies);
  // genericSection.appendChild(btnLoadMore);
}

function createMovieItem(array, contain, {lazyLoad = false, clean = true}) {
  if(clean) {
    contain.innerHTML= '';
  }
  array.forEach(item => {
    const movieContainer = document.createElement('div');
    movieContainer.style.background = '#fbfafb00';
    movieContainer.classList.add(`movie-container`);
    let oration = item.title;
    let newOration = oration.replace(/ /g, "");
    movieContainer.classList.add(`${newOration}`);
    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', item.title);
    let url;
    item.poster_path ? url = item.poster_path : url = '/adOzdWS35KAo21r9R4BuFCkLer6.jpg';
    movieImg.setAttribute(
      lazyLoad ? 'data-img' : 'src',
      'https://image.tmdb.org/t/p/w300' + url 
    );

    movieImg.addEventListener('click', () => {
      location.hash = '#movie=' + item.id
    })

    const movieBtn = document.createElement('button');
    movieBtn.classList.add('movie-btn');
    const likedMovies = likedMoviesList();
    const arrayMovies = Object.values(likedMovies);
    arrayMovies.forEach(element => {
      if (element.id === item.id) {
        movieBtn.classList.add('movie-btn--liked');
      }
    });
    movieBtn.addEventListener('click', () => {
      movieBtn.classList.toggle('movie-btn--liked');
      likeMovie(item)
    });

    if(lazyLoad) {
      lazyLoader.observe(movieImg);
    }
    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    contain.appendChild(movieContainer);
  });
}

async function getMovieId(id) {
  const {data: movie} = await api(`movie/${id}`);

  const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
  headerSection.style.background = `
  linear-gradient(
    180deg,
    rgba(0,0,0,0.35) 19.27%,
    rgba(0,0,0,0) 29.17%
  ),
  url(${movieImgUrl})
  `; 

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategories(movie.genres, movieDetailCategoriesList);
  getRelatedMoviesById(id)
}

async function getRelatedMoviesById(id) {
  const {data} = await api(`movie/${id}/recommendations`);
  const relatedMovies = data.results;
  createMovieItem(relatedMovies, relatedMoviesContainer,{lazyLoad : false, clean : true});
}

function getLikedMovies() {
  const likedMovies = likedMoviesList();
  const arrayMovies = Object.values(likedMovies);
  
  createMovieItem(arrayMovies, likedMoviesListArticle, { lazyLoad: true, clean: true});
}
