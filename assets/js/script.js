var calendarEl = $("#datepicker");
var selectedDate;
var resultCardContainer = $(".result-card-container");
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

    // fetching url 
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      resultCardContainer.empty();
      for (let i = 0; i < 4; i++) {
        //initializing card div
        var cardDiv = $("<div>").addClass("");
        //create the image of the card
        var cardImgDiv = $("<div>").addClass("card-image");
        var imgFigure = $("<figure>").addClass("image is-4by3");
        var imgEl = $("<img>");
        imgEl.attr("src", data.hits[i].recipe.image);
        imgEl.attr("alt", "image not avaliable");
        cardDiv.append(cardImgDiv.append(imgFigure.append(imgEl)));

        //create card content div
        var cardContentDiv = $("<div>");
        cardContentDiv.addClass("card-content");
        var mediaDiv = $("<div>");
        mediaDiv.addClass("media");
        var mediaContent = $("<div>");
        mediaDiv.addClass("media-content");
        var name = $("<p>");
        name.addClass("title is-4 name");
        name.text(data.hits[i].recipe.label);
        var cuisine = $("<p>");
        cuisine.addClass("subtitle is-6");
        cuisine.text("cuisine: " + data.hits[i].recipe.cuisineType);
        var calorie = $("<p>");
        calorie.addClass("subtitle is-6 calories");
        calorie.text("calories: " + Math.floor(data.hits[i].recipe.calories));
        mediaContent.append(name);
        mediaContent.append(cuisine);
        mediaContent.append(calorie);
        cardDiv.append(cardContentDiv.append(mediaDiv.append(mediaContent)));

        //create card footer div
        var footerDiv = $("<footer>");
        footerDiv.addClass("card-footer");
        var saveBtn = $("<button>");
        saveBtn.addClass("card-footer-item saveBtn");
        saveBtn.text("Save");
        let detailsBtn = document.createElement("button");
        detailsBtn.textContent = "Details";
        detailsBtn.setAttribute("class", "card-footer-item detailBtn");
        footerDiv.append(saveBtn);
        footerDiv.append(detailsBtn);
        cardDiv.append(footerDiv);
        // append the card to the result card container section
        resultCardContainer.append(cardDiv);
        //STORE 'NUTRITION LABEL' in data attribute
        var nutrition_str = encodeURIComponent(
          JSON.stringify(data.hits[i].recipe.digest)
        );
        detailsBtn.setAttribute("data-nutrition" + i, nutrition_str);
        //STORE 'RECIPE LIST' in data attribute
        var recipe_str = encodeURIComponent(
          JSON.stringify(data.hits[i].recipe.ingredientLines)
        );
        detailsBtn.setAttribute("data-recipe" + i, recipe_str);
        //STORE 'CARD INDEX' in data attribute
        detailsBtn.setAttribute("data-index", i);
      }
    });
}

//ONCLICK LISTENER FOR DETAIL BUTTON
$(document).on("click", ".detailBtn", function (e) {
  //Clear previously appended table
  $(".modal-body").html("");
  let indexNumber = $(e.currentTarget).data("index");
  //NUTRITION LABEL
  let nutrition_str = $(".detailBtn")[indexNumber].getAttribute(
    "data-nutrition" + indexNumber
  );
  let nutrition_object = JSON.parse(decodeURIComponent(nutrition_str));
  //RECIPE LIST
  let recipe_str = $(".detailBtn")[indexNumber].getAttribute(
    "data-recipe" + indexNumber
  );
  let recipe_object = JSON.parse(decodeURIComponent(recipe_str));
  //Call the table generator function and append table to Modal
  $(".modal-body").append(modalDataGenerator(recipe_object, nutrition_object));
  $("#myModal").modal("show")
});

// This function generates a table that contains a recipe list and nutritional label
function modalDataGenerator(recipe_object, nutrition_object) {
  let tbl = document.createElement("table");
  tbl.setAttribute("class", "modal-table");
  let tr = tbl.insertRow();
  let td = tr.insertCell();
  td.appendChild(document.createTextNode("Ingredient List"));
  for (let i = 0; i < recipe_object.length; i++) {
    let tr2 = tbl.insertRow();
    let td2 = tr2.insertCell();
    td2.appendChild(document.createTextNode(recipe_object[i]));
  }
  let tr3 = tbl.insertRow();
  let td3 = tr3.insertCell();
  td3.appendChild(document.createTextNode("Nutritional Label"));
  for (let i = 0; i < nutrition_object.length; i++) {
    let tr4 = tbl.insertRow();
    let td4 = tr4.insertCell();
    td4.appendChild(
      document.createTextNode(
        nutrition_object[i].label +
          ": " +
          Math.floor(nutrition_object[i].total) +
          nutrition_object[i].unit
      )
    );
  }
  return tbl;
}

// creating a datepicker calendar
$(function () {
  //default the selectedDate to today's date
  selectedDate = calendarEl.datepicker({ dateFormat: "yy-mm-dd" }).val();
  //functions to run when selected on a different date
  calendarEl.on("change", function () {
    selectedDate = $(this).val();
    ingredientPicked.empty();
    loadShoppingCart();
    totalCalories();
  });
});

//selector for picked ingredients 
var ingredientPicked = $('.ingredient-picked');
// function to load all ingredient picked on the right side bar
function loadShoppingCart(){
    //load corresponding local value
    for(var i = 0; i < 4; i++){
      var localData = localStorage.getItem(selectedDate+"-"+i);
      if(localData !== null){
        saveToList(selectedDate+"-"+i);
      } 
    }
  }

//Create a div element for the item under the list, parameter key format: yyyy-mm-dd-i 
function saveToList(key){
  //get corresponding local storage item
  var localItem = localStorage.getItem(key);
  //parse the localitem into object
  var localItem_object = JSON.parse(localItem);
        //get properties from the object
        var name = localItem_object.name;
        var index = localItem_object.index;
        var calories = localItem_object.calories;
        //if item div never exist, create the div
        if(!$('.id-'+index).length){
          var divEl = $('<div>');
          divEl.addClass('id-'+index);
          var nameEl = $('<div>');
          nameEl.text(name);
          divEl.append(nameEl);
          var caloriesEl = $('<div>');
          caloriesEl.text(calories);
          divEl.append(caloriesEl);
          var removeBtn = $('<button>');
          removeBtn.addClass('removeBtn');
          removeBtn.text('Remove');
          divEl.append(removeBtn);
          var miniDetailBtn = $('<button>');
          miniDetailBtn.addClass('miniDetailBtn');
          miniDetailBtn.text('Details');
          divEl.append(miniDetailBtn);
          ingredientPicked.append(divEl);
        }
}

  //function to run when save button is clicled 
  resultCardContainer.on('click','.saveBtn',function(){
    //parsing and storing the card details into an object, then store the object into local storage
    var cardDetail = $(this).siblings().last();
    var index = cardDetail.attr('data-index');
    var nutrition_str = cardDetail.attr('data-nutrition'+index);
    var recipe_str = cardDetail.attr('data-recipe'+index);
    var name = $(this).parent().siblings().eq(1).children().first().children().first().children().first().text();
    var calories = $(this).parent().siblings().eq(1).children().first().children().first().children().last().text().split(':')[1];
    var card_object = {
      index,
      name,
      calories,
      nutrition_str,
      recipe_str
    }
    //store the card into local storage, if item already exist in the local storage, it will just replace itself and nothing will be changed
    localStorage.setItem(selectedDate+"-"+index,JSON.stringify(card_object));
    saveToList(selectedDate+"-"+index);
    totalCalories();
  })

//function to run when detail button is clicked
resultCardContainer.on('click','.detailBtn',function(){
  console.log(this);
})
//when clear button is clicked, clear local storage on selected Date and clear shopping cart
$('.btnClear').on('click',function(){
  for(var i = 0; i < 4; i++){
    //remove all local storage on the selected date
    var localData = localStorage.getItem(selectedDate+"-"+i);
    if(localData !== null){
      localStorage.removeItem(selectedDate+'-'+i);
    }
  }
  //remove saved list
  totalCalories();
  ingredientPicked.empty();
})

//when a saved item's remove button is clicked, remove the corresponding card 
ingredientPicked.on('click','.removeBtn',function(){
  localStorage.removeItem(selectedDate+'-'+$(this).parent().attr('class').split('-')[1]);
  $(this).parent().remove();
  totalCalories();
})

//run after the page is ready
$(document).ready(function(){
  ingredientPicked.empty();
  loadShoppingCart();
  totalCalories();
}
)

//calculate the total calories and update the "total calories" div's tag
function totalCalories() {
  calorieSum = 0;
  if(ingredientPicked.children().length > 0){
    for(var i =0; i< ingredientPicked.children().length; i++){
      calorieSum += parseInt(ingredientPicked.children().eq(i).children().eq(1).text());
    }
  }
  // ingredientPicked.parent().children('subtitle').text("Total Calories: "+calorieSum);
  ingredientPicked.siblings().last().children('.subtitle').text("Total Calories: "+calorieSum);
}