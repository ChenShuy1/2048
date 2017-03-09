function showAnimation(x, y, num) {
    var grid_num = $("#grid-num-"+x+"-"+y);
    grid_num.css("background-color", getBackgroundColor(num));
    grid_num.css("color", getColor(num));
    grid_num.text(num);
    grid_num.animate({
        width:"100px",
        height:"100px",
        left: y*120+20,
        top: x*120+20
    }, 100);
}

function showMoveAnimation(fx, fy, tx, ty) {
    var grid_num = $("#grid-num-"+fx+"-"+fy);
    grid_num.animate({
        left: ty*120+20,
        top: tx*120+20
    }, 200);
}