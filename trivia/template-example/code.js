/// iDEW Trivia Template 2.1 (Fall 2018) - Dependency on `trivia.js` utility library

window.onload = setup;

function setup() {
   var googleSheetLink = "1B3RFU17Y3gE7hcsarU81TM7FPudDTmt0OJz2vws4uw4";
   trivia.loadQuestionBank(googleSheetLink);
}

function onQuestionBankLoaded() {
   displayCategoryScreen();
}

///////////// Functions Setting Up and Displaying Output  ////////////////////

function displayCategoryScreen() {
   //hide all screens then show category screen
   $(".screen").hide();
   $("#category-screen").show();
   
   //place the html you want in the header of category screen
   $("#category-screen-header").html(`
      <h2>Charlie Photon's No Phun Yet Trivia Template</h2>
      <h3>Choose a category</h3>
    `);
   
   //create an html button for each category and add to an array (list) of buttons
   var myCategoryButtonsArray = [];
   trivia.categories.forEach(catName => {
      myCategoryButtonsArray.push(`
        <button class='category-button' data-name='${catName}'>${catName}</button>
      `);
   });
   
   //have the trivia function prepare your buttons so they will respond to clicks and place on page
   var $myCategorySet = trivia.prepareCategoryButtons(myCategoryButtonsArray);
   $("#category-set").html($myCategorySet);
   
   //place some data at the bottom about how many questions have been answered so far
   $("#category-screen-footer").html(`
      ${trivia.countAnsweredQuestions()} of ${trivia.countAllQuestions()} questions answered.
   `);
}

function displayQuestionScreen(question) {
   //hide all screens then show question screen
   $(".screen").hide();
   $("#question-screen").show();
   
   //place the html you want in the header of question screen
   $("#question-screen-header").html(`
        <h5>${question.category}</h5>
        <h1>${question.question}</h1>
    `);
   
   //create html buttons for answers and 
   var myAnswerButtons = `
      <button class='answer correct-answer'>${question.correctAnswer}</button>
      <button class='answer incorrect-answer'>${question.incorrectAnswer1}</button>
      <button class='answer incorrect-answer'>${question.incorrectAnswer2}</button>
      <button class='answer incorrect-answer'>${question.incorrectAnswer3}</button>
  `;
   
   //have the trivia function prepare your buttons so they will respond to clicks and place on page
   var $myAnswerSet = trivia.prepareAnswerButtons(question, myAnswerButtons);
   $("#answer-set").html($myAnswerSet);
   
   //create html button for 'next' and have trivia function prepare the button
   var $myNextButton = trivia.prepareNextButton(`<button class="next-button">Next</button>`);
   $("#question-screen-footer").html($myNextButton).hide();// hide until after answer click
}

////////////// Functions Called by Trivia Events ///////////////////

function onClickedCategoryButton(category) {
   var question = trivia.getUnansweredQuestionFromCategory(category);
   if (question) displayQuestionScreen(question);
}

function onClickedAnswerButton(isCorrect) {
   $("#question-screen-footer").show(); //shows next button
   if (isCorrect) $("#question-screen-footer").append("Nice job!");
   else $("#question-screen-footer").append("Better luck next time!");
   $(".correct-answer").css("background-color", "#dfd");
}

function onClickedNextButton(category) {
   var nextQ = trivia.getUnansweredQuestionFromCategory(category);
   if (nextQ) displayQuestionScreen(nextQ);
   else displayCategoryScreen();
}
