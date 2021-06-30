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

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
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
<<<<<<< HEAD
        var cuisine = $("<p>");
        cuisine.addClass("subtitle is-6");
        cuisine.text("cuisine: " + data.hits[i].recipe.cuisineType);
        var calorie = $("<p>");
        calorie.addClass("subtitle is-6");
        calorie.text("calories: " + Math.floor(data.hits[i].recipe.calories));
=======
        var cuisine = $('<p>');
        cuisine.addClass('subtitle is-6');
        cuisine.text('cuisine: '+data.hits[i].recipe.cuisineType);
        var calorie = $('<p>');
        calorie.addClass('subtitle is-6 calories');
        calorie.text('calories: '+Math.floor(data.hits[i].recipe.calories));
>>>>>>> 53c9ba502feaaeac3f7f7ac016cd0da5a84a2121
        mediaContent.append(name);
        mediaContent.append(cuisine);
        mediaContent.append(calorie);
        cardDiv.append(cardContentDiv.append(mediaDiv.append(mediaContent)));

        //create card footer div
        var footerDiv = $("<footer>");
        footerDiv.addClass("card-footer");
        let saveBtn = $("<button>");
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
<<<<<<< HEAD

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
  $("#myModal").modal("show");
=======
// creating a datepicker calendar
$( function() {
  selectedDate = calendarEl.datepicker({ dateFormat: "yy-mm-dd" }).val();
  console.log(selectedDate);
  calendarEl.on("change",function(){
    selectedDate = $(this).val();
    ingredientPicked.empty();
    loadShoppingCart();
});
});

var ingredientPicked = $('.ingredient-picked');
function loadShoppingCart(){
  var savedIngredients = localStorage.getItem(selectedDate);
  if(savedIngredients !== null){
    var ingredientArr = savedIngredients.split(',');
    for(var i =0; i<ingredientArr.length; i++){
      if(i%2 === 0){
        var name = ingredientArr[i];
      }else{
        var calories = ingredientArr[i];
        if($('.id-'+i).length){
        }else{
          var itemDiv = $('<div>');
          var itemName = $('<p>');
          itemName.text(name);
          itemName.addClass('id-'+i);
          itemDiv.append(itemName);
          var itemCal = $('<p>');
          itemCal.text(calories);
          itemDiv.append(itemCal);
          var detailBtn = $('<button>');
          detailBtn.text('Details');
          itemDiv.append(detailBtn);
          var removeBtn = $('<button>');
          removeBtn.text('Remove');
          itemDiv.append(removeBtn);
          ingredientPicked.append(itemDiv);
        }
      }
    }
  }
  
}

// function to run when save button is clicked
resultCardContainer.on('click','.saveBtn',function(){
  var name = $(this).parent().siblings().eq(1).children().first().children().first().children('.name').text();
  var calories = $(this).parent().siblings().eq(1).children().first().children().first().children('.calories').text().split(' ')[1];
  var selectedDateStorage = localStorage.getItem(selectedDate);
  var arrTemp = [name,calories];
  if(selectedDateStorage === null){
    localStorage.setItem(selectedDate,arrTemp);
  }else if (selectedDateStorage.indexOf(name)<0){
    localStorage.setItem(selectedDate,selectedDateStorage+','+arrTemp);
  }
  loadShoppingCart();
>>>>>>> 53c9ba502feaaeac3f7f7ac016cd0da5a84a2121
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
// $( function() {
//   selectedDate = calendarEl.datepicker({ dateFormat: "yy-mm-dd" }).val();
//   console.log(selectedDate);
//   calendarEl.on("change",function(){
//     selectedDate = $(this).val();
//     console.log(selectedDate);
// });
// });


// function to run when save button is clicked
resultCardContainer.on("click", ".saveBtn", function () {});

$('.btnClear').on('click',function(){
  localStorage.removeItem(selectedDate);
  ingredientPicked.empty();
})

loadShoppingCart();