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
            if (event.key == 'd') {
                for (let i = 0; i < 4; i++) {
                    this.grid[i] = this.slide(this.grid[i]);
                }
                this.reflectChanges();
                this.addNumber();
                this.reflectChanges();
            }

        })

        this.reflectChanges();
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
    combiner=()=>
    {
        
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
