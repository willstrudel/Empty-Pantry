//Search Button
let searchBtn = document.querySelector("#search");

//Event Listener to search for recipe
searchBtn.addEventListener("click", searchReceipeData);

//This function call the Recipe API and render the results in the page
function searchReceipeData() {
  let ingredientPick = $("#user-ingredient-pick").val();
  $("#user-ingredient-pick").val(""); //clear search input area
  let APP_ID = "76a989ad";
  let APP_KEY = "320df9951628218b23fd45fc6d1c69b2";
  let selectedDietType = document.getElementById("diet-type").value; //This is user's diet choice
  let selectedMealType = document.getElementById("meal-type").value; //This is user's meal choice
  //Recipe APi from EDAMAM
  let requestUrl =
    "https://api.edamam.com/api/recipes/v2?app_id=" +
    APP_ID +
    "&app_key=" +
    APP_KEY +
    "&type=public&q=" +
    ingredientPick +
    "&diet=" +
    selectedDietType +
    "&mealType=" +
    selectedMealType;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (let i = 0; i < 4; i++) {
        document.getElementById("name-" + i).innerHTML =
          data.hits[i].recipe.label; //console.log 
        document.getElementById("calorie-" + i).innerHTML =
          "Calorie: " + Math.floor(data.hits[i].recipe.calories);
        document.getElementById("cuisine-" + i).innerHTML =
          "Cuisine: " + data.hits[i].recipe.cuisineType;
        document.getElementById("image-" + i).src = data.hits[i].recipe.image;
        console.log(data.hits[i].recipe.digest); //Array of nutritional content to be rendered in the modal
        console.log(data.hits[i].recipe.ingredientLines); //Array of ingredients to be rendered in the modal
      }
      $(".result-card-container").removeClass("is-invisible"); //makes the cards visible, when the user searches for meals.
    });
}
