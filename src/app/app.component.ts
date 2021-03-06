import { Component } from '@angular/core';
import * as Moment from 'moment';
import ZingTouch from 'zingtouch';

function log(target, name, descriptor) {
    console.log(target, name, descriptor);
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    //globals
    arr = [];//this will be rendered by the html
    score: number = 0;//combiner is handling this score
    grid = [//this is for the program to use
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]];
    gameOver: boolean = false;
    scores = [];

    constructor() {
        if (!JSON.parse(localStorage.getItem("scores"))) {
            localStorage.setItem("scores", JSON.stringify(this.scores));
        }
        else {
            this.scores = JSON.parse(localStorage.getItem("scores"));
        }

        this.enableGestureControl();

        // console.table(this.grid);
        this.insertNumber();
        this.insertNumber();
        // console.table(this.grid);
        document.addEventListener('keydown', (event) => {
            //before performing any action i need to check that game is over or not
            if (this.gameOver)//this is just to return the subsequest time when the game is over and player is still pressing some keys. as i dont wnat to show the alert again and again.
            {
                return;
            }
            if (this.isWon()) {
                window.alert('Congrats, You have won the game!');
                this.gameOver = true;
                return;
            }
            if (this.isGameOver())//this is to show the alert the first time when the game is over
            {
                this.gameOver = true;
                window.alert('Game Over!');
                if (this.scores.length == 10) {
                    this.scores.pop();
                }
                this.scores.unshift({ time: Moment().format("ddd, h:mm:ss a"), score: this.score });
                localStorage.setItem("scores", JSON.stringify(this.scores));
                return;
            }
            //Here i have to declare key bindings.
            //d=68
            //w=87
            //a=65
            //s=83
            if (event.keyCode == 87)//moving up
            {
                this.grid = this.rotate(this.grid);
                this.grid = this.flip(this.grid);
                this.run();
                this.grid = this.flip(this.grid);
                this.grid = this.rotate(this.grid);
                this.reflectChanges();
            }
            if (event.keyCode == 83) {//moving down
                this.grid = this.rotate(this.grid);
                this.run();
                this.grid = this.rotate(this.grid);
                this.reflectChanges();
            }
            if (event.keyCode == 65) {//moving left
                this.grid = this.flip(this.grid);
                /* this.run();
                this.flip(this.grid); */
                this.run();
                this.grid = this.flip(this.grid);
                this.reflectChanges();
            }
            if (event.keyCode == 68) {//moving right
                this.run();
                this.reflectChanges();
            }
        })
        this.reflectChanges();

    }
    enableGestureControl = () => {
        setTimeout(() => {
            let containerElement = document.getElementById('center-main');
            let activeRegion = ZingTouch.Region(document.getElementsByClassName('container-fluid')[0]);
            activeRegion.bind(containerElement, 'swipe', (event) => {
                let angle = event.detail.data[0].currentDirection;
                ////////////////////////////////////////////////////////////////////////////////////
                //before performing any action i need to check that game is over or not
                if (this.gameOver)//this is just to return the subsequest time when the game is over and player is still pressing some keys. as i dont wnat to show the alert again and again.
                {
                    return;
                }
                if (this.isWon()) {
                    window.alert('Congrats, You have won the game!');
                    this.gameOver = true;
                    return;
                }
                if (this.isGameOver())//this is to show the alert the first time when the game is over
                {
                    this.gameOver = true;
                    window.alert('Game Over!');
                    if (this.scores.length == 10) {
                        this.scores.pop();
                    }
                    this.scores.unshift({ time: Moment().format("ddd, h:mm:ss a"), score: this.score });
                    localStorage.setItem("scores", JSON.stringify(this.scores));
                    return;
                }
                if (angle >= 45 && angle <= 135)//moving up
                {
                    this.grid = this.rotate(this.grid);
                    this.grid = this.flip(this.grid);
                    this.run();
                    this.grid = this.flip(this.grid);
                    this.grid = this.rotate(this.grid);
                    this.reflectChanges();
                }
                if (angle >= 225 && angle <= 315) {//moving down
                    this.grid = this.rotate(this.grid);
                    this.run();
                    this.grid = this.rotate(this.grid);
                    this.reflectChanges();
                }
                if (angle >= 135 && angle <= 225) {//moving left
                    this.grid = this.flip(this.grid);
                    /* this.run();
                    this.flip(this.grid); */
                    this.run();
                    this.grid = this.flip(this.grid);
                    this.reflectChanges();
                }
                if ((angle <= 45 && angle >= 0) || (angle >= 315 && angle <= 360)) {//moving right
                    this.run();
                    this.reflectChanges();
                }
                ///////////////////////////////////////////////////////////////////////////////////
            });
        }, 500)

        // 
    }
    isWon = () => {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] == 2048) {
                    return true;
                }
            }
        }
        return false;
    }
    isGameOver = () =>//here i have to check if i do not have any adjacent units containing same numbers and the board is full, in that case the game will be over!
    {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] == 0) {
                    return false;
                }
                if (j != 3 && this.grid[i][j] == this.grid[i][j + 1]) {
                    return false;
                }
                if (i != 3 && this.grid[i][j] == this.grid[i + 1][j]) {
                    return false;
                }
            }
        }
        return true;
    }
    restartGame = () => {
        this.score = 0;
        this.gameOver = false;
        this.grid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]];
        this.arr = [];
        this.run();
        this.reflectChanges()
    }
    rotate = (grid) => {//this is actually flippping the grid along the axis which joins north-west and south east. 
        let newGrid = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                newGrid[i][j] = grid[j][i];
            }
        }
        return newGrid;
    }

    flip = (array) => {//flipping the array horizontally
        for (let i = 0; i < 4; i++) {
            array[i].reverse();
        }
        return array;
    }

    run = () => {// operating on the grid i.e. sliding, combining and then sliding again and finally inserting a number in the array
        for (let i = 0; i < 4; i++) {
            this.grid[i] = this.operate(this.grid[i]);
        }
        this.insertNumber();
    }

    operate = (row) => { //to operate
        row = this.slide(row);
        row = this.combiner(row);
        row = this.slide(row);
        return row;
    }

    reflectChanges = () => {//clearing the current array and pushing the new elements in the array
        this.arr = [];
        for (let row of this.grid) {
            for (let elem of row) {
                this.arr.push({ number: elem });
            }
        }
    }

    slide = (row) => {//this will always slide the array to the right
        let newRow = row.filter(value => value);
        let missing = 4 - newRow.length;
        let zeros = Array(missing).fill(0);
        for (let i of newRow) {
            zeros.push(i);
        }
        return zeros;
    }

    combiner = (row) => {//this will combine two adjacent number, here combination means adding
        for (let i = 3; i >= 0; i--) {
            let a = row[i];
            let b = row[i - 1];
            if (a == b) {
                row[i] += row[i - 1];
                //now the score will the a+b, i.e. the summed up score of the two adjacent numbers.
                this.score += row[i]//or we can also write a+b
                row[i - 1] = 0
            }
        }
        return row;
    }

    insertNumber = () => {//this will insert either 2 or 4 in the array at some random place
        let options = [];//this should check for any available empty space in the grid
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] == 0)//this is a valid spot
                {
                    options.push({ x: i, y: j });
                }
            }
        }
        if (options.length > 0) {
            let spot = options[Math.floor(Math.random() * options.length)];
            let r = Math.random();
            this.grid[spot.x][spot.y] = r > 0.5 ? 2 : 4;
        }
    }

}
