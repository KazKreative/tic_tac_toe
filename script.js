var myElement = document.querySelector("#gameBoard");
myElement.style.backgroundColor = "#D93600";

$(document).ready(function()
{
  $("table#gameBoard tr:even").css("background-color", "beige");
  $("table#gameBoard tr:odd").css("background-color", "beige");
});

var gameStatus = document.getElementById("gameStatus");

var r0c0 = document.getElementById("row-0-column-0");
var r0c1 = document.getElementById("row-0-column-1");
var r0c2 = document.getElementById("row-0-column-2");

var r1c0 = document.getElementById("row-1-column-0");
var r1c1 = document.getElementById("row-1-column-1");
var r1c2 = document.getElementById("row-1-column-2");

var r2c0 = document.getElementById("row-2-column-0");
var r2c1 = document.getElementById("row-2-column-1");
var r2c2 = document.getElementById("row-2-column-2");

document.getElementById("playButton").addEventListener("click", function(event) {
	document.getElementById("playButton").style.display = 'none';
	gameStatus.innerHTML = "PLAYER 1";

	document.getElementById("gameBoard").addEventListener("click", function(event) {
		if (event.target.innerHTML == "") {
			if (gameStatus.innerHTML == "PLAYER 1") {
				event.target.innerHTML = "X";
				gameStatus.innerHTML = "PLAYER 2";
			} else {
				event.target.innerHTML = "O";
	   			gameStatus.innerHTML = "PLAYER 1";
			}

   			if(playerHasWon("O")){
   				alert("player O wins!");
   			};
   			if (playerHasWon("X")){
   				alert("player X wins!");
   			};
		}
	})

})

function playerHasWon(letter) {
	if (completeRow(r0c0, r0c1, r0c2, letter)){
	
	 	return true;
	}
	if (completeRow(r1c0, r1c1, r1c2, letter)){
	 	return true;
	}
	if (completeRow(r2c0, r2c1, r2c2, letter)){
	 	return true;
	}
	if (completeRow(r0c0, r1c0, r2c0, letter)){
	 	return true;	
	}
	if (completeRow(r0c1, r1c1, r2c1, letter)){
	 	return true;
	}
	if (completeRow(r0c2, r1c2, r2c2, letter)){
	 	return true;
	}
	return false;
}

function completeRow (cell1, cell2, cell3, letter) {
	return (cell1.innerHTML == letter && cell2.innerHTML == letter && cell3.innerHTML == letter)
}

function BoardChecker() {
  	this.rows = [[],[],[]];








