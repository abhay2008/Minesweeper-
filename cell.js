class Cell {
  constructor(i, j, w, h) {
    this.i = i;
    this.j = j;
    this.w = w;
    this.h = h;
    this.x = this.i * this.w;
    this.y = this.j * this.h;
    this.revealed = false;
    this.bombed = false;
    this.flagged = false;
  }

  render() {
    push();
    noFill();
    strokeWeight(2);
    stroke("orange");
    if (this.revealed && this.bombed) {
      let col = color("sandybrown");
      col.setAlpha(255);
      fill(col);
      stroke("chocolate");
    } else if (this.revealed) {
      let col = color("springgreen");
      col.setAlpha(255);
      fill(col);
      stroke("forestgreen");
    }
    rect(this.x + 1, this.y + 1, this.w - 2, this.h - 2);
    if (this.revealed && !this.bombed) {
      const neighbour = this.countN();
      if (neighbour != 0) {
        textSize(32);
        textAlign(CENTER, CENTER);
        strokeWeight(6);
        fill("deepskyblue");
        stroke("navy");
        text(neighbour, this.x + this.w / 2, this.y + this.w / 2);
      }
    }

    if (this.flagged) {
      textAlign(CENTER, CENTER);
      textSize(60);
      text("🚩", this.x + this.w / 2, this.y + this.w / 2);
    }
    pop();
  }

  reveal() {
    this.revealed = true;
    if (this.countN() === 0) {
      this.floodFill();
    } else if (this.bombed) {
      gameOver = true;
      gameStarted = false;
      gameInfo = false;
      gameWon = false;
      loseS.play();
    }
  }

  countN() {
    let neighbours = 0;
    if (this.bombed) {
      return -1;
    } else {
      for (let ioff = -1; ioff <= 1; ioff++) {
        for (let joff = -1; joff <= 1; joff++) {
          let i = this.i + ioff;
          let j = this.j + joff;

          if (i >= 0 && i < numC && j >= 0 && j < numR && cells[i][j].bombed) {
            neighbours++;
          }
        }
      }
      return neighbours;
    }
  }

  floodFill() {
    for (let ioff = -1; ioff <= 1; ioff++) {
      for (let joff = -1; joff <= 1; joff++) {
        let i = this.i + ioff;
        let j = this.j + joff;
        if (i >= 0 && i < numC && j >= 0 && j < numR && !cells[i][j].revealed) {
          cells[i][j].reveal();
        }
      }
    }
  }

  flag() {
    if (!this.revealed) {
      if (this.flagged) {
        this.flagged = false;
        numB++;
      } else if (numB > 0) {
        numB--;
        this.flagged = true;
        if (checkWin()) {
          gameWon = true;
          winS.play();
        }
      }
    }
  }
}