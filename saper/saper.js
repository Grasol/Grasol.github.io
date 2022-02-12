var height = document.getElementById("height_val");
var width = document.getElementById("width_val");
var bombs = document.getElementById("bombs_val");

var HIDDEN_TILE = "hidden_tile.svg";
var EMPTY_TILE = "empty_tile.svg";
var BOMB_TILE = "bomb_tile.svg";
var GREEN_BOMB_TILE = "green_bomb_tile.svg";
var RED_BOMB_TILE = "red_bomb_tile.svg";
var FLAG_TILE = "flag_tile.svg";
var QM_TILE = "qm_tile.svg";
var ONE_TILE = "1_tile.svg";
var TWO_TILE = "2_tile.svg";
var THREE_TILE = "3_tile.svg";
var FOUR_TILE = "4_tile.svg";
var FIVE_TILE = "5_tile.svg";
var SIX_TILE = "6_tile.svg";
var SEVEN_TILE = "7_tile.svg";
var EIGHT_TILE = "8_tile.svg";

var LEFT_CLICK = 1;
var MIDDLE_CLICK = 2;
var RIGHT_CLICK = 3;

var board;
var logic;
var first_click;
var time;
var intv;

var Board = class {
  constructor(max_tiles) {
    this.max_tiles = max_tiles;
    this.board = new Array(this.max_tiles);

    this.EMPTY = "EMPTY";
    this.BOMB = "BOMB";
    this.FLAG = "FLAG";
    this.QM = "QM";

    for (var i = 0; i < this.max_tiles; i += 1) {
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
    var array_tile = this.board[idx];
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
    for (var i = 0; i < this.max_tiles; i += 1) {
      if (this.board.getBottom(i) == this.board.BOMB) {
        continue;
      }

      var tiles = this.getIdxTiles(i);

      var num = 0;
      for (var j = 0; j < 8; j += 1) {
        var idx_tile = tiles[j];
        if (idx_tile == null) {
          continue;
        } 

        if (this.board.getBottom(idx_tile) == this.board.BOMB) {
          num += 1;
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

  fillBoardBombs(start_idx_tile) {
    for (var i = 0; i < this.bombs; i += 1) {
      while (true) {
        let r = getRandomInt(0, this.max_tiles);
        if (r == start_idx_tile) {
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
    var vis = pos;
    var vis_histry = pos
    while (true) {
      var tmp_vis = [];
      for (var v = 0; v < vis.length; v += 1) {
        var vis_tile = this.board.getBottom(vis[v]);
        if (vis_tile != this.board.EMPTY) {
          if (([1, 2, 3, 4, 5, 6, 7, 8].includes(vis_tile)) ||
              (vis_tile == this.board.BOMB)) {
            this.board.setTile(vis[v], null, false);
          }

          continue;
        }

        this.board.setTile(vis[v], null, false);
        var tiles = this.getIdxTiles(vis[v]);
        for (var i = 0; i < 8; i += 1) {
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
    var res = new Array(8);
    var border;

    border = this.hBorderTiles(pos);
    if (pos > border[0]) {
      res[0] = pos - 1;
    }

    if (pos < border[1]) {
      res[1] = pos + 1;
    }

    var pos2 = pos - this.width;
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
    var min = Math.floor(pos / this.width) * this.width;
    var max = min + this.width - 1;

    return [min, max];
  }

  tileService(e) {
  var res = null;

  var num_tile = parseInt(e.target.id.substr(5));
  if (first_click) {
    first_click = false;
    this.fillBoardBombs(num_tile);
    this.fillBoardDigits();
  }

  var tile_bottom = this.board.getBottom(num_tile);
  var tile_top = this.board.getTop(num_tile);

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
        var tiles = this.getIdxTiles(num_tile);
        var vis = [];
        var flags = 0
        for (var i = 0; i < 8; i += 1) {
          if (tiles[i] == null) {
            continue;
          }

          var t = this.board.getTop(tiles[i]);
          console.log(tiles[i], t);
          if (t == this.board.FLAG) {
            flags += 1;
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
      case this.board.EMPTY: this.board.setTile(num_tile, null, board.FLAG);  break;
      case this.board.FLAG:  this.board.setTile(num_tile, null, board.QM);    break;
      case this.board.QM:    this.board.setTile(num_tile, null, board.EMPTY); break;
    }

    break;
  }
  }
  
  // check status game
  var status = 0;
  // 0: ok
  // 1: win
  // 2: boom
 
  console.log(">>>>>", res);
  if (res != null) {
    for (var i = 0; i < res.length; i += 1) {
      if (this.board.getBottom(res[i]) == this.board.BOMB) {
        console.log("AA")
        status = 2;
        break;
      } 
    }
  }

  if (status == 0) {
    cont: {
    for (var i = 0; i < this.board.board.length; i += 1) {
      var t = this.board.getTop(i);
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

function updateSrcBoard(status) {
  var bomb_variant = 0;
  var flag_variant = 0;
  switch (status) {
    case 1: flag_variant = 1; break;
    case 2: bomb_variant = 1; break; 
  }

  for (var i = 0; i < logic.max_tiles; i += 1) {
    var tile_id = "tile-" + String(i);
    var tile = document.getElementById(tile_id);
    tile.src = "assets/" + getTileLink(i, bomb_variant, flag_variant);
  }
}

function genBoard() {
  var h_max = logic.height;
  var w_max = logic.width;
  var saperBoard = document.getElementById("saper");

  h_tiles = new Array();
  for (var h = 0; h < h_max; h += 1) {
    w_tiles = new Array();
    for (var w = 0; w < w_max; w += 1) {
      var tile_idx = h * w_max + w;

      var tile_link = "assets/" + HIDDEN_TILE;
      var tile_id = "tile-" + String(tile_idx);

      var img_text = ("<img id=" + tile_id + 
                      " src='" + tile_link + 
                      "' height='25' width='25'>")

      w_tiles.push(img_text);
    }

    h_tiles.push(w_tiles.join(""));
  }

  saperBoard.innerHTML = h_tiles.join("<br/>");

}

function getTileLink(num_tile, bomb_variant=0, flag_variant=0) {
  // bomb_variant
  // 0: normal_bomb
  // 1: red_bomb
  //
  // flags_variant
  // 0: flag 
  // 1: green_bomb 

  var tile_bottom = board.getBottom(num_tile);
  var tile_top = board.getTop(num_tile);  

  var res;
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
  time += 1;
  document.getElementById("time").innerHTML = time;
}



function main_game() {
  first_click = true;
  time = 0;
 
  logic = new Logic(null)
  board = new Board(logic.max_tiles);
  logic.board = board;

  genBoard(board)

  var print_tiles = new Array(board.max_tiles);
  for (var i = 0; i < board.max_tiles; i += 1) {
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

      var status = logic.tileService(e);
      
      updateSrcBoard(status);
      var flags = 0
      for (var i = 0; i < board.board.length; i += 1) {
        if (board.getTop(i) == board.FLAG) {
          flags += 1;
        }
      }

      document.getElementById("bombs_num").innerHTML = logic.bombs - flags;
      if (status != 0) {
        window.clearInterval(intv);
        var saper = document.getElementById("saper")
        var clone_saper = saper.cloneNode(true);
        document.body.replaceChild(clone_saper, saper);
      }
    })

    p_tile.addEventListener("contextmenu", e => e.preventDefault());
  })

}


