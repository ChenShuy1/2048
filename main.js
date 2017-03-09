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
                //isGameover();
            }
            break;
        case 38:
        case 39:
        case 40:
        default: break;
    }
});

function moveLeft() {
    //若可以移动则移动
    if(canMoveLeft(board)) {
        for(var i = 0; i < 4; i++) {
            for(var j = 1; j < 4; j++) {
                if(board[i][j] != 0) {
                    for(var k = 0; k < j; k++) {
                        if(board[i][k] == 0 && noBlockHorizontal(i, j, k)) {
                            board[i][k] = board[i][j];
                            board[i][j] = 0;
                            showMoveAnimation(i,j,i,k);
                        } else if(board[i][k]==board[i][j] && noBlockHorizontal(i, j, k) && !conflicted[i][k]) {
                            
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

function noBlockHorizontal(r, c1, c2){
    for(var i = c2+1; i < c1; i++) {
        if(board[r][i] != 0){
            return false;
        }
    }
    return true;
}
