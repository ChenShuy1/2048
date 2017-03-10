var board = new Array();
var score = 0;
var conflicted = new Array();
window.onload = function(){
    newGame();
    $("#new_game").click(function(){
        newGame();
    });
};

function newGame() {
    //初始化grid，将grid格放在正确的位置上
    init();
    //随机生成两个数字在表盘上
    getOneNumberRandomly();
    getOneNumberRandomly();

}

function init() {
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j< 4; j++) {
            var grid_cell = $("#grid-cell-"+i+"-"+j);
            grid_cell.css("top", i*120+20);
            grid_cell.css("left", j*120+20);
        }
    }
    score = 0;
    for(var i = 0; i < 4; i++) {
        board[i] = new Array();
        conflicted[i] = new Array();
        for(var j = 0; j < 4; j++) {
            board[i][j] = 0;
            conflicted[i][j] = false;
        }
    } 
    updateGrid();

}

function updateGrid() {
    //在一开始前，必须要清除样式，否则会遗留下数字样式
    $(".grid-num").remove();

    var grid_content = $("#grid-content");
    var score_content = $("#score");
    score_content.text(score);
    for(var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++){
            var str = "<div class=\"grid-num\" id=\"grid-num-"+i+"-"+j+"\"></div>";
            grid_content.append(str);
            var grid_num = $("#grid-num-"+i+"-"+j);
            grid_num.css("position", "absolute");
            if(board[i][j] == 0) {
                grid_num.css("width", "0");
                grid_num.css("height", "0");
                grid_num.css("top", i*120+20+50);
                grid_num.css("left", j*120+20+50);
            } else {
                grid_num.css("width", "100px");
                grid_num.css("height", "100px");
                grid_num.css("top", i*120+20);
                grid_num.css("left", j*120+20);
                grid_num.css("background-color", getBackgroundColor(board[i][j]));
                grid_num.text(board[i][j]);
                grid_num.css("color", getColor(board[i][j]));
            }
            conflicted[i][j] = false;
        }
    }
}

function getOneNumberRandomly() {
    //找到网格中的一个空位
    var x = parseInt(Math.floor(Math.random() * 4));
    var y = parseInt(Math.floor(Math.random() * 4));
    while(1) {
        if(board[x][y] == 0) {
            break;
        }
        x = parseInt(Math.floor(Math.random() * 4));
        y = parseInt(Math.floor(Math.random() * 4));
    }
    //随机生成2/4
    var num = Math.random() < 0.5 ? 2 : 4;
    board[x][y] = num;
    showAnimation(x, y, num);
}

$(document).keydown(function(e){
    switch(e.keyCode){
        //按下左键
        case 37:
            if(moveLeft()) {
                setTimeout("getOneNumberRandomly()",200);
                console.log("board", board);

                setTimeout("isGameover()", 300);
            }
            break;
        //按下上键
        case 38:
            e.preventDefault();
            if(moveUp()) {
                setTimeout("getOneNumberRandomly()", 200);
                console.log("board", board);

                setTimeout("isGameover()", 300);

            }
            break;
        //按向右键
        case 39:
            if(moveRight()) {
                setTimeout("getOneNumberRandomly()", 200);
                console.log("board", board);

                setTimeout("isGameover()", 300);
            }
            break;
        //按下下键
        case 40:
            e.preventDefault();
            if(moveDown()) {
                setTimeout("getOneNumberRandomly()", 200);
                console.log("board", board);

                setTimeout("isGameover()", 300);
            }
            break;
        default: 
            break;
    }
});

function isGameover() {
    //游戏结束的条件：
    //board不再有位置并且无法move
    if(!nospace(board)||!nomove(board)) {
        console.log("nospace", nospace(board));
        console.log("nomove", nomove(board));
        return;
    } else {
        alert("Game Over!");
        newGame();
    }
}

function moveLeft() {
    //若可以移动则移动
    if(canMoveLeft(board)) {
        for(var i = 0; i < 4; i++) {
            for(var j = 1; j < 4; j++) {
                if(board[i][j] != 0) {
                    for(var k = 0; k < j; k++) {
                        if(board[i][k] == 0 && noBlockHorizontal(i, j, k)) {
                            score+=board[i][j];
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            showMoveAnimation(i,j,i,k);
                        } else if(board[i][k]==board[i][j] && noBlockHorizontal(i, j, k) && !conflicted[i][k]) {
                            score+=board[i][j];
                            board[i][k]+=board[i][j];
                            board[i][j] = 0;
                            conflicted[i][k] = true;
                            showMoveAnimation(i,j,i,k);
                        }
                    }
                }
            }
        }
        setTimeout("updateGrid()",200);
        return true;
    } else {
        console.log("cant", board);
        return false;
    }
}
function moveUp() {
    if(canMoveUp(board)) {
        for(j = 0; j < 4; j++) {
            for(i = 1; i < 4; i++) {
                if(board[i][j]!=0) {
                    for(k = 0; k < i; k++) {
                        if(board[k][j] == 0 && noBlockVertical(j, i, k)) {
                            score+=board[i][j];
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            showMoveAnimation(i, j, k, j);
                        }
                        if(board[k][j] == board[i][j] && noBlockVertical(j, i, k) && !conflicted[k][j]) {
                            score+=board[i][j];
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            conflicted[k][j] = true;
                            showMoveAnimation(i, j, k, j);
                        }
                    }
                }
            }
        }
        setTimeout("updateGrid()",200);
        return true;
    } else {
        console.log("cant", board);
        return false;
    }
}
function moveRight() {
    if(canMoveRight(board)) {
        for(var i = 0; i < 4;i++) {
            for (var j = 2; j >= 0; j--) {
                if(board[i][j]!=0) {
                    for(var k = 3; k > j; k--) {
                        if(board[i][k] == 0 && noBlockHorizontal(i, k, j)) {
                            score+=board[i][j];
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            showMoveAnimation(i, j, i, k);
                        }
                        if(board[i][j] == board[i][k] && noBlockHorizontal(i, k, j) && !conflicted[i][k]) {
                            score+=board[i][j];
                            board[i][k] += board[i][j];
                            board[i][j] = 0;
                            conflicted[i][k] = true;
                            showMoveAnimation(i, j, i, k);
                        }
                    }
                }
            }
        }
        setTimeout("updateGrid()", 200);
        return true;
    } else {
        return false;
    }
}
function moveDown() {
    if(canMoveDown(board)) {
        for(j = 0; j < 4; j++) {
            for(i = 2; i >= 0; i--) {
                if(board[i][j]!=0) {
                    for(k = 3; k > i; k--) {
                        if(board[k][j] == 0 && noBlockVertical(j, k, i)) {
                            score+=board[i][j];
                            board[k][j] = board[i][j];
                            board[i][j] = 0;
                            showMoveAnimation(i, j, k, j);
                        }
                        if(board[k][j] == board[i][j] && noBlockVertical(j, k, i) && !conflicted[k][j]) {
                            score+=board[i][j];
                            board[k][j] += board[i][j];
                            board[i][j] = 0;
                            conflicted[k][j] = true;
                            showMoveAnimation(i, j, k, j);
                        }
                    }
                }    
            }
        }
        setTimeout("updateGrid()", 200);
        return true;
    } else {
        return false;
    }
}

function noBlockHorizontal(r, c1, c2){
    for(var i = c2+1; i < c1; i++) {
        if(board[r][i] != 0){
            return false;
        }
    }
    return true;
}
function noBlockVertical(c, r1, r2) {
    for(var i = r2+1; i < r1; i++) {
        if(board[i][c] != 0) 
            return false;
    }
    return true;
}
