// TODO It is possible to press relpay last during a sequence being played potentially causing chaos.



// Game Variables
var buttonColors = ["red", "blue", "green", "yellow"];
var gameStarted = false;
var match = 0;
var gamePattern = [];
var level = 1;
var turn = 0;


// Function to record players input and check the result
function listening() {
  $(".btn").click(function() {
    // Grabs the players button press color
    var userChosenColour = (this.id);
    // Checks to see if it matches
    if (userChosenColour === gamePattern[turn]) {
      animatePress(userChosenColour);
      playSound(userChosenColour);
      turn += 1;
      // Checks to see if player has reached the end of the match sequence
      if (turn >= gamePattern.length) {
        matched();
      }
      // if the color is wrong end the game
    } else {
      $(".btn").unbind();
      endGame();
    }
  });
}


// Generate the next color to match in the game
function nextSequence() {

  // Checks to see if player has won the level
  if (match >= 8) {
    winLevel();

  } else {

    // Generate random number between 1 and 4 to pick a color then add to the game pattern array
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);

    $("h1").text("Level " + level);

    // variable to track match sequence
    turn = 0;

    playGamePattern();
    // Locks buttons whilst the sequence is playing
    setTimeout(function() {
      listening();
    }, (800 * gamePattern.length));
  }
}


// Front panel buttons animation and sound
$(".btn-click").click(function() {
  var buttonPressed = $(this).attr("id");
  playSound("btn-click");
  animateButton(buttonPressed);
});


// Replay button actions
$(".replay").click(function() {

  setTimeout(function() {
    playGamePattern();
  }, 500);


  // Ensures user can't tap a button during the replay
  setTimeout(function() {
    turn = 0;
    listening();
  }, (800 * gamePattern.length));
});


// Computer keyboard actions
$("*").keypress(function() {

  // Locks keyboard entry during the game
  if (gameStarted === false) {
    gameStarted = true;

    // Delayed action to give player a smoother game
    setTimeout(function() {
      nextSequence();
    }, 800);
  }
});


// Start button actions
$(".start").click(function() {

  gameStarted = true;
  setTimeout(function() {
    initGame();
    nextSequence();
  }, 800);
});


// Colored button animation function
function animatePress(currentColour) {
  $("#" + currentColour).fadeTo(300, 0.5).fadeTo(300, 1.0);
}


// Front panel button animation funtion
function animateButton(currentColour) {
  $("#" + currentColour).addClass("pressed");

  setTimeout(function() {
    $("#" + currentColour).removeClass("pressed");
  }, 200);
}


// Function to play the sounds
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}


// Play game pattern function
var playGamePattern = function() {
  $(".btn").unbind();
  // Loops through the game pattern array
  gamePattern.forEach(function(color, index) {
    setTimeout(function() {
        $("#" + color).fadeTo(300, 0.5).fadeTo(300, 1.0);
        // Plays a shorter sound as the sequence gets faster
        if (level < 4) {
          playSound(color);
        } else {
          playSound(color + "-short");
        }
      },
      // Speeds up the sequence as the level increases
      (1000 - ((level - 1) * 150)) * index);
  });
};


// Pattern played when player wins a level or the game
var winPattern = function() {
  $(".btn").unbind();

  // Picks a sound depending on the win type
  if (level >= 7) {
    playSound("win-game");
  } else {
    playSound("win-level");
  }

  // Array to hold the win pattern
  var winPattern = ["red", "blue", "yellow", "green"];
  // Loop through the pattern array
  winPattern.forEach(function(color, index) {
    setTimeout(function() {
        $("#" + color).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
      },
      200 * index);
  });
};


// Player wins a level function
var winLevel = function() {
  level += 1;

  // Check to see if player has won the whole game, if the have won play game ending
  if (level >= 7) {

    $("h1").text("You Are THE SIMON MASTER!!!!");
    winPattern();

    setTimeout(function() {
      $("h1").text("Press Any Key To Restart");
      initGame();
      gameStarted = false;
    }, 2000);

    // Display level won and advance to the next level
  } else {
    winPattern();
    $("h1").text("You Won This Level!!");
    setTimeout(function() {
      turn = 0;
      match = 0;
      gamePattern = [];
      nextSequence();
    }, 2000);
  }
};


// Function to track matches in a round
var matched = function() {
  $(".btn").unbind();
  match += 1;

  setTimeout(function() {
    nextSequence();
  }, 2000);
};


// Player loses game function
var endGame = function() {
  gameStarted = false;
  playSound("wrong");

  setTimeout(function() {
    playSound("game-over");
  }, 900);

  $("h1").text("Game Over Man!");
  $("body").addClass("game-over");
  setTimeout(function() {
    $("body").removeClass("game-over");
  }, 300);

  setTimeout(function() {
    $("h1").text("Press Any Key To Restart");
  }, 2000);
  initGame();
};


// Reset game parameters
var initGame = function() {
  match = 0;
  gamePattern = [];
  level = 1;
};
