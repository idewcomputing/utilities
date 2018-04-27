//iDEW Trivia Utility Library (Fall 2018) - School of Informatics and Computing, Indiana University (IUPUI)
//dependency on 'tabletop.js' library

var trivia = {
   questions: [],
   categories: [],
   currentQuestion: null,
   currentCategory: null,
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
