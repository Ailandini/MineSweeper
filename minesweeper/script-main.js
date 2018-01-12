$(document).ready(function(){

	$(".helpWindow").hide();




	var minecounter = 60;
	var tilecounter = 450;
	var begun = false;
	var Timer;
	var newTime = "001";

	var i = 450;
	var matrix = new Array();

	var mine = 60;
	var tiles = 450;
	var count = 0;
	var row = new Array();
	while(i >= 0){
		if(i % 30 == 0 && i != 450){
		 
			matrix.push(row); 
			    
			var row = new Array();
		}
		if(Math.random() < (mine/tiles)){
			row.push("m");
			count++;
			mine--;
			tiles--;
		}
		else{
			row.push(0);
			tiles--;
		}
		i--;
	}

	for(j=0;j<matrix.length;j++){
		for(k=0;k<matrix[j].length;k++){
			if(matrix[j][k] == "m"){
				if(k+1 < matrix[j].length && matrix[j][k+1] != "m"){
			    	matrix[j][k+1] = matrix[j][k+1]+1;
			    }
		    	if(k-1 >= 0 && matrix[j][k-1] != "m"){
		      		matrix[j][k-1] = matrix[j][k-1]+1;
		      	}
			      
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




	//30 x 15
	var i = 30*15;
	var row = 0;
	var col = 0;
	while(i > 0){
		if(i % 30 == 0 && i!= 450){
			row++;
			col = 0;
		}
		if(matrix[row][col] == "m"){
			$('.spaces').append("<input type='image' name='"+row+":"+col+"' class='onespace' src='Images/mine.png' style='height: 26.5px; width:26.5px; box-sizing: border-box'></input>");

		}
		else if(matrix[row][col] == 0){
			$('.spaces').append("<button name="+row+":"+col+" class='onespace' style='height: 26.5px; width:26.5px'></button>");

		}
		else{
			var color;
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

		$('.tiles').append("<button name="+row+":"+col+" class='onetile' style='height: 26.5px; width:26.5px'> </button>");
		i--;
		col++;
	}

	$('.restart').click(function(){
		location.reload();
	});

	
	function startCounting(){
		$('.mineTime').text(newTime);
		if(newTime == "999"){
			clearInterval(Timer);
		}
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




	$('.onetile').click(function(){
		tilecounter--;
		if(!begun){
			begun = true;
			Timer = setInterval(startCounting, 1000);
		}
		
		if($(this).css("background-image") != 'none'){
		}
		else{
			$(this).css("opacity", "0.0");
			$(this).css("pointer-events","none");
			var space = $('.onespace[name="'+$(this).attr("name")+'"]');
			if(space.text() == "" && space.attr("src") != "Images/mine.png"){
				space.click();
			}
			if(space.attr("src") == "Images/mine.png"){
				$('.restart').attr("src", "Images/sad.png");
				GameEnder(false);
			}
		}
	});


	$('.onetile').bind("contextmenu", function(e){
		
		if($(this).hasClass('flag')){
			minecounter++;
			$('.mineScore').text(minecounter);
			$(this).removeClass('flag');
		}
		else{
			
			minecounter--;
			$('.mineScore').text(minecounter);
			$(this).addClass('flag');
			if(tilecounter == 60 && minecounter == 0){
				GameEnder(true);
			}
		}
		
		return false;
		
	});
		
 

	


	$('.onespace').click(function(){
		if($(this).text() == ""){
			var name = $(this).attr("name");
			var indices = name.split(":");
			var row = parseInt(indices[0]);
			var col = parseInt(indices[1]);
			var nuname;
			var tile;
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
			//check bottom tiles
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

			//check top tiles
			if(row-1 >= 0){
				//check top tile
				
				nuname = (row-1) +":"+col;
				tile = $('.onetile[name="'+nuname+'"]');
				if(tile.css("opacity")!= 0.0){
					console.log("check top");
					tile.click();
					$('.onespace[name="'+nuname+'"]').click();
				}
				
			
				//check top left tile
				if(col+1 < matrix[row].length){
					nuname = (row-1) +":"+(col-1);
					tile = $('.onetile[name="'+nuname+'"]');
					if(tile.css("opacity")!= 0.0){

						tile.click();
						$('.onespace[name="'+nuname+'"]').click();
					}
				}
			
				//check top right tile
				if(col-1 >= 0){
					nuname = (row-1) +":"+(col+1);
					tile = $('.onetile[name="'+nuname+'"]');
					if(tile.css("opacity")!= 0.0){
						tile.click();
						$('.onespace[name="'+nuname+'"]').click();
					}
				}
			}
		}

	});

		
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


	

	$(".helpButton").click(function(){
		$(".container").before("<div class='helpWindow'><embed src='help-page.html' width='98%' height='100%'></div>");
		$(this).attr("disabled", true);
	});

	$(".close").click(function(){
		
		$(".helpButton").attr("disabled",false);
		$(".helpWindow").remove();
		$(this).remove();
	});

	function helpToggle(){
		alert("Button");
	}
	
	window.onresize = function(){
		this.resizeTo(765,570);
	};

	

});


var openWin = function(){
	var myWindow = window.open("help-page.html, width=150px, height=150px");
}

var drawTiles = function(){

	var c = document.getElementById('mc');
	var ctx = c.getContext("2d");
	var i = 9;
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