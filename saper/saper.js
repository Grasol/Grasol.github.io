var height = document.getElementById("height_val");
var width = document.getElementById("width_val");
var bombs = document.getElementById("bombs_val");

const HIDDEN_TILE = "hidden_tile.svg";
const EMPTY_TILE = "empty_tile.svg";
const BOMB_TILE = "bomb_tile.svg";
const GREEN_BOMB_TILE = "green_bomb_tile.svg";
const RED_BOMB_TILE = "red_bomb_tile.svg";
const FLAG_TILE = "flag_tile.svg";
const QM_TILE = "qm_tile.svg";
const ONE_TILE = "1_tile.svg";
const TWO_TILE = "2_tile.svg";
const THREE_TILE = "3_tile.svg";
const FOUR_TILE = "4_tile.svg";
const FIVE_TILE = "5_tile.svg";
const SIX_TILE = "6_tile.svg";
const SEVEN_TILE = "7_tile.svg";
const EIGHT_TILE = "8_tile.svg";

const LEFT_CLICK = 1;
const MIDDLE_CLICK = 2;
const RIGHT_CLICK = 3;

var logic;
var board;

var first_click = true;
var time = 0;
var intv;

var Board = class {
  constructor(max_tiles) {
    this.max_tiles = max_tiles;
    this.board = new Array(this.max_tiles);

    this.EMPTY = "EMPTY";
    this.BOMB = "BOMB";
    this.FLAG = "FLAG";
    this.QM = "QM";

    for (let i = 0; i < this.max_tiles; i++) {
      let array_tile = {
        "bottom_layer": null,
        // EMPTY
        // BOMB
        // 1-8 
      
        "top_layer": null
        // FALSE
        // EMPTY
        // FLAG
        // QM
      }

      this.board[i] = array_tile;
    }

    console.log(this.board);

  }

  setTile(idx, bottom=this.EMPTY, top=this.EMPTY) {
    let array_tile = this.board[idx];
    if ([this.EMPTY, this.BOMB, 1, 2, 3, 4, 5, 6, 7, 8].includes(bottom)) {
      array_tile["bottom_layer"] = bottom;
    }

    if ([false, this.EMPTY, this.FLAG, this.QM].includes(top)) {
      array_tile["top_layer"] = top;
    }

    this.board[idx] = array_tile;
  }

  getBottom(idx) {
    return this.board[idx]["bottom_layer"];
  }

  getTop(idx) {
    return this.board[idx]["top_layer"];
  }
}


var Logic = class {
  constructor(board) {
    this.board = board;

    this.height = parseInt(height.value);    
    this.height = getValueInRange(this.height, 2, 199);

    this.width = parseInt(width.value);
    this.width = getValueInRange(this.width, 2, 199);

    this.max_tiles = this.width * this.height;

    this.bombs = parseInt(bombs.value);
    this.bombs = getValueInRange(this.bombs, 1, this.max_tiles - 1);
  }

  fillBoardDigits() {
    // fill board a digits
    for (let i = 0; i < this.max_tiles; i++) {
      if (this.board.getBottom(i) == this.board.BOMB) {
        continue;
      }

      let tiles = this.getIdxTiles(i);

      let num = 0;
      for (let j = 0; j < 8; j++) {
        let idx_tile = tiles[j];
        if (idx_tile == null) {
          continue;
        } 

        if (this.board.getBottom(idx_tile) == this.board.BOMB) {
          num++;
        }
      }

      if (num == 0) {
        this.board.setTile(i, this.board.EMPTY);
      }

      else {
        this.board.setTile(i, num);
      }
    }
  }

  fillBoardBombs(start_tile_idx) {
    let tiles = this.getIdxTiles(start_tile_idx);

    for (let i = 0; i < this.bombs; i++) {
      let empty_try = 3;
      while (true) {
        let r = getRandomInt(0, this.max_tiles);
        if (r == start_tile_idx) {
          continue;
        }

        else if (tiles.includes(r) && empty_try > 0) {
          console.log(empty_try, "ZEROZERO");
          empty_try -= 1;
          continue;
        }

        else if (this.board.getBottom(r) == this.board.BOMB) {
          continue;
        }
        
        this.board.setTile(r, this.board.BOMB);
        break;
      }
    }
  }

  visTiles(pos) {
    let vis = pos;
    let vis_histry = pos
    while (true) {
      let tmp_vis = [];
      for (let v = 0; v < vis.length; v++) {
        let vis_tile = this.board.getBottom(vis[v]);
        if (vis_tile != this.board.EMPTY) {
          if (([1, 2, 3, 4, 5, 6, 7, 8].includes(vis_tile)) ||
              (vis_tile == this.board.BOMB)) {
            this.board.setTile(vis[v], null, false);
          }

          continue;
        }

        this.board.setTile(vis[v], null, false);
        let tiles = this.getIdxTiles(vis[v]);
        for (let i = 0; i < 8; i++) {
          if (tiles[i] == null) {
            continue;
          }

          if (!vis_histry.includes(tiles[i])) {
            tmp_vis.push(tiles[i]);
            vis_histry.push(tiles[i]);
          }
        }
      }

      if (tmp_vis.length == 0) {
        break;
      }

      vis = tmp_vis;
    }

    return vis_histry;
  }

  getIdxTiles(pos) {
    let res = new Array(8);
    let border;

    border = this.hBorderTiles(pos);
    if (pos > border[0]) {
      res[0] = pos - 1;
    }

    if (pos < border[1]) {
      res[1] = pos + 1;
    }

    let pos2 = pos - this.width;
    border = this.hBorderTiles(pos2);
    if (pos2 >= 0) {
      res[3] = pos2;

      if (pos2 > border[0]) {
        res[2] = pos2 - 1;
      }

      if (pos2 < border[1]) {
        res[4] = pos2 + 1;
      }
    }

    pos2 = pos + this.width;
    border = this.hBorderTiles(pos2);
    if (pos2 < this.height * this.width) {
      res[6] = pos2;

      if (pos2 > border[0]) {
        res[5] = pos2 - 1;
      }

      if (pos2 < border[1]) {
        res[7] = pos2 + 1;
      }
    }

    return res;
  }

  hBorderTiles(pos) {
    let min = Math.floor(pos / this.width) * this.width;
    let max = min + this.width - 1;

    return [min, max];
  }

  tileService(e) {
  let res = null;

  let num_tile = parseInt(e.target.id.substr(5));
  if (first_click) {
    first_click = false;
    this.fillBoardBombs(num_tile);
    this.fillBoardDigits();
  }

  let tile_bottom = this.board.getBottom(num_tile);
  let tile_top = this.board.getTop(num_tile);

  // service click 
  switch(e.which) {
  case LEFT_CLICK: {
    if (tile_top == this.board.EMPTY) {
      res = this.visTiles([num_tile]);
    }

    break;
  }

  case MIDDLE_CLICK: {
    if (tile_top == false) {
      if ([1, 2, 3, 4, 5, 6, 7, 8].includes(tile_bottom)) {
        let tiles = this.getIdxTiles(num_tile);
        let vis = [];
        let flags = 0
        for (let i = 0; i < 8; i++) {
          if (tiles[i] == null) {
            continue;
          }

          let t = this.board.getTop(tiles[i]);
          console.log(tiles[i], t);
          if (t == this.board.FLAG) {
            flags++;
          }

          else if (t == this.board.EMPTY) {
            vis.push(tiles[i]);
          }
        }

        if (tile_bottom == flags) {
          console.log("VIS: ", vis)
          res = this.visTiles(vis);
        }
      }
    }
  }

  case RIGHT_CLICK: {
    switch (tile_top) {
      case this.board.EMPTY: this.board.setTile(num_tile, null, this.board.FLAG);  break;
      case this.board.FLAG:  this.board.setTile(num_tile, null, this.board.QM);    break;
      case this.board.QM:    this.board.setTile(num_tile, null, this.board.EMPTY); break;
    }

    break;
  }
  }
  
  // check status game
  let status = 0;
  // 0: ok
  // 1: win
  // 2: boom
 
  console.log(">>>>>", res);
  if (res != null) {
    for (let i = 0; i < res.length; i++) {
      if (this.board.getBottom(res[i]) == this.board.BOMB) {
        console.log("AA")
        status = 2;
        break;
      } 
    }
  }

  if (status == 0) {
    cont: {
    for (let i = 0; i < this.board.board.length; i++) {
      let t = this.board.getTop(i);
      console.log("<<<", t);
      if (t == this.board.EMPTY || t == this.board.QM) {
        break cont;
      }
  
      if (t == this.board.FLAG && this.board.getBottom(i) != this.board.BOMB) {
        break cont;
      }
    }
    status = 1;
  
    }
  }

  console.log("---->", status);
  return status;
  }
}


function getValueInRange(val, min, max) {
  if (val < min) {
    return min;
  }

  if (val > max) {
    return max;
  }

  return val;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function updateSrcBoard(logic, status) {
  let bomb_variant = 0;
  let flag_variant = 0;
  switch (status) {
    case 1: flag_variant = 1; break;
    case 2: bomb_variant = 1; break; 
  }

  for (let i = 0; i < logic.max_tiles; i++) {
    let tile_id = "tile-" + String(i);
    let tile = document.getElementById(tile_id);
    tile.src = "assets/" + getTileLink(logic.board, i, bomb_variant, flag_variant);
  }
}

function genBoard(logic) {
  let h_max = logic.height;
  let w_max = logic.width;
  let saperBoard = document.getElementById("saper");

  let h_tiles = new Array();
  for (let h = 0; h < h_max; h++) {
    w_tiles = new Array();
    for (let w = 0; w < w_max; w++) {
      let tile_idx = h * w_max + w;

      let tile_link = "assets/" + HIDDEN_TILE;
      let tile_id = "tile-" + String(tile_idx);

      let img_text = ("<img id=" + tile_id + 
                      " src='" + tile_link + 
                      "' height='25' width='25'>")

      w_tiles.push(img_text);
    }

    h_tiles.push(w_tiles.join(""));
  }

  saperBoard.innerHTML = h_tiles.join("<br/>");

}

function getTileLink(board, num_tile, bomb_variant=0, flag_variant=0) {
  // bomb_variant
  // 0: normal_bomb
  // 1: red_bomb
  //
  // flags_variant
  // 0: flag 
  // 1: green_bomb 

  let tile_bottom = board.getBottom(num_tile);
  let tile_top = board.getTop(num_tile);  

  let res;
  if (tile_top == false) {
    switch (tile_bottom) {
      case board.EMPTY: res = EMPTY_TILE; break;
      case board.BOMB:  {
        switch (bomb_variant) {
          case 0: res = BOMB_TILE;     break;
          case 1: res = RED_BOMB_TILE; break;
        }
        break;
      }
      case 1: res = ONE_TILE;   break;
      case 2: res = TWO_TILE;   break;
      case 3: res = THREE_TILE; break;
      case 4: res = FOUR_TILE;  break;
      case 5: res = FIVE_TILE;  break;
      case 6: res = SIX_TILE;   break;
      case 7: res = SEVEN_TILE; break;
      case 8: res = EIGHT_TILE; break;
    }
  }

  else {
    switch (tile_top) {
      case board.EMPTY: res = HIDDEN_TILE; break;
      case board.FLAG: {
        switch (flag_variant) {
          case 0: res = FLAG_TILE;       break;
          case 1: res = GREEN_BOMB_TILE; break;
        }
        break;
      }
      case board.QM:    res = QM_TILE;     break;
    }
  }

  return res;
}

function counter() {
  time++;
  document.getElementById("time").innerHTML = time;
}



function main_game() {
  first_click = true;
  time = 0;

  var logic = new Logic(null)
  console.log(logic.height, "AAAAAAA");
  var board = new Board(logic.max_tiles);
  logic.board = board;

  genBoard(logic);

  let print_tiles = new Array(board.max_tiles);
  for (let i = 0; i < board.max_tiles; i++) {
    print_tiles[i] = document.getElementById("tile-" + String(i));
  }

  print_tiles.forEach(function(p_tile) {
    p_tile.addEventListener("mousedown", function(e) {
      if (first_click) {
        if (intv != undefined) {
          window.clearInterval(intv);
        }

        intv = window.setInterval(counter, 1000);
      }

      let status = logic.tileService(e);
      
      updateSrcBoard(logic, status);
      let flags = 0
      for (let i = 0; i < board.board.length; i++) {
        if (board.getTop(i) == board.FLAG) {
          flags++;
        }
      }

      document.getElementById("bombs_num").innerHTML = logic.bombs - flags;
      if (status != 0) {
        window.clearInterval(intv);
        let saper = document.getElementById("saper")
        let clone_saper = saper.cloneNode(true);
        document.body.replaceChild(clone_saper, saper);
      }
    })

    p_tile.addEventListener("contextmenu", e => e.preventDefault());
  })

}


