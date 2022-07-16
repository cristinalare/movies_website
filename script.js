const tmdbKey = '9a482308981f947cef616bb16658fa83';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const searchBtn = document.querySelector('.search-btn');
const dropdownBtn = document.querySelector('.dropdown-btn');
const loading = document.querySelector('.loading');
const btnDiv = document.querySelector('.shuffle-btn');
const movieSection = document.querySelector('.movie-section');
const movieImg = document.querySelector('.movie-img');
const shuffleBtn = document.querySelector('.shuffle-btn');

const movieAnimation = () => {
  setTimeout(() => {
    movieSection.style.opacity = '1';
    movieImg.style.opacity = '1';
  }, 10);
}

const removeMovieAnimation = () => {
  movieSection.style.opacity = '0';
  movieImg.style.opacity = '0';
}

const showElement = (elem) => {
  elem.style.display = 'block';
}

const hideElement = (elem) => {
  elem.style.display = 'none';
}


const handleDropdownToggle = () => {
  const genresList = document.querySelector('.genres-list');
  genresList.classList.toggle('hidden');
}

const getGenres = async () => {
    const genreRequestEndpoint = '/genre/movie/list';
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;
  
    try {
      const response = await fetch(urlToFetch);
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.genres;
      }
    } catch(error) {
      console.log(error);
    }
};

const populateGenreDropdown = (genres) => {
    const dropdownList = document.querySelector('.genres-list');

    for (const genre of genres) {
        let li = document.createElement("li");
        li.id = genre.id;
        li.innerHTML = genre.name;
        dropdownList.appendChild(li);
        li.addEventListener('click', handleSelectGenre);
    }
};

const handleSelectGenre = (event) => {
  const dropdownBtn = document.querySelector('.dropdown-btn-text');
  const li = event.target.innerHTML;
  const liId = event.target.id;
  dropdownBtn.innerHTML = li;
  dropdownBtn.id = liId;
  handleDropdownToggle();
}

const getSelectedGenre = () => {
    const selectedGenre = document.querySelector('.dropdown-btn-text').id;
    return selectedGenre;
};

const getMovies = async (page) => {
    const selectedGenre = getSelectedGenre();
    const discoverMovieEndpoint = '/discover/movie';
    const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}&page=${page}`;
    const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;
  
    try {
      const response = await fetch(urlToFetch);
      if (response.ok) {
        const jsonResponse = await response.json();
        const movies = jsonResponse.results;
        return movies;
      }
    } catch(error) {
      console.log(error);
    }
  };

  const getMoviesFrom10Pages = async () => {
    let allMoviesArray = [];
    for (let i=1; i<=10; i++) {
      const moviesArray = await getMovies(i);
      if (moviesArray) {
        allMoviesArray = allMoviesArray.concat(moviesArray);
      } else return allMoviesArray;
    }

    return allMoviesArray;
  }
  
  const getMovieInfo = async movie => {
    const movieId = movie.id;
    const movieEndpoint = `/movie/${movieId}`;
    const requestParams = `?api_key=${tmdbKey}`;
    const urlToFetch = `${tmdbBaseUrl}${movieEndpoint}${requestParams}`;
  
    try {
      const response = await fetch(urlToFetch);
      if (response.ok) {
        const movieInfo = await response.json();
        return movieInfo;
      }
    } catch (error){
      console.log(error);
    }
  };
  
  const clearCurrentMovie = () => {
    const moviePosterDiv = document.querySelector('.movie-img');
    const movieTextDiv = document.querySelector('.movie-text');
    const movieInfo = document.querySelector('.movie-info');
    moviePosterDiv.innerHTML = '';
    movieTextDiv.innerHTML = '';
    movieInfo.style.minHeight = '80vh';
}

const getRandomMovie = (movies) => {
    const randomIndex = Math.floor(Math.random() * movies.length);
    const randomMovie = movies[randomIndex];
    return randomMovie;
};

const createMoviePoster = (posterPath) => {
    const moviePosterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;
    const posterImg = document.createElement('img');
    posterImg.setAttribute('src', moviePosterUrl);
    posterImg.setAttribute('id', 'moviePoster');
    return posterImg;
};

const createMovieTitle = (title) => {
    const titleHeader = document.createElement('h2');
    titleHeader.setAttribute('id', 'movieTitle');
    titleHeader.innerHTML = title;
    return titleHeader;
};

const createMovieOverview = (overview) => {
    const overviewParagraph = document.createElement('p');
    overviewParagraph.setAttribute('id', 'movieOverview');
    overviewParagraph.innerHTML = overview;
    return overviewParagraph;
};

const createMovieRating = (rating) => {
    const movieRating = document.createElement('p');
    movieRating.setAttribute('id', 'movieRating');
    movieRating.innerHTML = `Rating: ${rating}/10`;
    return movieRating;
};

const createMovieDate = (date) => {
    const movieDate = document.createElement('p');
    movieDate.setAttribute('id', 'movieDate');
    movieDate.innerHTML = `Release date: ${date}`;
    return movieDate;
}

const createMovieTime = (time) => {
    const movieTime = document.createElement('p');
    movieTime.setAttribute('id', 'movieTime');
    movieTime.innerHTML = `${time} mins`;
    return movieTime;
}

const createImdbLink = (imdb) => {
    const imdbImg = document.createElement('img');
    imdbImg.src = './assets/imdb.svg';
    imdbImg.setAttribute('class', 'imdb-img');

    const movieImdb = document.createElement('a');
    movieImdb.setAttribute('id', 'movieImdb');
    movieImdb.innerHTML = `See on IMBb`;
    const imdbLink = `https://www.imdb.com/title/${imdb}`;
    movieImdb.href = imdbLink;

    const imdbDiv = document.createElement('div');
    imdbDiv.className = 'imdb-div';
    imdbDiv.appendChild(imdbImg);
    imdbDiv.appendChild(movieImdb);

    return imdbDiv;
}

const displayMovie = (movieInfo) => {
    const moviePosterDiv = document.querySelector('.movie-img');
    const movieTextDiv = document.querySelector('.movie-text');
  
    const moviePoster = createMoviePoster(movieInfo.poster_path);
    const titleHeader = createMovieTitle(movieInfo.title);
    const movieTime = createMovieTime(movieInfo.runtime);
    const movieDate = createMovieDate(movieInfo.release_date);
    const overviewText = createMovieOverview(movieInfo.overview);
    const movieRating = createMovieRating(movieInfo.vote_average);
    const movieImdb = createImdbLink(movieInfo.imdb_id);
  
    moviePosterDiv.appendChild(moviePoster);
    movieTextDiv.appendChild(titleHeader);
    movieTextDiv.appendChild(movieTime);
    movieTextDiv.appendChild(movieDate);
    movieTextDiv.appendChild(movieRating);
    movieTextDiv.appendChild(overviewText);
    movieTextDiv.appendChild(movieImdb);
  
    showElement(btnDiv);
};

const showRandomMovie = async () => {
  const movies = await getMoviesFrom10Pages();
  const randomMovie = getRandomMovie(movies);
  const info = await getMovieInfo(randomMovie);
  displayMovie(info);
  hideElement(loading);
  showElement(movieSection);
  movieAnimation();
};

const handleAnimation = () => {
  const header = document.querySelector('header');
  const searchSection = document.querySelector('.search-section');
  header.classList.add('main-animation-triggered');  
  searchSection.classList.add('main-animation-triggered'); 
}

const searchHandler = () => {
  const dropdownBtn = document.querySelector('.dropdown-btn-text');
  const movieInfo = document.querySelector('.movie-info');

  if (movieInfo.childNodes.length > 0) {
      hideElement(movieSection);
      removeMovieAnimation();
      clearCurrentMovie();
      hideElement(btnDiv);
  };

  if (dropdownBtn.id) {
    showElement(loading);
    handleAnimation();
    setTimeout(showRandomMovie, 400);
  }
}

getGenres().then(populateGenreDropdown);
dropdownBtn.addEventListener('click', handleDropdownToggle);
searchBtn.addEventListener('click', searchHandler);
shuffleBtn.addEventListener('click', searchHandler);

document.addEventListener("keypress", (event) => {
  const dropdownBtn = document.querySelector('.dropdown-btn-text');
  if ((event.key === 'Enter' || event.key === 'NumpadEnter') && (dropdownBtn.id)) {
    event.preventDefault();
    searchHandler();
  }
});

// create absolute positioned inline movie-container divs, inside another div which contains the arrows as well.
// height 100%, overflow hidden
// put next/previous arrows
// every new search appends a new div to the array
// array has max 10 items - remove first item when reaching the limit 
// previous arrow goes to the previous movie div
// next arrow goes to the next movie div

// disable next arrow for the last item of the array (array[array.length-1])
// disable previous arrow for the first item of the array (array[0]); / index = 0