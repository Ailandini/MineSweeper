$(document).ready(function(){
	var minecounter = 60;  //variable that displays remaining number of mines
	var tilecounter = 450;  //variable that keeps track of the remaining tiles
	var begun = false;  //boolean for starting Timer 
	var Timer;  //Object for score board time counter
	var newTime = "001"; //value of score board time counter


	//Following algorithm develops a 30 x 15 matrix of mines, numbers, and blanks
	//The algorithm generates random numbers and checks if they are less than
	//the fraction determined by mine/tiles. As the randoms occur below the ratio
	//a mine is added to the row and both mine and tiles are decreased. If the random
	//is above mine/tiles then only tiles is decreased. This ensures that the initiated
	//value of mine is the number of mines in the matrix.
	//Afterward, it loops through the generated matrix looking for "m"s and adding 1 to 
	//every adjacent matrix position (adjacent defined by MineSweeper rules).

	//Instantiate related variables
	var i = 450;
	var matrix = new Array();

	var mine = minecounter;
	var tiles = 450;
	var row = new Array();
	//Loop 450 times (30x15)
	while(i >= 0){
		//When a row has 30 items, add it to the matrix
		if(i % 30 == 0 && i != 450){
		 
			matrix.push(row); 
			    
			var row = new Array();
		}
		//generate random and compare to current ratio
		if(Math.random() < (mine/tiles)){
			row.push("m"); //"m" is the placeholder for mines.
			mine--;
			tiles--;
		}
		else{
			row.push(0); //0 is the placeholder for nonmine
			tiles--;
		}
		i--;
	}

	//loop through and set number spaces

	//loop through rows and cols
	for(j=0;j<matrix.length;j++){
		for(k=0;k<matrix[j].length;k++){
			//check if position contains a mine
			if(matrix[j][k] == "m"){
				//if so, verify the adjacent spaces are /in/ the matrix. And if
				//so add 1 to those adjacent spaces.

				//check left and right spaces
				if(k+1 < matrix[j].length && matrix[j][k+1] != "m"){
			    	matrix[j][k+1] = matrix[j][k+1]+1;
			    }
		    	if(k-1 >= 0 && matrix[j][k-1] != "m"){
		      		matrix[j][k-1] = matrix[j][k-1]+1;
		      	}
			     
			    //check all adjacent spaces below the mine 
		      	if(j+1 < matrix.length){
			      	if(matrix[j+1][k]!="m"){
			        	matrix[j+1][k] = matrix[j+1][k]+1;
			       	}
		        	if(k-1 >= 0 && matrix[j+1][k-1] != "m"){
		       			matrix[j+1][k-1] = matrix[j+1][k-1]+1; 
		       		}
		        	if(k+1 < matrix[j].length && matrix[j+1][k+1] != "m"){
		        		matrix[j+1][k+1] = matrix[j+1][k+1]+1;
		        	}
				}
			    
			    //check all adjacent spaces above the mine
		     	if(j-1 >=0){
			      if(matrix[j-1][k] !="m"){
			        	matrix[j-1][k] = matrix[j-1][k]+1;
			        }
			        if(k+1 < matrix[j].length && matrix[j-1][k+1]!= "m"){
			        	matrix[j-1][k+1] = matrix[j-1][k+1]+1;
			        }
			        if(k-1 >= 0 && matrix[j-1][k-1]!="m"){
			        	matrix[j-1][k-1] = matrix[j-1][k-1]+1;
			        }
		      	}
	    	}
	  	}
	}



	//now that the matrix is set, generate 450 spaces and tiles on the board. 
	//Both the spaces and tiles are instatiated as buttons. This was to leave open
	//the possibility of clicking number spaces to reveal other tiles (a feature of 
	//Microsoft's MineSweeper that was left out of this implementation).
	//This set of functions also importantly sets the name attribute on the buttons to
	//their given matrix position, making them identifiable. 
	//30 x 15
	var i = 30*15;
	var row = 0;
	var col = 0;
	//while looping to prevent a second O(n^2);
	while(i > 0){
		if(i % 30 == 0 && i!= 450){
			row++;
			col = 0;
		}
		//lay mine specific spaces
		if(matrix[row][col] == "m"){
			$('.spaces').append("<input type='image' name='"+row+":"+col+"' class='onespace' src='Images/mine.png' style='height: 26.5px; width:26.5px; box-sizing: border-box'></input>");

		}
		//lay all blank spaces
		else if(matrix[row][col] == 0){
			$('.spaces').append("<button name="+row+":"+col+" class='onespace' style='height: 26.5px; width:26.5px'></button>");

		}
		else{
			//lay number spaces
			var color; //for aesthetic purposes, different numbers contain different colors (As seen in MS MineSweeper).
			if(matrix[row][col] == 1){
				color = "blue";
			}
			else if(matrix[row][col] == 2){
				color = "green";
			}
			else if(matrix[row][col] == 3){
				color = "red";
			}
			else{
				color = "purple";
			}
			$('.spaces').append("<button name="+row+":"+col+" class='onespace' style='height: 26.5px; width:26.5px; font-size: medium; font-weight: bold; color:"+color+"'>" + matrix[row][col]+"</button>");
		}
		//all tiles are identicle, they are laid here.
		$('.tiles').append("<button name="+row+":"+col+" class='onetile' style='height: 26.5px; width:26.5px'> </button>");
		i--;
		col++;
	}


	//Function that resets game when the smiling icon is pressed
	$('.restart').click(function(){
		location.reload();
	});

	//Function that denotes Timer behavior. The Timer is a three digit counter.
	//the counter only begins once the user has left clicked a tile and only ends if
	//it reaches "999", the user loses, or the user wins.
	function startCounting(){
		//Display the current time.
		$('.mineTime').text(newTime);
		//stop the timer if it runs for 16.5 minutes
		if(newTime == "999"){
			clearInterval(Timer);
		}
		//The below if logic sets 9s to 1s in order to continue timer increase
		if(newTime.charAt(2) == "9"){
			if(newTime.charAt(1) == "9"){
				newTime = (parseInt(newTime.charAt(0))+1) + "00";
			}
			else{
				newTime = newTime.charAt(0) + (parseInt(newTime.charAt(1))+1) + "0";
			}
		}
		else{
			newTime = newTime.charAt(0) + newTime.charAt(1) + (parseInt(newTime.charAt(2))+1);
		}
		

	}



	//Below function controls tile manipulation on left click. Most importantly 
	//triggering the reveal of adjacent blank spaces when pressed.
	$('.onetile').click(function(){
		
		if(!begun){ //if the Timer hasn't started, start it
			begun = true;
			Timer = setInterval(startCounting, 1000); //set function for Timer and repeat every second.
		}
		
		//if the tile contains an image, it is a flag and cannot be clicked. Although the tile is being "clicked"
		//the resulting logic (removing the tile and checking the space) is omitted, simulated no click.
		if($(this).css("background-image") != 'none'){
		}
		//if the space contains an image (it will only ever be mine.png) make it invisible
		//and unclickable (as the only clicking we want is the space below it).
		else{
			tilecounter--; //a tile has been removed
			$(this).css("opacity", "0.0");
			$(this).css("pointer-events","none"); //allows ability to click through element
			var space = $('.onespace[name="'+$(this).attr("name")+'"]'); //identify space below tile by tile name (they will be equal).
			//if that space is blank (does not contain any number nor is a mine) then click the space button.
			if(space.text() == "" && space.attr("src") != "Images/mine.png"){
				space.click();
			}
			if(tilecounter == 60 && minecounter == 0){
				GameEnder(true);
			}
			//if the space below the clicked tile is a mine. The game ends and we display the lose screen as well as the sad face.
			if(space.attr("src") == "Images/mine.png"){
				$('.restart').attr("src", "Images/sad.png");
				//loops through and exposes all remaining mines
				for(var i=0; i < matrix.length; i++){
					for(var j=0; j < matrix[0].length; j++){
						if(matrix[i][j] == 'm'){
							var minelocate = i+":"+j;
							$('.onetile[name="'+minelocate+'"]').css("opacity", "0.0");
						}
					}
				}
				GameEnder(false);
			}
		}
	});


	//disable rightclick on spaces
	$('.onespace').bind("contextmenu", function(e){return false;});

	//Function places flag image on tiles when right clicked and updates mine counter display.
	//if the mine counter reads 0 and all other tiles have been removed, the game ends in success.
	$('.onetile').bind("contextmenu", function(e){
		//if there is a flag, remove it and increase counter.
		if($(this).hasClass('flag')){
			minecounter++;
			$('.mineScore').text(minecounter);
			$(this).removeClass('flag');
		}
		//otherwise do the opposite
		else{
			minecounter--;
			$('.mineScore').text(minecounter);
			$(this).addClass('flag');
			//end the game if only mine tiles remain
			if(tilecounter == 60 && minecounter == 0){
				GameEnder(true);
			}
		}
		//do not reveal the context menu if right clicking a tile
		return false;
		
	});
		
 

	

	//This function would have handled all space clicking functionality.
	//As is, the only space click with functionality is blank space.
	$('.onespace').click(function(){
		//check that the space is blank.
		if($(this).text() == ""){
			var name = $(this).attr("name"); //grab the location
			var indices = name.split(":");	//locations are stored as row:col so they must be split
			var row = parseInt(indices[0]); //grab row val
			var col = parseInt(indices[1]); //grab col val
			var nuname; //this function works recursively with tile click, this represents the new tile to be clicked
			var tile;
			//below we check that each new tile possibility is not yet clicked (opacity > 0) to avoid infinite loop

			//check right tile
			if(col+1 < matrix[row].length){
				nuname = row+":"+(col+1);
				tile = $('.onetile[name="'+nuname+'"]');
				if(tile.css("opacity")!= 0.0){
					tile.click();
					$('.onespace[name="'+nuname+'"]').click();
				}
			}
			//check left tile
			if(col-1 >= 0){
				nuname = row+":"+(col-1);
				tile = $('.onetile[name="'+nuname+'"]');
				if(tile.css("opacity")!= 0.0){
					console.log("check left");
					tile.click();
					$('.onespace[name="'+nuname+'"]').click();
				}
			}
			//check adjacent bottom tiles
			if(row+1 < matrix.length){
				//check bottom tile
				nuname = (row+1) +":"+col;
				tile = $('.onetile[name="'+nuname+'"]');
				if(tile.css("opacity")!= 0.0){
					tile.click();
					$('.onespace[name="'+nuname+'"]').click();
				}
				
				//check bottom right tile
				if(col+1 < matrix[row].length){
					nuname = (row+1) +":"+(col+1);
					tile = $('.onetile[name="'+nuname+'"]');
					if(tile.css("opacity")!= 0.0){
						tile.click();
						$('.onespace[name="'+nuname+'"]').click();
					}
				}
				//check bottom left tile
				if(col-1 >=0){
					nuname = (row+1) +":"+(col-1);
					tile = $('.onetile[name="'+nuname+'"]');
					if(tile.css("opacity")!= 0.0){
						tile.click();
						$('.onespace[name="'+nuname+'"]').click();
					}
				}
			}

			//check adjacent top tiles
			if(row-1 >= 0){
				//check top tile
				nuname = (row-1) +":"+col;
				tile = $('.onetile[name="'+nuname+'"]');
				if(tile.css("opacity")!= 0.0){
					console.log("check top");
					tile.click();
					$('.onespace[name="'+nuname+'"]').click();
				}
				
			
				//check top right tile
				if(col+1 < matrix[row].length){
					nuname = (row-1) +":"+(col+1);
					tile = $('.onetile[name="'+nuname+'"]');
					if(tile.css("opacity")!= 0.0){

						tile.click();
						$('.onespace[name="'+nuname+'"]').click();
					}
				}
			
				//check top left tile
				if(col-1 >= 0){
					nuname = (row-1) +":"+(col-1);
					tile = $('.onetile[name="'+nuname+'"]');
					if(tile.css("opacity")!= 0.0){
						tile.click();
						$('.onespace[name="'+nuname+'"]').click();
					}
				}
			}
		}

	});

	//function adds End Game screen over play field based on loss or victory
	function GameEnder(winlose){
		$('.tiles').after("<div class='EndGame'></div>");
		
		if(winlose){
			$('.EndGame').text("YOU WIN");
		}
		else{
			$('.EndGame').text("YOU LOSE");
		}
		clearInterval(Timer);
	}
      //Function that displays help menu beside score and playfield.
      //Help menu is invisible on page load. 
      //Function also disables help button on main page to avoid redundancy         
      $(".helpButton").click(function(){
         $(".helpWindow").css("opacity", "1.0");
         $(".this").attr("disabled", true);
    });
      //when the close button is pressed, remove the help screen and reenable the help button
      $(".close").click(function(){
        $(".helpButton").attr("disabled", false);
        $(".helpWindow").css("opacity", "0.0");
    });

	

});

//underneath the playfield is the prototype canvas drawn with lines.
//The canvas board was left in the final product to help blend the gaps that exist between
//space buttons.
var drawTiles = function(){

	//mc is the canvas id. standing for myCanvas
	var c = document.getElementById('mc');
	var ctx = c.getContext("2d");
	var i = 9;
	//draw verticle lines
	while(i < 300){
		ctx.beginPath();
		ctx.lineWidth=1;
		ctx.strokeStyle = "#666666";
		ctx.moveTo(i+0.5,0);
		ctx.lineTo(i+0.5,500.5);
		ctx.stroke();
		ctx.closePath();
		i+=10;
	}
	//draw horizontal lines
	i = 9;
	while(i < 150){
		ctx.beginPath();
		ctx.moveTo(0,i+0.5);
		ctx.lineTo(750.5, i+0.5);
		ctx.stroke();
		ctx.closePath();
		i+=10;
	}
}
