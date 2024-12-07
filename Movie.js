const API_KEY = '4259be06';
const BASE_URL = 'http://www.omdbapi.com/';

// Category containers
const bollywoodMovies = document.getElementById('bollywoodMovies');
const hollywoodMovies = document.getElementById('hollywoodMovies');
//const tamilMovies = document.getElementById('tamilMovies');

// Loading indicators
const loadingBollywood = document.getElementById('loadingBollywood');
const loadingHollywood = document.getElementById('loadingHollywood');
//const loadingTamil = document.getElementById('loadingTamil');

// Category queries
const bollywoodQuery = 'Bollywood';
const hollywoodQuery = 'Hollywood';
//const tamilQuery = 'Tamil';

// Number of movies per page
const moviesPerPage = 10;
const totalMoviesToLoad = 100;  // Number of movies to load per category
const totalPages = Math.ceil(totalMoviesToLoad / moviesPerPage);

// Search input and button elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

// Fetch movies on page load
window.addEventListener('DOMContentLoaded', () => {
  fetchMultiplePages(bollywoodQuery, bollywoodMovies, loadingBollywood);
  fetchMultiplePages(hollywoodQuery, hollywoodMovies, loadingHollywood);
  //fetchMultiplePages(tamilQuery, tamilMovies, loadingTamil);
});

// Event listener for search button
searchButton.addEventListener('click', () => {
  const searchQuery = searchInput.value.trim();
  if (searchQuery) {
    // Clear previous results
    bollywoodMovies.innerHTML = '';
    hollywoodMovies.innerHTML = '';
    fetchMoviesByQuery(searchQuery); // Fetch movies based on search query
  } else {
    // If no input, fetch default categories
    fetchMultiplePages(bollywoodQuery, bollywoodMovies, loadingBollywood);
    fetchMultiplePages(hollywoodQuery, hollywoodMovies, loadingHollywood);
  }
});

// Fetch movies by a query (used in search)
function fetchMoviesByQuery(query) {
  showLoading(true);  // Show loading spinner

  const url = `${BASE_URL}?apikey=${API_KEY}&s=${query}&page=1`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.Response === "True") {
        displayMovies(data.Search, bollywoodMovies);
        displayMovies(data.Search, hollywoodMovies);
      } else {
        displayError(data.Error);
      }
    })
    .catch(error => {
      console.error("Error fetching movies:", error);
      displayError("Failed to fetch movies. Please try again later.");
    })
    .finally(() => {
      showLoading(false); // Hide the loading spinner
    });
}

// Fetch multiple pages of movies for a category
function fetchMultiplePages(query, container, loader) {
  showLoading(true, loader);  // Show loading spinner
  let page = 1;
  let moviesFetched = 0;

  // Use a recursive function to fetch all pages
  function fetchNextPage() {
    if (moviesFetched >= totalMoviesToLoad) return; // Stop once we reach the desired number of movies

    const url = `${BASE_URL}?apikey=${API_KEY}&s=${query}&page=${page}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.Response === "True") {
          displayMovies(data.Search, container);
          moviesFetched += data.Search.length;
          page++;
          fetchNextPage(); // Fetch the next page if not enough movies have been fetched
        } else {
          displayError(data.Error, container);
        }
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
        displayError("Failed to fetch movies. Please try again later.", container);
      })
      .finally(() => {
        // Hide the loading spinner after all pages have been fetched
        if (moviesFetched >= totalMoviesToLoad) {
          showLoading(false, loader);
        }
      });
  }

  fetchNextPage(); // Start fetching the first page
}

// Display the fetched movies in the movie list
function displayMovies(movies, container) {
  const moviesHTML = movies.map(movie => `
    <div class="movie">
      <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    </div>
  `).join('');
  container.innerHTML += moviesHTML; // Append the movies to the container
}

// Show loading spinner
function showLoading(show, loader) {
  loader.style.display = show ? 'block' : 'none';
}

// Display error message if something goes wrong
function displayError(message, container) {
  container.innerHTML = `<p>${message}</p>`;
}
