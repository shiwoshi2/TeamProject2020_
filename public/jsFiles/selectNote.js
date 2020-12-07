
var startX ;
var startY ;
function selectNote(e) {
    // Timer
    var mouseStopId;

    mouseStopId = setTimeout(function () {
        mouseOn = true;
        startX = e.targetTouches[0].clientX;
        startY = e.targetTouches[0].clientY;
        console.log();
        var selDiv = document.createElement('div');
        selDiv.setAttribute('class','selectionCss');
        selDiv.setAttribute('id','selectDiv')
        selDiv.setAttribute("style", "top:" + startY + "px;left:" + startX + "px");
        selDiv.setAttribute("style","display: block");
        document.body.appendChild(selDiv);
        document.body.addEventListener('touchmove',selectMove,false)
    }, 100);
}
function selectMove(e) {

    clearEventBubble(e);
    // get the location
    var _x = e.targetTouches[0].clientX;
    var _y = e.targetTouches[0].clientY;
    // set the selection area
    var selDiv = document.getElementById('selectDiv');
    selDiv.style.display = 'block';
    //console.log(_x,startX);

    selDiv.style.left = Math.min(_x, startX) + 'px';
    selDiv.style.top = Math.min(_y, startY) + 'px';
    selDiv.style.width = Math.abs(_x - startX) + 'px';
    selDiv.style.height = Math.abs(_y - startY) + 'px';
}

function removeSelectNote(e) {
    document.body.removeEventListener('touchmove',  selectMove);
    var selDiv = document.getElementById('selectDiv');
    var fileDivs = document.getElementsByClassName('note');

    var selectedEls = [];
    // get the data
    var l = startX;
    var t = startY;
    var w = selDiv.offsetWidth;
    var h = selDiv.offsetHeight;
    for (var i = 0; i < fileDivs.length; i++) {
        var sl = fileDivs[i].offsetWidth + fileDivs[i].offsetLeft;
        var st = fileDivs[i].offsetHeight + fileDivs[i].offsetTop;
        //console.log(sl,st,l,t,w,h);
        if (sl > l && st > t && fileDivs[i].offsetLeft < l + w && fileDivs[i].offsetTop < t + h) {
            // if selected, put in the array
            selectedEls.push(fileDivs[i]);
        }
    }
    // print note
    console.log(selectedEls);
    // remove selection
    document.body.removeChild(selDiv);

}


function clearEventBubble (e) {
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;

    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
}
