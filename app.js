const fs = require('fs');

console.log("APP STARTED");

// let stream1 = [7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1]
let stream1 = [1,76,38,96,62,41,27,33,4,2,94,15,89,25,66,14,30,0,71,21,48,44,87,73,60,50,77,45,29,18,5,99,65,16,93,95,37,3,52,32,46,80,98,63,92,24,35,55,12,81,51,17,70,78,61,91,54,8,72,40,74,68,75,67,39,64,10,53,9,31,6,7,47,42,90,20,19,36,22,43,58,28,79,86,57,49,83,84,97,11,85,26,69,23,59,82,88,34,56,13];


fs.readFile(`real-boards.txt`, 'utf8', (err, input) => {

    if (err) {
        return console.log(err);
    }

    // Convert text file to boards
    let boards = input.split("\n\n").map( val => {
        if (!( val.length > 0 )) return null;
        let array = new Array(5).fill(0).map(() => new Array(5).fill(0));
        val.split("\n").forEach( (val1, key) => {
            val1 = val1.trim().replace(/ +/gi,",").split(",").forEach( ( val2, key2 ) => {
                array[key][key2] = Number(val2);
            });
        });
        return {
            board: array
        };
    }).filter( val => val != null );

    // Feed the boards with stream1.shift(); 7
    // check for row and column completion - if no completion - get another input - else calculate all boards scores

    let findMatchesInBoard = function( number, board ) {

        // console.log("   ");

        let bingo = false;
        // let rowCheck = [], colCheck = []

        board.forEach( (row, key) => {

            let index = row.indexOf(number); 
            if (index !== -1) {
              row[index] = "+"; 
            }

            // check for row completion
            let rowCheck = row.every( item => item == "+" );

            if (rowCheck) bingo = true;
            
        });

        board.forEach( (row, key) => {

            // check for col completion
            let thisCol = board.map( val => val[key] );
            let colCheck = thisCol.every( item => item == "+" );

            // is this a Bingo
            if (colCheck) bingo = true;

        });

        return {
            board,
            bingo
        };

    };
    
    let calcBoardScore = function( number, board ) {

        let array = [].concat(...board);
        let sum = array.reduce( (total, val, key) => {
            if (val == "+") return total;
            return total += val;
        },0);
        return sum * number;

    };

    stream1.every( (val, key) => {

        let newBoards = boards.map( val2 => findMatchesInBoard( val, val2.board ) );

        // Check if there was a Bingo
        if ( !(newBoards.some( val => val.bingo == true )) ) {
            console.log(val);
            console.log("No bingo");
            console.log("xxxx RUN AGAIN xxxx ");
            console.log(" ");
            console.log(" ");
            return true;
        };

        // There is a Bingo, check if there are many boards or no
        console.log("Bingo!!!");
        console.log("Boards Length :", boards.length);
        
        // Manually test the console if its ok or no
        if (boards.length < 10) {
            console.log(" ");
            console.log("====");

            console.log(val);
            newBoards.forEach( val => {
                console.table( val.board );
                console.log( {bingo: val.bingo} );
            });

            console.log("====");
            console.log(" ");
        };

        // if this is last board calculate score 
        if (boards.length == 1) {
            console.log("Calculate Board Score for this board");
            let score = calcBoardScore( val, boards[0].board );
            console.log({score});
            return false;
        // else delete bingo boards and go through remaining boards for bingo
        } else {
            boards = newBoards.filter( val => val.bingo == false );
            return true;
        };

    });


});
