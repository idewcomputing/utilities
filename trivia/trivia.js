//iDEW Trivia Utility Library (Fall 2018) - School of Informatics and Computing, Indiana University (IUPUI)
//dependency on 'tabletop.js' library

var trivia = {
   questions: [],
   categories: [],
   currentQuestion: null,
   currentCategory: null,
   prepareCategoryButtons: function(buttons) {
      this.currentCategory = null;
      this.currentQuestion = null;
      var $categorySet = $("<div>");
      buttons.forEach(button => {
         var $button = $(button);
         var cat = $button.attr("data-name");
         if (!this.getUnansweredQuestionFromCategory(cat))
            $button.attr("disabled", "disabled");
         $categorySet.append($button);
         var self = this;
         $button.one("click", function() {
            if (typeof onClickedCategoryButton == "function") {
               self.currentCategory = cat;
               onClickedCategoryButton(cat);
            } else alert("Trying to call a function called 'onClickedCategoryButton(category)', but none found!");
         });
      });
      return $categorySet.children();
   },
   prepareAnswerButtons: function(q, buttons) {
      var $thisAnswerSet = $("<div>");
      this.currentQuestion = q;
      $thisAnswerSet.html($(buttons));
      $thisAnswerSet.html(this.getShuffledArray($thisAnswerSet.children()));
      $thisAnswerSet.one("click", ".answer", function(event) {
         var isCorrect = $(event.target).hasClass("correct-answer");
         q.wasCorrectResponse = isCorrect;

         if (typeof onClickedAnswerButton == "function")
            onClickedAnswerButton(isCorrect);
         else
            alert(
               "Trying to call a function called 'onClickedAnswerButton(question)', but none found!"
            );
      });
      return $thisAnswerSet;
   },
   prepareNextButton: function(button) {
      var $nextButton = $(button);
      $nextButton.on("click", () => {
         if (typeof onClickedNextButton == "function")
            onClickedNextButton(this.currentCategory);
         else
            alert(
               "Trying to call a function called 'onClickedNextButton()', but none found!"
            );
      });
      return $nextButton;
   },
   loadQuestionBank: function(link) {
      return new Promise((resolve, reject) => {
         Tabletop.init({
            key: link,
            callback: data => {
               this.questions = trivia.getShuffledArray(
                  data["Sheet1"].elements
               ); //shuffle question order
               this.categories = [
                  ...new Set(this.questions.map(q => q.category))
               ];
               if (typeof onQuestionBankLoaded == "function")
                  onQuestionBankLoaded();
               else
                  alert(
                     "Trying to call a function called 'onQuestionBankLoaded()', but none found!"
                  );
               resolve("success");
            }
         });
      });
   },
   getUnansweredQuestionFromCategory: function(cat) {
      var remainingQuestions = this.questions.filter(q => {
         return q.wasCorrectResponse == null && q.category == cat;
      });
      return remainingQuestions.length ? remainingQuestions[0] : null;
   },
   countAllQuestions: function(cat) {
      return cat
         ? this.questions.filter(q => {
              return q.category == cat;
           }).length
         : this.questions.length;
   },
   countAnsweredQuestions: function(cat) {
      return cat
         ? this.questions.filter(q => {
              return q.category == cat && q.wasCorrectResponse != null;
           }).length
         : this.questions.filter(q => {
              return q.wasCorrectResponse != null;
           }).length;
   },
   countCorrectAnswers: function(cat) {
      return cat
         ? this.questions.filter(q => {
              return q.category == cat && q.wasCorrectResponse;
           }).length
         : this.questions.filter(q => {
              return q.wasCorrectResponse;
           }).length;
   },
   getShuffledArray: function(array) {
      return array.sort((a, b) => {
         return 0.5 - Math.random();
      });
   }
};
