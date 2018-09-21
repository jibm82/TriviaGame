var app = {
  sounds: {
    correct: new Audio("assets/sounds/correct.mp3"),
    incorrect: new Audio("assets/sounds/incorrect.wav")
  },
  questionsPerGame: 10,

  new: function() {
    this.bindAnswersClick();
    this.bindPlayClick();
    this.bindSoundControlClick();
  },

  bindAnswersClick: function() {
    $(document).on("click", ".answer", function(e) {
      var answerId = $(this).attr("data-id");

      $(this).removeClass("btn-light");

      if (answerId === app.correctAnswerId) {
        app.playSound(true);
        $(this).addClass("btn-success");
        $("#hexagon-text").text("Correct");
        app.displayAnswer("correct");
      } else {
        app.playSound(false);
        $(this).addClass("btn-danger");
        app.displayAnswer("incorrect");
        $("#hexagon-text").text("You are wrong");
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

  bindPlayClick: function() {
    $("#play-game").click(function() {
      $(this).text("Play again");
      app.reset();
    });
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
    $("#answers").show();
    $("#game-controls, #game-result").hide();

    this.gameStats = {
      correct: 0,
      incorrect: 0,
      timeout: 0
    };

    this.setQuestions();
    this.displayCurrentQuestion();
  },

  setQuestions: function() {
    var questionIndexes = [];
    this.questions = [];
    this.currentQuestionIndex = 0;

    while (questionIndexes.length < this.questionsPerGame) {
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

    this.gameStats[event]++;
    this.currentQuestionIndex++;

    if (event !== "correct") {
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
      app.displayGameResult();
    } else {
      app.displayCurrentQuestion();
    }
  },

  displayGameResult: function() {
    $("#answers").hide();
    $("#game-result, #game-controls").show();
    $(".progress").remove();

    // Set texts
    $("#question").text("Game Over");

    if (this.gameStats.correct > this.gameStats.incorrect + this.gameStats.timeout) {
      $("#hexagon-text").text("You win");
    } else if (this.gameStats.correct < this.gameStats.incorrect + this.gameStats.timeout) {
      $("#hexagon-text").text("You lose");
    } else {
      $("#hexagon-text").text("");
    }

    // Append stats
    $("#game-result").append(this.statBar(this.gameStats.correct, "Correct answers", "bg-success"));
    $("#game-result").append(
      this.statBar(this.gameStats.incorrect, "Incorrect answers", "bg-danger")
    );
    if (this.gameStats.timeout > 0) {
      $("#game-result").append(this.statBar(this.gameStats.timeout, "Timeouts", "bg-info"));
    }
  },

  statPercentage: function(stat) {
    return (stat / this.questions.length) * 100;
  },

  statBar: function(statValue, description, colorClass) {
    var progress = $("<div>", {
      class: "progress"
    });

    var width = this.statPercentage(statValue);

    var progressBar = $("<div>", {
      class: "progress-bar " + colorClass,
      style: "width: " + width + "%",
      role: "progressbar"
    });

    var label = $("<span>").text(description + ": " + statValue);

    return progress.append(progressBar, label);
  },

  setCountDown: function() {
    var seconds = 10;
    this.countdownInterval = setInterval(function() {
      if (seconds > 0) {
        $("#hexagon-text").html("<span>" + seconds-- + "</span>");
      } else {
        app.playSound(false);
        $("#hexagon").addClass("time-up");
        $("#hexagon-text").text("Time's up");
        app.displayAnswer("timeout");
      }
    }, 1000);
  }
};

app.new();
