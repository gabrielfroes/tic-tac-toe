const core = {
    worker: undefined,
    canvas: null,
    context: null,
    game: null,
    mouse: {
        position: { x: 0, y: 0 },
        click: false
    },

    initialize: function (game, canvas) {
        if (typeof (Worker) !== "undefined") {
            if (typeof (this.worker) == "undefined") {
                this.game = game;
                this.canvas = document.querySelector(canvas);
                this.context = this.canvas.getContext("2d");
                this.registerEvents();
                this.worker = new Worker("js/worker.js");
                this.worker.postMessage("initialize");
                this.worker.onmessage = function (event) {
                    if (event.data == "render") {
                        core.render();
                    }
                };
            } else {
                console.log("Sorry, your browser does not support Web Workers...");
            }
        }
    },

    registerEvents: function () {
        this.canvas.addEventListener('mousemove', function (e) {
            core.mouse.position.x = e.offsetX;
            core.mouse.position.y = e.offsetY;
        }, false);
        this.canvas.addEventListener('mousedown', function (e) {
            if (core.checkClickInsideSpace()) {
                core.mouse.click = true;
            }
        });
    },

    render: function () {
        console.log("Rendering...");
        //define constants used in draw functions
        const margin = 10;
        const spaceWidth = this.context.canvas.width / 3;
        const spaceHeight = this.context.canvas.height / 3;
        //redraw canvas
        this.erase();
        this.drawGrid(margin, spaceWidth, spaceHeight);
        this.drawSpaces(margin, spaceWidth, spaceHeight);
        this.drawLineWinner(margin, spaceWidth, spaceHeight);
    },

    erase: function () {
        //clear canvas
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    },

    drawGrid: function (margin, spaceWidth, spaceHeight) {
        //define grid style
        this.context.strokeStyle = "#2c3e50";
        this.context.lineJoin = "round";
        this.context.lineWidth = 5;
        //start draw grid
        this.context.beginPath();
        //draw vertical lines
        for (let i = 1; i <= 2; i++) {
            this.context.moveTo(spaceWidth * i, margin);
            this.context.lineTo(spaceWidth * i, this.context.canvas.height - margin);
        }
        //draw horizontal lines
        for (let i = 1; i <= 2; i++) {
            this.context.moveTo(margin, spaceHeight * i);
            this.context.lineTo(this.context.canvas.width - margin, spaceHeight * i);
        }
        this.context.closePath();
        //end draw grid
        //print line        
        this.context.stroke();
    },

    drawSpaces: function (margin, spaceWidth, spaceHeight) {
        //define contsnts
        const round = 10;
        const fontSize = 120;
        //define util vars
        let pos = 0;

        //define context style properties
        this.context.font = fontSize + "px Arial";
        //render all spaces
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                let x1 = this.calcStartRectX(i, spaceWidth, margin);
                let y1 = this.calcStartRectY(j, spaceHeight, margin)
                let x2 = this.calcEndRectX(spaceWidth, margin);
                let y2 = this.calcEndRectY(spaceHeight, margin);
                //check if is gameover
                if (!this.game.isGameover()) {
                    //check if mouse is over space
                    let hoveredPos = this.pointIntersectRect(
                        this.mouse.position.x,
                        this.mouse.position.y,
                        x1, y1, x2, y2
                    );
                    this.context.fillStyle = hoveredPos ? this.game.getBoardPosition(pos) === '' ? "#8977CC" : "#2c3e50" : "transparent";
                    this.fillRoundRect(x1, y1, x2, y2, round);
                    //check if mouse is hover space and clicked
                    if (hoveredPos == true && this.mouse.click == true) {
                        this.mouse.click = false;
                        this.game.executeMakePlay(pos);
                    }
                }
                this.context.fillStyle = "#ffffff";
                //draw text symbol to space
                this.context.fillText(
                    this.game.getBoardPosition(pos),
                    x1 + (spaceWidth / 2) - (fontSize / 2) + 6,//add 6 to fix left text position
                    y1 + (spaceHeight / 2) + (fontSize / 4)
                );
                pos++;
            }
        }
    },

    drawLineWinner: function (margin, spaceWidth, spaceHeight) {
        if (this.game.isGameover()) {
            const lineWidth = 14;
            this.context.strokeStyle = "#8977CC";
            this.context.lineJoin = "round";
            this.context.lineWidth = lineWidth;
            this.context.beginPath();
            let pos = 0;
            for (i = 0; i < 3; i++) {
                for (j = 0; j < 3; j++) {
                    let x1 = this.calcStartRectX(i, spaceWidth, margin);
                    let y1 = this.calcStartRectY(j, spaceHeight, margin)
                    if (this.game.getWinnerSequence()[0] == pos) {
                        this.context.moveTo(
                            x1 + (spaceWidth / 2) - (lineWidth / 2),
                            y1 + (spaceHeight / 2) - (lineWidth / 2)
                        );
                    } else if (this.game.getWinnerSequence()[2] == pos) {
                        this.context.lineTo(
                            x1 + (spaceWidth / 2) - (lineWidth / 2),
                            y1 + (spaceHeight / 2) - (lineWidth / 2)
                        );
                    }
                    pos++;
                }
            }
            this.context.closePath();
            this.context.stroke();
        }
    },

    fillRoundRect: function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.context.beginPath();
        this.context.moveTo(x + r, y);
        this.context.arcTo(x + w, y, x + w, y + h, r);
        this.context.arcTo(x + w, y + h, x, y + h, r);
        this.context.arcTo(x, y + h, x, y, r);
        this.context.arcTo(x, y, x + w, y, r);
        this.context.closePath();
        this.context.fill();
    },

    checkClickInsideSpace: function () {
        const margin = 10;
        const spaceWidth = this.context.canvas.width / 3;
        const spaceHeight = this.context.canvas.height / 3;
        for (i = 0; i < 3; i++) {
            for (j = 0; j < 3; j++) {
                if(this.pointIntersectRect(
                    this.mouse.position.x,
                    this.mouse.position.y,
                    this.calcStartRectX(i, spaceWidth, margin),
                    this.calcStartRectY(j, spaceHeight, margin),
                    this.calcEndRectX(spaceWidth, margin),
                    this.calcEndRectY(spaceHeight, margin)
                ) === true){
                    return true;
                }
            }
        }
        return false;
    },

    calcStartRectX: function (pos, width, margin) {
        return (pos * width) + margin;
    },
    calcStartRectY: function (pos, height, margin) {
        return (pos * height) + margin;
    },
    calcEndRectX: function (width, margin) {
        return width - (margin * 2);
    },
    calcEndRectY: function (height, margin) {
        return height - (margin * 2)
    },

    pointIntersectRect: function (x, y, rx, ry, rw, rh) {
        let r = { x1: rx, x2: rx + rw, y1: ry, y2: ry + rh };
        let p = { x: x, y: y };
        return p.x > r.x1 && p.x < r.x2 && p.y > r.y1 && p.y < r.y2;
    }

}