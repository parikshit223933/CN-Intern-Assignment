import { Component } from '@angular/core';

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
    arr = []
    grid = [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]]
    constructor() {
        // console.table(this.grid);
        this.addNumber();
        this.addNumber();
        // console.table(this.grid);
        document.addEventListener('keydown', (event) => {
            //Here i have to declare key bindings.
            //d=68
            //w=87
            //a=65
            //s=83



            if(event.keyCode==87)
            {
                this.grid = this.rotate(this.grid);
                this.grid = this.flip(this.grid);
                this.run();
                this.grid = this.flip(this.grid);
                this.grid = this.rotate(this.grid);
                this.reflectChanges();
                
            }
            if (event.keyCode == 83) {
                this.grid = this.rotate(this.grid);
                this.run();
                this.grid = this.rotate(this.grid);
                this.reflectChanges();
            }
            if (event.keyCode == 65) {
                this.grid = this.flip(this.grid);
                /* this.run();
                this.flip(this.grid); */
                this.run();
                this.grid = this.flip(this.grid);
                this.reflectChanges();
            }
            if (event.keyCode == 68) {
                this.run();
                this.reflectChanges();

            }

        })
        this.reflectChanges();
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

    flip = (array) => {
        for (let i = 0; i < 4; i++) {
            array[i].reverse();
        }
        return array;
    }
    run = () => {
        for (let i = 0; i < 4; i++) {
            this.grid[i] = this.operate(this.grid[i]);
        }
        this.addNumber();
    }
    operate = (row) => {
        row = this.slide(row);
        row = this.combiner(row);
        row = this.slide(row);
        return row;
    }
    reflectChanges = () => {
        this.arr = [];
        for (let row of this.grid) {
            for (let elem of row) {
                this.arr.push({ number: elem });
            }
        }
    }
    slide = (row) => {
        let newRow = row.filter(value => value);
        let missing = 4 - newRow.length;
        let zeros = Array(missing).fill(0);
        for (let i of newRow) {
            zeros.push(i);
        }
        return zeros;
    }
    combiner = (row) => {
        for (let i = 3; i >= 0; i--) {
            let a = row[i];
            let b = row[i - 1];
            if (a == b) {
                row[i] += row[i - 1];
                row[i - 1] = 0
            }
        }
        return row;
    }
    addNumber = () => {
        let options = [];
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
