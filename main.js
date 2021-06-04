function init(){
    CANVAS_SIZE = window.innerHeight -10 //setup canvas
    document.getElementById("screen").height = CANVAS_SIZE
    document.getElementById("screen").width = CANVAS_SIZE
    ctx = document.getElementById("screen").getContext("2d")
    ctx.fillStyle = "black"
    ctx.lineWidth = CANVAS_SIZE/100
    turn = "x" //whether X or O is playing this turn
    $("#screen").click(function(event){main(event)}) //run the main function when the canvas is click
    inMenu = true
    whoGoesFirst = "x" //changes every round
    clear_grid()
    popup.confirm("Player Count", "how many players do you want?", "one", "two", 
    function(){ //if the player chooses one
        ai = true //whether the second player is an ai
        inMenu = false
        popup.alert("", "you are X, you move first.", "start game")
    },
    function(){ //if the player chooses two
        ai = false //whether the second player is an ai
        popup.input("Name", "what is the name of the player who will use Xs?", function(text){
            $("#xName").html(text)
            popup.input("Name", "what is the name of the player who will use Os?", function(text){
                $("#oName").html(text)
                popup.alert("", $("#xName").html()+" will play first","ok")
                inMenu = false
            })
        })
    })
}
function main(event){
    if(!inMenu){
        x = event.pageX - $("#screen").offset().left //get the x pos relitive to the canvas
        y = event.pageY
        gridX = Math.floor(x/(CANVAS_SIZE/3)) // get item in grid that will be changed 
        gridY = Math.floor(y/(CANVAS_SIZE/3))
        if(grid[gridY][gridX] == 0){
            if(turn == "x"){
                ctx.beginPath() //draw an X
                ctx.moveTo(gridX*(CANVAS_SIZE/3),gridY*(CANVAS_SIZE/3)) //move to the top left corner of the sqaure
                ctx.lineTo(gridX*(CANVAS_SIZE/3)+CANVAS_SIZE/3,gridY*(CANVAS_SIZE/3)+CANVAS_SIZE/3)// draw a line to the bottom right corner
                ctx.moveTo(gridX*(CANVAS_SIZE/3)+CANVAS_SIZE/3,gridY*(CANVAS_SIZE/3)) // move to the top right corner
                ctx.lineTo(gridX*(CANVAS_SIZE/3),gridY*(CANVAS_SIZE/3)+CANVAS_SIZE/3) // draw a line to the bottom left corner
                ctx.stroke()
                grid[gridY][gridX] = "x" //record that an x was played where it was
                if(ai && winner(grid) == 0){
                    ai_move()
                }
                if(!ai){
                    turn = "o"
                }
            }else if(!ai){ // if its O turn 
                ctx.beginPath() //draw an O
                ctx.arc(gridX*(CANVAS_SIZE/3)+CANVAS_SIZE/6,gridY*(CANVAS_SIZE/3)+CANVAS_SIZE/6, CANVAS_SIZE/6, 0, 2 * Math.PI);
                ctx.stroke()
                grid[gridY][gridX] = "o" //record that an o was played where it was
                turn = "x"
            }
            winnerCheck = winner(grid)
            if(winnerCheck == "x" || winnerCheck == "o"){
                inMenu = true
                $("#"+winnerCheck+"Score").html(Number($("#"+winnerCheck+"Score").html())+1)
                var message = "The winner is "
                message += $("#"+winnerCheck+"Name").html() //add the winners name
                message += "<br>" 
                message += $("#"+(whoGoesFirst=="x"&&"o"||"x")+"Name").html() //add os name if whoGoesFirst is x and xs name if whoGoesFirst is o
                message += " will start next round"
                popup.alert("WINNER", message, "play again", function(){
                    if(whoGoesFirst == "x"){
                        whoGoesFirst = "o"
                    }else{
                        whoGoesFirst = "x"
                    }
                    clear_grid()
                    if(whoGoesFirst == "o" && ai){
                        ai_move()
                    }else if(whoGoesFirst == "o"){
                        turn = "0"
                    }
                    inMenu = false
                })
            }
            if(winnerCheck == "tie"){
                inMenu = true
                $("#oScore").html(Number($("#oScore").html())+1)
                $("#xScore").html(Number($("#xScore").html())+1)
                var message = "The game is tied"
                message += "<br>" 
                message += $("#"+(whoGoesFirst=="x"&&"o"||"x")+"Name").html() //add os name if whoGoesFirst is x and xs name if whoGoesFirst is o
                message += " will start next round"
                popup.alert("TIE", message, "play again", function(){
                    if(whoGoesFirst == "x"){
                        whoGoesFirst = "o"
                    }else{
                        whoGoesFirst = "x"
                    }
                    clear_grid()
                    if(whoGoesFirst == "o" && ai){
                        ai_move()
                    }
                    inMenu = false
                })
            }
        }
    }
}
function winner(board){ //returns the winner, tie, or 0
    var symbolToCheck = "x"
    for(check=0;check<2;check++){
        if(board[1][1] == symbolToCheck){ //if the center of the grid is the symbol that is being checked
            for(i=0;i<3;i++){ //3 times
                for(n=0;n<3;n++){ //3 time
                    if(board[n][i] == symbolToCheck && board[2-n][2-i] == symbolToCheck && (n,i) != (1,1)){return(symbolToCheck)} //if two of the symbols being checked are oposite return the symbol being checked
                }
            }
        }
        var horizontalLine
        var verticalLine
        for(i = 0; i < 3; i++){ //3 time
            horizontalLine = 0
            verticalLine = 0
            for(n = 0; n < 3; n++){ //3 times
                if(board[i][n] == symbolToCheck){ //if there is the symbol being checked in n position on a horizontal line
                    horizontalLine += 1
                    if(horizontalLine == 3){ // if there are 3 on the same horizontal line
                        return(symbolToCheck) //return the winner
                    }
                }
                if(board[n][i] == symbolToCheck){ //if there is the symbol being checked in n position on a vertical line
                    verticalLine += 1
                    if(verticalLine == 3){ // if there are 3 on the same vertical line
                        return(symbolToCheck) //return the winner
                    }
                }
            }
        }

        symbolToCheck = "o" //now it will check for o instead of x
    }
    for(i=0;i<3;i++){ //3 times
        for(n=0;n<3;n++){ //3 time
            if(board[i][n] == 0){ // if there is a spot that has not been played in
                return(0) //return that no one has won this turn
            }
        }
    }
    return("tie") //if nothing has been returned up to this point return that the game cannot be won
}
function ai_move(){
    var Spaces = []
    var maxScore = 1000000
    var tempGrid //fake grid
    var subTempGrid
    for(c=0;c<3;c++){ //for each colem
        for(r=0;r<3;r++){ //for each row
            if(grid[c][r] == 0){ //if the space is empty
                Spaces.push([c,r,0]) // add it to the list of spaces whith a score of one
                tempGrid = JSON.parse(JSON.stringify(grid)) //make a clone, not referance of grid
                tempGrid[c][r] = "o" //change a sqaure in the fake grid
                if(winner(tempGrid) == "o"){ // if you would win in the fake grid
                    Spaces[Spaces.length-1][2] = 1000 // add enough to that places score that it will always play there
                }
                subTempGrid = JSON.parse(JSON.stringify(tempGrid)) //make a clone, not referance of grid
                for(c2=0;c2<3;c2++){ // for each colem
                    for(r2=0;r2<3;r2++){ //for each row
                        subTempGrid = JSON.parse(JSON.stringify(tempGrid)) //make a clone of the fake grid
                        if(subTempGrid[c2][r2] == 0){ // if the space in the fake grid is empty
                            subTempGrid[c2][r2] = "o" // set the space in the new fake grid to "o"
                            if(winner(subTempGrid) == "o"){ // if you win in this senario
                                Spaces[Spaces.length-1][2] += 150 // add 150 to the score of that tile
                            }
                        }
                    }
                }
                tempGrid = JSON.parse(JSON.stringify(grid)) //make a clone, not referance of grid
                tempGrid[c][r] = "x" //set a sqaure in it to x
                if(winner(tempGrid) == "x"){ // if x wins in this senario
                    Spaces[Spaces.length-1][2] = 500 // increase the score to the point that it will always play here, unless it can win
                }
                subTempGrid = JSON.parse(JSON.stringify(tempGrid)) // make a clone of the clone of grid
                for(c2=0;c2<3;c2++){ //for each colem
                    for(r2=0;r2<3;r2++){ // for each row
                        subTempGrid = JSON.parse(JSON.stringify(tempGrid)) // reset the clone of the grid
                        if(subTempGrid[c2][r2] == 0){ // if the tile is empty
                            subTempGrid[c2][r2] = "x" //set the space in the fake grid to "x"
                            if(winner(subTempGrid) == "x"){  // if x wins in this senario
                                Spaces[Spaces.length-1][2] += 100 // add 100 the the score of this tile
                            }
                        }
                    }
                }
                if(Spaces[Spaces.length-1][2] < maxScore){ //if the score of this tile is more that the previos max score
                    maxScore = Spaces[Spaces.length-1][2] // updtate the max score
                }
            }
        }
    }
    console.log(Spaces) //log the spaces and their scores to console
    Spaces.sort(() => (Math.random() > .5) ? 1 : -1)//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for(i=0;i<Spaces.length;i++){ // for every tile that can be played in
        if(Spaces[i][2] == maxScore){ // if the score of the tile is the highest score of any tile
            console.log(Spaces[i])
            space = Spaces[i] // set the space that will be played in to this space
            break //end the loop
        }
    } 
    ctx.beginPath() //draw an O
    ctx.arc(space[1]*(CANVAS_SIZE/3)+CANVAS_SIZE/6,space[0]*(CANVAS_SIZE/3)+CANVAS_SIZE/6, CANVAS_SIZE/6, 0, 2 * Math.PI);
    ctx.stroke()
    grid[space[0]][space[1]] = "o" //record where the ai played an o

}
function clear_grid(){
    grid = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ]
    ctx.clearRect(0,0,CANVAS_SIZE,CANVAS_SIZE)
    ctx.beginPath()
    for(i = 1; i != 3; i ++){ //draw grid
        ctx.moveTo(0,CANVAS_SIZE/3*i)
        ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE/3*i)
        ctx.moveTo(CANVAS_SIZE/3*i,0)
        ctx.lineTo(CANVAS_SIZE/3*i, CANVAS_SIZE)
    }
    ctx.stroke()
}
function restart(){
    location.reload()
}