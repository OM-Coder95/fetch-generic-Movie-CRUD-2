const cl = console.log;

const formControl = document.getElementById("form");
const movieName = document.getElementById("movieName");
const movieRating = document.getElementById("movieRating");
const releaseDate = document.getElementById("releaseDate");
const movieImg = document.getElementById("movieImg");
const movieDescription = document.getElementById("movieDescription");
const genre = document.getElementById("genre");
const spinner = document.getElementById("spinner");
const movieContainer = document.getElementById("movieContainer");

const backdrop = document.getElementById("backdrop");
const movieModal = document.getElementById("movieModal");
const showMovieModal = document.getElementById("showMovieModal");

// buttons

const addMovieBtn = document.getElementById("addMovieBtn");
const updateMovieBtn = document.getElementById("updateMovieBtn");
const movieModalCloseBtn = document.getElementById("movieModalCloseBtn");
const closeMovieModalIcon = document.getElementById("closeMovieModalIcon");

const BASE_URL = `https://fetch-movie-1-default-rtdb.firebaseio.com`;

const MOVIE_URL = `${BASE_URL}/movie.json`;

// localState

let state = {
  movieArr: [],
  editId: null,
};

// Functions

// showUpdatedSmallElement

function showUpdatedSmallElement(updateId) {
  let col = document.getElementById(updateId);
  let updatedSmallElement = col.querySelector(".updatedAt");
  updatedSmallElement.classList.remove("d-none");
}

// nestedToArrObj

function objToArr(res) {
  for (const key in res) {
    res[key].id = key;
    state.movieArr.push(res[key]);
  }
}

// toggleFormBackdrop

function toggleFormBackdrop() {
  backdrop.classList.toggle("active");
  movieModal.classList.toggle("active");

  formControl.reset();

  if (!movieModal.classList.contains("active")) {
    updateMovieBtn.classList.add("d-none");
    addMovieBtn.classList.remove("d-none");
  }
}
// setRating

function setRating(rating) {
  if (rating > 7) {
    return "badge-success";
  } else if (rating > 5) {
    return "badge-warning";
  } else {
    return "badge-danger";
  }
}

// spinner

function toggleSpinner() {
  spinner.classList.toggle("d-none");
}

// snackbar

function snackbar(msg, icon) {
  Swal.fire({
    text: msg,
    icon: icon,
  });
}

// makeAPICall

function makeAPICall(url, methodType, msgBody = null) {
  let body = msgBody ? JSON.stringify(msgBody) : null;

  toggleSpinner();
  return fetch(url, {
    method: methodType,
    body: body,
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT TOKEN",
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("HTTP Error: " + res.status);
    }
    return res.json();
  });
}

// read

function showOnUI() {
  makeAPICall(MOVIE_URL)
    .then((res) => {
      cl(res);

      objToArr(res);
      cl(state.movieArr);

      rendering(state.movieArr);
    })
    .catch((err) => {
      snackbar(err, "error");
    })
    .finally(() => {
      toggleSpinner();
    });
}

showOnUI();

// rendering

function rendering(arr) {
  let result = "";

  arr.forEach((movie) => {
    result += `
          <div class="col-md-3 mb-3" id="${movie.id}">
                <div class="card movieCard">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h4 class="m-0">${movie.movieName}<h4>
                                <h5 class="m-0"><span class="badge ${setRating(movie.movieRating)}">${movie.movieRating}</span></h5>
                    </div>
                    <small>Release At: ${movie.releaseDate}</small>
                    ${
                      movie.updateDate
                        ? `<small class="updateDate show">Updated At: ${movie.updateDate}</small>`
                        : ""
                    }

                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${movie.movieImg}" alt="${movie.movieName}" title="${movie.movieName}">
                            <figcaption class="m-0">
                                <h4 class="m-0">${movie.movieName}</h4>
                                <small class="genre">Genre : ${movie.movieGenre}</small>
                                <p class="m-0">${movie.movieDescription}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onMovieEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button onclick="onMovieRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>
                    </div>
                </div>
            </div>
    `;
  });

  movieContainer.innerHTML = result;
}
// Create

function onMovieAdd(event) {
  event.preventDefault();

  let newMovie = {
    movieName: movieName.value.trim(),
    movieRating: movieRating.value,
    releaseDate: releaseDate.value,
    updateDate: null,
    movieImg: movieImg.value.trim(),
    movieDescription: movieDescription.value.trim(),
    movieGenre: genre.value,
  };

  makeAPICall(MOVIE_URL, "POST", newMovie)
    .then((res) => {
      cl(res);

      newMovie.id = res.name;

      state.movieArr.push(newMovie);

      createDiv(newMovie);
      snackbar("Movie created successfully!", "success");

      toggleFormBackdrop();
    })
    .catch((err) => {
      snackbar(err, "error");
    })
    .finally(() => {
      toggleSpinner();
    });
}

// createDiv

function createDiv(newMovie) {
  let div = document.createElement("div");

  div.id = newMovie.id;

  div.className = `col-md-3 mb-3`;

  div.innerHTML = `
           <div class="card movieCard">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h4 class="m-0">${newMovie.movieName}<h4>
                                <h5 class="m-0"><span class="badge ${setRating(newMovie.movieRating)}">${newMovie.movieRating}</span></h5>
                    </div>
                    <small>Release At: ${newMovie.releaseDate}</small>
                    <small class="updateDate">Updated At: </small>

                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${newMovie.movieImg}" alt="${newMovie.movieName}" title="${newMovie.movieName}">
                            <figcaption class="m-0">
                                <h4 class="m-0">${newMovie.movieName}</h4>
                                <small class="genre" id="genre${newMovie.id}">Genre : ${newMovie.movieGenre}</small>
                                <p class="m-0">${newMovie.movieDescription}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onMovieEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button onclick="onMovieRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>
                    </div>
                </div>
  `;

  movieContainer.append(div);
}

// edit

function onMovieEdit(ele) {
  let editId = ele.closest(".col-md-3").id;
  state.editId = editId;

  toggleFormBackdrop();

  let getObj = state.movieArr.find((ele) => ele.id === editId);
  cl(getObj);
  cl(getObj.movieGenre);

  movieName.value = getObj.movieName;
  movieRating.value = getObj.movieRating;
  releaseDate.value = getObj.releaseDate;
  movieImg.value = getObj.movieImg;
  movieDescription.value = getObj.movieDescription;
  genre.value = getObj.movieGenre;

  addMovieBtn.classList.add("d-none");
  updateMovieBtn.classList.remove("d-none");
}

// update

function onMovieUpdate() {
  let updateId = state.editId;

  if (movieRating.value > 10 || movieRating.value < 0) {
    snackbar("Invalid Rating! Please select rating between 0 to 10", "warning");
    return;
  }
  let updatedObj = {
    id: updateId,
    movieName: movieName.value.trim(),
    movieRating: movieRating.value,
    releaseDate: releaseDate.value,
    updateDate: new Date().toLocaleDateString(),
    movieImg: movieImg.value.trim(),
    movieDescription: movieDescription.value.trim(),
    movieGenre: genre.value,
  };

  const UPDATE_URL = `${BASE_URL}/movie/${updateId}.json`;
  makeAPICall(UPDATE_URL, "PATCH", updatedObj)
    .then((res) => {
      cl(res);

      let getIndex = state.movieArr.findIndex((ele) => ele.id === updateId);

      state.movieArr[getIndex] = updatedObj;

      updateOnUI(updatedObj);

      snackbar("Movie updated successfully!", "success");

      let div = document.getElementById(updateId);
      div.querySelector(".updateDate").classList.remove("d-none");
    })
    .catch((err) => {
      snackbar(err, "error");
    })
    .finally(() => {
      toggleSpinner();
      toggleFormBackdrop();
    });
}

// updateOnUI()

function updateOnUI(updatedObj) {
  let div = document.getElementById(updatedObj.id);

  div.innerHTML = `
  <div class="card movieCard">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h4 class="m-0">${updatedObj.movieName}<h4>
                                <h5 class="m-0"><span class="badge ${setRating(updatedObj.movieRating)}">${updatedObj.movieRating}</span></h5>
                    </div>
                    <small>Release At: ${updatedObj.releaseDate} </small>
                    <small class="updateDate">Updated At: ${updatedObj.updateDate} </small>

                    <div class="card-body py-0">
                        <figure class="m-0">
                            <img src="${updatedObj.movieImg}" alt="${updatedObj.movieName}" title="${updatedObj.movieName}">
                            <figcaption class="m-0">
                                <h4 class="m-0">${updatedObj.movieName}</h4>
                                <small class="genre">Genre : ${updatedObj.movieGenre}</small>
                                <p class="m-0">${updatedObj.movieDescription}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onMovieEdit(this)" class="btn btn-sm net-sec-btn">Edit</button>
                        <button onclick="onMovieRemove(this)" class="btn btn-sm net-pri-btn">Remove</button>
                    </div>
                </div>
  `;
}

// Remove

function onMovieRemove(ele) {
  let removeId = ele.closest(".col-md-3").id;

  const REMOVE_URL = `${BASE_URL}/movie/${removeId}.json`;

  Swal.fire({
    title: "Are you sure, You want to delete this movie?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      makeAPICall(REMOVE_URL, "DELETE")
        .then((res) => {
          cl(res);

          let getIndex = state.movieArr.findIndex((ele) => ele.id === removeId);

          state.movieArr.splice(getIndex, 1);

          ele.closest(".col-md-3").remove();
          snackbar("Movie removed successfully!", "success");
        })
        .catch((err) => {
          snackbar(err, "error");
        })
        .finally(() => {
          toggleSpinner();
        });
    }
  });
}
formControl.addEventListener("submit", onMovieAdd);
movieModalCloseBtn.addEventListener("click", toggleFormBackdrop);
closeMovieModalIcon.addEventListener("click", toggleFormBackdrop);
showMovieModal.addEventListener("click", toggleFormBackdrop);
backdrop.addEventListener("click", toggleFormBackdrop);

updateMovieBtn.addEventListener("click", onMovieUpdate);
