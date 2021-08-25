
var grid =[];
var gridMap =[];
var lost = [];

function readFile(fileName){
  var i = 0;
  var position=[];
  var lineReader = require('readline').createInterface({
    
    input: require('fs').createReadStream(fileName)
  });


//We extract the information of the file one line at a time 
  lineReader.on('line', function (line) {

    //The first line is allways the grid 
    if (i==0){
      grid[0]=Number(line.charAt(0));
      grid[1]=Number(line.charAt(2));
      gridMap = startMap(grid);
    }

    if (i % 2 == 1){
      position[0]=Number(line.charAt(0));
      position[1]=Number(line.charAt(2));
      position[2]=line.charAt(4);
    }

    if (i % 2 == 0 && i!=0){
      
      gridMap = martianRobot(grid,position,line,gridMap);
      position.splice(3, 1);
    }
    i=i+1;
  });
return gridMap;}
//Inicialize map
function startMap(grid){

  var gridMap =[];
  for (var j = 0; j < grid[1]+3;j++){
    var row =[];
    for (var i = 0; i < grid[0]+3;i++){
      if(j == 0 || j == grid[1]+2 || i == 0 || i == grid[0]+2){
        row[i]='-';
      }else{
        row[i]=0;
      }
    }
    gridMap[j]=row;
  }
  return gridMap;
}
//Draws the map
function drawMap(gridMap){

  for (var j = (gridMap.length-1); j > -1;j--){
    var row ='';
    for (var i = 0; i < gridMap[0].length;i++){
      row = row.concat('  ',gridMap[j][i]) ;
    }
    console.log(row);
  }

}

function turnRL(turn, oldDirection) {
  var newDirection = oldDirection;
  switch (turn) {

    case "R":
      //We use mod 4 because we only have 4 possible values (N,E,S,W)
      newDirection = (newDirection+1)%4;
      return newDirection;

    case "L":
      newDirection = (newDirection-1)%4;
      if (newDirection == -1) newDirection = 3;
      return newDirection;
  }
}

function martianRobot(grid, position, script,gridMap) {


  // We equate the orientations with their position in the string orientations to get a number
  const orientations = 'NESW';
  position[2] = orientations.indexOf(position[2]);

  for (var i = 0; i < script.length; i++) {
    //We add a unit of time to the gridMap in the position of the robot 
     gridMap[position[1]+1][position[0]+1]++;
    // Check if the current position exists in the lost array
    var includesIn = lost.includes(position.toString());
    // If the movement is not Forward, we calculate the new position
    if (script[i] != 'F') {
      position[2] = turnRL(script[i], position[2]);
      // If the position is in lost, we ignore the next forward movement
    } else if (includesIn) {
      continue;
    } else {
      // We check if we fall out of the grid
      if(position[2] == 0 && position[1] + 1 > grid[1]){
        gridMap[position[1] + 2][position[0] + 1]='X';
        lost.push(position.toString());
        position.push("LOST");
        break;
      }
      if(position[2] == 1 && position[0] + 1 > grid[0]){
        gridMap[position[1] + 1][position[0]+2]='X';
        lost.push(position.toString());
        position.push("LOST");
        break;
      }
      if(position[2] == 2 && position[1] - 1 < 0){
        gridMap[position[1]][position[0]+1]='X';
        lost.push(position.toString());
        position.push("LOST");
        break;
      }
      if(position[2] == 3 && position[0] - 1 < 0){
        gridMap[position[1]+1][position[0]]='X';
        lost.push(position.toString());
        position.push("LOST");
        break;
      }
      //Move Forward
      switch (position[2]) {
        // North
        case 0:
          position[1]++;
          continue;
        // East
        case 1:
          position[0]++;
          continue;
        // South
        case 2:
          position[1]--;
          continue;
        // West
        case 3:
          position[0]--;
      }
    }
  }
  // Revert orientation back
  position[2] = orientations[position[2]];
  console.log(position);
  return gridMap;
}

//Test the files one at a time

gridMap=readFile('input1.txt');

//gridMap= readFile('input2.txt');

//The timeout is needed to give time to read the file
setTimeout(() => { drawMap(gridMap); }, 500);
