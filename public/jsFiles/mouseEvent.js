

function mousedownHandler(e) {
    // var touches = e.changedTouches;
    // for(var i=0; i< touches.length;i++){
    //     var touch = touches[i];
    //     e = touch;
    //
    // }
    //console.log(e.target.className);
    clearEventBubble(e);
    if (e.target.className == 'noteTitle') {
        //locate the note
        var noteId = e.target.parentElement.getAttribute("id");
        dragObj = document.getElementById(noteId);
        // changeColor(noteId);
        var t = dragObj.style.top;
        var l = dragObj.style.left;
        z += 1;
        dragObj.setAttribute("style", "top:" + t + ";left:" + l + ";z-index:" + z);
        _startX = e.targetTouches[0].clientX;
        _startY = e.targetTouches[0].clientY;
        _offsetX = dragObj.offsetLeft;
        _offsetY = dragObj.offsetTop;
        dragObj.addEventListener("touchmove", mousemoveHandler, false);
    }
    if (e.target.className == "noteContent") {
        var noteId = e.target.parentElement.getAttribute("id");
        dragObj = document.getElementById(noteId);
        var t = dragObj.style.top;
        var l = dragObj.style.left;
        z += 1;
        dragObj.setAttribute("style", "top:" + t + ";left:" + l + ";z-index:" + z);
        _startX = e.targetTouches[0].clientX;
        _startY = e.targetTouches[0].clientY;
        _offsetX = dragObj.offsetLeft;
        _offsetY = dragObj.offsetTop;
        dragObj.addEventListener("touchmove", mousemoveHandler, false);
    }
    if(e.target.getAttribute("class") == 'svgContent'){
        // //the svgContent id Idk why not change after touching other note so I use note id by finding parent parent id to locate the real svg content

        var noteId = e.target.parentElement.parentElement.getAttribute("id");
        var svgContent  = document.getElementById(noteId).childNodes[1].firstChild;
        noteLocation = svgContent.parentElement.parentElement;
        var noteL = Number(noteLocation.style.left.replace("px","" ));
        var noteT = Number(noteLocation.style.top.replace("px","" ));
        titleHeight = 28;
        noteT = noteT + titleHeight;
        svgContent.addEventListener("touchstart",
            penstart(e));
        function penstart(e)
        {
            var pathElement = document.createElementNS(svgNS,"path");
            var x = e.targetTouches[0].clientX- noteL;

            var y = e.targetTouches[0].clientY - noteT;
            pathElement.setAttribute("d","M"+x+','+y+'L'+x+','+y);
            pathElement.setAttribute('stroke', 'black');
            pathElement.setAttribute('fill', 'none');
            svgContent.appendChild(pathElement);
            function touchMove(e)
            {
                e.preventDefault();
                var x = e.targetTouches[0].clientX- noteL;
                var y = e.targetTouches[0].clientY - noteT;
                pathElement.setAttribute("d",pathElement.getAttribute('d')
                    +' '+x+','+y);
            }
            function touchEnd(e)
            {
                svgContent.removeEventListener('touchstart',penstart)
                svgContent.removeEventListener('touchmove', touchMove);
                svgContent.removeEventListener('touchend', touchEnd);
            }
            svgContent.addEventListener('touchmove', touchMove);
            svgContent.addEventListener('touchend', touchEnd);
        };
    }
    if(e.target.className == 'rotateNote'){
        //source https://stackoverflow.com/questions/11051676/rotating-div-with-mouse-move
        var noteId = e.target.parentNode.parentNode.getAttribute("id");
        var obj = document.getElementById(noteId);
        //as width = 180, width = 170
        var rotateButton = obj.childNodes[0].childNodes[5];
        rotateButton.addEventListener("touchstart",function(e){
            e.preventDefault();
            var center_x =(obj.offsetLeft)+(90);
            var center_y = (obj.offsetTop)+ (85);
            function touchMove(e)
            {
                var touch_x = e.targetTouches[0].clientX;
                var touch_y = e.targetTouches[0].clientY;
                var radians = Math.atan2(touch_x - center_x, touch_y - center_y);
                var degree = (radians * (180 / Math.PI) * -1) + 120;
                obj.style.transform = 'rotate(' + degree + 'deg)';
            }
            function touchEnd(e)
            {
                rotateButton.removeEventListener('touchmove', touchMove);
                rotateButton.removeEventListener('touchend', touchEnd);
            }
            rotateButton.addEventListener('touchmove', touchMove);
            rotateButton.addEventListener('touchend', touchEnd);
        });
    }
}


function mouseupHandler(e) {
    clearEventBubble(e);
    // //after moving it will save the note automatically
    //$('html,body').removeAttr('style');
    var noteId = e.target.parentElement.getAttribute("id");
    dragObj = document.getElementById(noteId);
    dragObj.removeEventListener("mousemove", mousemoveHandler, false);
    saveNote(e.target.parentNode.id);
    //broadcastMessage("update",localStorage.getItem(e.target.parentNode.id));
    // document.removeEventListener("mousemove", mousemoveHandler, false);

}
function mousemoveHandler(e) {
    clearEventBubble(e);
    var noteId = e.target.parentElement.getAttribute("id");
    dragObj = document.getElementById(noteId);
    dragObj.style.left = (_offsetX + e.targetTouches[0].clientX - _startX) + 'px';
    dragObj.style.top = (_offsetY + e.targetTouches[0].clientY - _startY) + 'px';

}
