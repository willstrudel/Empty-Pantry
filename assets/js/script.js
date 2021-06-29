//Declare global variables
let body = document.body;
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
          data.hits[i].recipe.label;
        document.getElementById("calorie-" + i).innerHTML =
          "Calorie: " + Math.floor(data.hits[i].recipe.calories);
        document.getElementById("cuisine-" + i).innerHTML =
          "Cuisine: " + data.hits[i].recipe.cuisineType;
        document.getElementById("image-" + i).src = data.hits[i].recipe.image;
        let nutritionData = data.hits[i].recipe.digest; //nutrional label list
        let receipeData = data.hits[i].recipe.ingredientLines.toString(); //recipe list
        modalDataGenerator(nutritionData, receipeData); //function create a table for the modal
        
      }
      $(".result-card-container").removeClass("is-invisible"); //makes the cards visible, when the user searches for meals.
    });
}

//Generates a table that contains a recipe and nutritional label
function modalDataGenerator(nutritionData, receipeData) {
  let tbl = document.createElement("table");
  tbl.style.width = "200px";
  tbl.style.width = "200px";
  tbl.style.fontSize = "10px";
  tbl.style.border = "1px solid black";
  let tr = tbl.insertRow();
  let td = tr.insertCell();
  td.appendChild(document.createTextNode('Ingredient List: ' + receipeData))
  let tr2 = tbl.insertRow();
  let td2 = tr2.insertCell();
  td2.appendChild(document.createTextNode('Nutritional Label'))
  for (let i = 0; i < nutritionData.length; i++) {
    let tr3 = tbl.insertRow();
    let td3 = tr3.insertCell();
    td3.appendChild(
      document.createTextNode(
        nutritionData[i].label +
          ": " +
          Math.floor(nutritionData[i].total) +
          nutritionData[i].unit
      )
    );
  }
  body.appendChild(tbl);
}
