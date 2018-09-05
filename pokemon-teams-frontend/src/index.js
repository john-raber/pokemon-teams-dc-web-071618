const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;
const mainContainer = document.querySelector("main");

document.addEventListener("DOMContentLoaded", init);

function init() {
  getPokemonTrainers();
}

function getPokemonTrainers() {
  fetch(TRAINERS_URL)
    .then(r => r.json())
    .then(json => json.forEach(trainer => renderTrainerCard(trainer)));
}

function releasePokemon(e, id) {
  fetch(`${POKEMONS_URL}/${id}`, {
    method: "DELETE"
  })
    .then(r => r.json())
    .then(json => {
      e.path[1].remove();
    });
}

function addPokemon(id) {
  const data = {
    trainer_id: id
  };

  fetch(POKEMONS_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(r => r.json())
    .then(json => renderPokemonLi(id, json));
}

function renderTrainerCard(trainer) {
  const trainerCard = document.createElement("div");
  const trainerNameElement = document.createElement("p");
  const addPokemonButton = document.createElement("button");
  const pokemonListElement = document.createElement("ul");

  trainerCard.appendChild(trainerNameElement);
  trainerCard.appendChild(addPokemonButton);
  trainerCard.appendChild(pokemonListElement);
  mainContainer.appendChild(trainerCard);

  trainerCard.classList.add("card");
  trainerCard.id = `trainer-${trainer.id}`;
  trainerNameElement.innerText = trainer.name;
  addPokemonButton.innerText = "Add Pokemon";
  addPokemonButton.id = `add-pokemon-trainer-${trainer.id}`;
  addPokemonListener(addPokemonButton);
  pokemonListElement.id = `pokemon-list-trainer-${trainer.id}`;

  const trainerPokemons = trainer.pokemons;
  trainerPokemons.forEach(pokemon => {
    renderPokemonLi(trainer.id, pokemon);
  });
}

function addPokemonListener(button) {
  button.addEventListener("click", e => {
    if (e.path[1].querySelector("ul").querySelectorAll("li").length === 6) {
      alert("You must release a pokemon first");
    } else {
      addPokemon(e.target.id.split("-")[3]);
    }
  });
}

function addReleaseListener(button) {
  button.addEventListener("click", e => {
    releasePokemon(e, e.target.id.split("-")[2]);
  });
}

function renderPokemonLi(trainerId, pokemon) {
  const pokemonListElement = document.querySelector(
    `#pokemon-list-trainer-${trainerId}`
  );
  const pokemonLiElement = document.createElement("li");
  const releaseButton = document.createElement("button");
  pokemonLiElement.innerText = `${pokemon.nickname} (${pokemon.species})`;
  releaseButton.classList.add("release");
  releaseButton.id = `release-pokemon-${pokemon.id}`;
  releaseButton.innerText = "Release";
  addReleaseListener(releaseButton);
  pokemonLiElement.appendChild(releaseButton);
  pokemonListElement.appendChild(pokemonLiElement);
}
