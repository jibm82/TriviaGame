var app = {
  sounds: {
    correct: new Audio("assets/sounds/correct.mp3"),
    incorrect: new Audio("assets/sounds/incorrect.wav")
  },
  soundEnabled: true,

  new: function() {
    this.bindAnswersClick();
    this.bindSoundControlClick();
    this.reset();
  },

  bindAnswersClick: function() {
    $(document).on("click", ".answer", function(e) {
      var answerId = $(this).attr("data-id");

      $(this).removeClass("btn-light");

      if (answerId === app.correctAnswerId) {
        app.playSound(true);
        $(this).addClass("btn-success");
        app.displayAnswer("right");
      } else {
        app.playSound(false);
        $(this).addClass("btn-danger");
        app.displayAnswer("wrong");
      }
    });
  },

  playSound: function(correctAnswer) {
    if ($("#sound-control").hasClass("active")) {
      if (correctAnswer) {
        app.sounds.correct.play();
      } else {
        app.sounds.incorrect.play();
      }
    }
  },

  bindSoundControlClick: function() {
    $("#sound-control").click(function() {
      $(this).toggleClass("active");

      var oldIconClass = "fa-volume-up";
      var newIconClass = "fa-volume-off";
      var text = "OFF";

      if ($(this).hasClass("active")) {
        oldIconClass = "fa-volume-off";
        newIconClass = "fa-volume-up";
        text = "ON";
      }

      $(this)
        .find("i")
        .removeClass(oldIconClass)
        .addClass(newIconClass);

      $(this)
        .find("span")
        .text(text);
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
    var questionIndexes = [];
    this.questions = [];
    this.currentQuestionIndex = 0;

    while (questionIndexes.length < 10) {
      var randomIndex = Math.floor(Math.random() * questions.length);
      if (!questionIndexes.includes(randomIndex)) {
        questionIndexes.push(randomIndex);
        this.questions.push(questions[randomIndex]);
      }
    }
  },

  displayCurrentQuestion: function() {
    var currentQuestion = this.questions[this.currentQuestionIndex];
    this.correctAnswerId = this.questions[app.currentQuestionIndex].correctAnswerId;

    $("#question").text(currentQuestion.question);
    $("#hexagon").removeClass("time-up");
    $("#time-remaining").text("");

    $(".answer").remove();

    $.each(currentQuestion.answers, function(index, element) {
      var answer = $("<btn>")
        .addClass("btn btn-block btn-light answer")
        .text(element.answer)
        .attr("data-id", element.id);
      $("#answers").append(answer);
    });

    this.setCountDown();
  },

  displayAnswer: function(event) {
    clearInterval(this.countdownInterval);

    this.questionStats[event]++;
    this.currentQuestionIndex++;

    if (event !== "right") {
      this.revealCorrectAnswer();
    }

    setTimeout(app.afterDisplayAnswer, 1500);
  },

  revealCorrectAnswer: function() {
    var correctAnswer = $(".answer[data-id=" + this.correctAnswerId + "]");
    correctAnswer.removeClass("btn-light").addClass("btn-info");
  },

  afterDisplayAnswer: function() {
    if (app.currentQuestionIndex === app.questions.length) {
      alert("Game over");
    } else {
      app.displayCurrentQuestion();
    }
  },

  setCountDown: function() {
    var seconds = 10;
    this.countdownInterval = setInterval(function() {
      if (seconds > 0) {
        $("#hexagon").text(seconds--);
      } else {
        app.playSound(false);
        $("#hexagon").addClass("time-up");
        $("#hexagon").html("Time's<br/>up");
        app.displayAnswer("timeout");
      }
    }, 1000);
  }
};

app.new();
