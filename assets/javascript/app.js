var app = {
  new: function() {
    this.bindAnswersClick();
    this.reset();
  },

  bindAnswersClick: function() {
    $(document).on("click", ".answer", function(e) {
      var answerId = $(this).data("id");
      var correctAnswerId =
        app.questions[app.currentQuestionIndex].correctAnswerId;
      if (answerId === correctAnswerId) {
        app.displayAnswer("right");
      } else {
        app.displayAnswer("wrong");
      }
    });
  },

  reset: function() {
    this.questionStats = {
      right: 0,
      timeout: 0,
      wrong: 0
    };

    this.setQuestions();
    this.displayCurrentQuestion();
  },

  setQuestions: function() {
    this.questions = questions;
    this.currentQuestionIndex = 0;
  },

  displayCurrentQuestion: function() {
    var currentQuestion = this.questions[this.currentQuestionIndex];
    $("#question").text(currentQuestion.question);

    $(".answer").remove();

    $.each(currentQuestion.answers, function(index, element) {
      var answer = $("<div>")
        .addClass("answer")
        .text(element.answer)
        .data("id", element.id);
      $("#answers").append(answer);
    });

    this.setCountDown();
  },

  displayAnswer: function(event) {
    clearInterval(this.countdownInterval);

    this.questionStats[event]++;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex === this.questions.length) {
      alert("Game over");
      console.log(this.questionStats);
    } else {
      this.displayCurrentQuestion();
    }
  },

  setCountDown: function() {
    var seconds = 3;
    this.countdownInterval = setInterval(function() {
      if (seconds > 0) {
        $("#time-remaining").text(seconds--);
      } else {
        app.displayAnswer("timeout");
      }
    }, 1000);
  }
};

app.new();
