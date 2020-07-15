//basic structure ref:https://blog.csdn.net/S_clifftop/article/details/73195564
var divTop = 50;
var divLeft = 0;
var k = 0;
var inputLimit = 50;
var tempData = {};
var tempPenData = {};


// Add sticky note
function addNote(key = 0, values = []) {
    textInputFlag = true;
    var id;
    if (key != 0) {
        id = key;
    }
    else {
        // ID using time
        id = new Date().getTime();
    }

    // Location when "add" was hit
    if (divLeft != 0) {
        divLeft += 260;
        if (divLeft >= displaySize) {
            divTop += 230;
            divLeft = divOffset;
        }
    }
    else {
        divLeft = divOffset;
    }

    if (values.length == 0) {

        var values = [];
        var initValue = {};
        initValue['text'] = "";
        initValue['color'] = '#EF9A9A';
        initValue['notePositionLeft'] = divLeft;
        initValue['notePositionTop'] = divTop;
        initValue['pen'] = "";
        initValue['id'] = "";
        values.push(initValue);
    }


    tempPenData[id] = values[0]['pen'];
    // Add the note Main content
    var mainDiv = document.createElement("div");
    mainDiv.setAttribute("class", "note");
    mainDiv.setAttribute("id", id);
    mainDiv.setAttribute("style", "top:" + values[0]['notePositionTop'] + "px;left:" + values[0]['notePositionLeft'] + "px");

    // Title Div
    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "noteTitle");


    // Operations supported on sticky note
    // ==============================================================================================
    // Add note img
    var addImg = document.createElement("img");
    addImg.setAttribute("src", "images/icon-add.png");
    addImg.setAttribute("class", "addIcon");
    // Add note
    addImg.setAttribute("onclick", "addNote()");

    titleDiv.appendChild(addImg);

    // Add deletenote image
    var delImg = document.createElement("img");
    delImg.setAttribute("src", "images/icon-delete.png");
    delImg.setAttribute("class", "delIcon");
    // Delete
    delImg.setAttribute("onclick", "deleteNote('" + id + "')");
    titleDiv.appendChild(delImg);

    // ==============================================================================================
    // Set color of the background
    var colorBg = document.createElement("select");

    colorBg.setAttribute("class", "colorBg");
    colorBg.options.add(new Option("", "#EF9A9A"));
    colorBg.options.add(new Option("", "#CE93D8"));
    colorBg.options.add(new Option("", "#81D4FA"));
    colorBg.options.add(new Option("", "#80CBC4"));
    colorBg.options.add(new Option("", "#C5E1A5"));
    colorBg.options.add(new Option("", "#FFF59D"));
    colorBg.options.add(new Option("", "#FFCC80"));
    colorBg.options.add(new Option("", "#BCAAA4"));
    colorBg.options.add(new Option("", "#F48FB1"));
    colorBg.options.add(new Option("", "#9FA8DA"));
    colorBg.setAttribute("onclick", "changeColor('" + id + "')");
    colorBg.options.selectedIndex = colorIndex.indexOf(values[0]['color']);
    
    titleDiv.appendChild(colorBg);

    // Save button
    var saveImg = document.createElement("img");
    saveImg.setAttribute("src", "images/icon-save.png");
    saveImg.setAttribute("class", "save");
    // Add note
    saveImg.setAttribute("onclick", "saveNote('" + id + "')");
    titleDiv.appendChild(saveImg);
    // pen input
    var penInput = document.createElement("img");
    penInput.setAttribute("src", "images/icon-pen28.png");
    penInput.setAttribute("class", "penInput");
    // Add note
    penInput.setAttribute("onclick", "penInput('" + id + "')");
    titleDiv.appendChild(penInput);

    var rotateNote = document.createElement("img");
    rotateNote.setAttribute("src", "images/icon-rotate.png");
    rotateNote.setAttribute("class", "rotateNote");
    titleDiv.appendChild(rotateNote);
    //clear button
    var clear = document.createElement("img");
    clear.setAttribute("src", "images/icon-clearPen.png");
    clear.setAttribute("class", "clear");
    clear.setAttribute("onclick", "clearContent('" + id + "')");
    titleDiv.appendChild(clear);

    var contentDiv = createTextContent(values[0]['text'],id,"true");

    contentDiv.style.backgroundColor = values[0]['color'];
    // var numSpan = createNumSpan(values[0]["text"],inputLimit);
    mainDiv.appendChild(titleDiv);
    mainDiv.appendChild(contentDiv);
    mainDiv.addEventListener("touchstart", mousedownHandler, {passive: false});
    mainDiv.addEventListener("touchend", mouseupHandler, {passive: false});
    // mainDiv.appendChild(numSpan);
    document.body.appendChild(mainDiv);

    // limitInput(contentDiv,inputLimit);
    saveNoteWithoutIO(id);
    broadcastMessage("add",localStorage.getItem(id));
}

// Move the note
var dragObj;
var _startX = 0;
var _startY = 0;
var _offsetX = 0;
var _offsetY = 0;
var z = 0;
var noteLocation;
function createTextContent(text,id,isText){
    // only text input editable
    var contentDiv = document.createElement("div");
    contentDiv.innerText = text;
    contentDiv.setAttribute("class", "noteContent");
    contentDiv.setAttribute("contenteditable", "true");
    contentDiv.setAttribute("textInput",isText);
    contentDiv.style.width = "100%";
    contentDiv.style.height = 192+'px';
    return contentDiv;
}
var ongoingTouches = [];
function mousedownHandler(e) {
    // var touches = e.changedTouches;
    // for(var i=0; i< touches.length;i++){
    //     var touch = touches[i];
    //     e = touch;
    //
    // }

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

function clearContent(key) {
    var obj = document.getElementById(key);
    var isText = obj.childNodes[1].getAttribute("textInput");
    if(isText=='true'){
        obj.childNodes[1].innerText = "";
    }else {
        obj.childNodes[1].firstChild.innerHTML = "";

    }

}
function penInput(key) {
    //switch container to svg
    //locate mainDiv
    var obj = document.getElementById(key);
    var nodeName = obj.childNodes[1].nodeName;
    obj.getElementsByClassName('penInput')[0].classList.toggle('text_execute');
    if(nodeName == "DIV"){
        var isTextInput = obj.childNodes[1].getAttribute("textInput");
        if(isTextInput =="true"){
            console.log("switch to svg now");
            textTemp = obj.childNodes[1].innerText;
            obj.childNodes[1].setAttribute("textInput","false");
            tempData[key] = obj.childNodes[1].innerText;
            obj.childNodes[1].innerText = "";
            obj.childNodes[1].setAttribute("contenteditable", "true");
            var contentSvg = document.createElementNS(svgNS,"svg");
            contentSvg.setAttribute("class","svgContent");
            contentSvg.setAttribute("id","svgContent");
            contentSvg.style.width = "100%";
            contentSvg.style.height = "100%";
            //transfer to string is easier by using in/outer HTML
            if(tempPenData[key].length != 0){
                var totalPenInput="";
                for(var i=0; i<tempPenData[key].length;i++) {
                    totalPenInput =totalPenInput+tempPenData[key][i];
                }
                contentSvg.innerHTML = totalPenInput;
            }
            obj.childNodes[1].appendChild(contentSvg);
            obj.removeChild(obj.childNodes[2]);

        }else{
            tempPenData[key] = obj.childNodes[1].firstChild.innerHTML;
            console.log("set back to textInput");
            obj.childNodes[1].setAttribute("textInput","true");
            obj.childNodes[1].setAttribute("contenteditable", "true");
            obj.childNodes[1].removeChild(obj.childNodes[1].firstChild);
            obj.childNodes[1].innerText = tempData[key];

        }
    }
}
//store note
function saveNote(key) {
    //locate mainDiv
    var obj = document.getElementById(key);
    //parent
    var values = [];
    //record each node's value
    var value = {};
    //array for text input lists
    var textValueList = [];
    //save text and peninput
    //console.log("insave"+obj.childNodes[1].getAttribute("textInput"));
    var isText = obj.childNodes[1].getAttribute("textInput");
    if(isText=='true'){
        value['text'] = obj.childNodes[1].innerText;
        value['pen'] =tempPenData[key];
    }else {
        value['pen'] = obj.childNodes[1].firstChild.outerHTML;
        value['text'] = tempData[key];
    }

    var selectedColor = obj.childNodes[1].style.backgroundColor;
    selectedColor = colorRGBtoHex(selectedColor);
    value['color'] = selectedColor;
    var notePositionLeft = obj.style.left;
    var notePositionTop = obj.style.top;
    value['notePositionLeft'] = notePositionLeft.replace("px", "");
    value['notePositionTop'] = notePositionTop.replace("px", "");
    value['id'] = key;
    values.push(value);
    values = JSON.stringify(values);
    if (values.length > 0) {
        //save to storage
        localStorage.setItem(key, values);
    }
    broadcastMessage("update",values);
}

//reload from local
function loadData(dataByUpload = false,uploadedData = []) {
    //key,value as json，passed to addNote
    if(dataByUpload){
        uploadedData = JSON.parse(uploadedData);
        for (var d in uploadedData) {
            //keep the same one when upload same element twice or more times
            //but generate a id for the duplicate
            var dataTemp = uploadedData[d];
            for (var i = 0; i < localStorage.length; i++) {
                if(localStorage.key(i)==d){
                    var obj = document.getElementById(d);
                    obj.parentNode.removeChild(obj);
                    // localStorage
                    localStorage.removeItem(d);
                }
            }
            addNote(Number(d), JSON.parse(dataTemp));
        }

    }else{
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var values = localStorage.getItem(key);
            var value = JSON.parse(values);
            updateNoteWithoutIO(key, value);
        }
    }
}
//delete note
function deleteNote(key) {
    broadcastMessage("delete",key);
    var obj = document.getElementById(key);
    obj.parentNode.removeChild(obj);
    // localStorage
    localStorage.removeItem(key);
}

//clear all
function deleteNotesAll() {
    localStorage.clear();
    //refresh
    location.reload();
}

function changeColor(id) {
    var obj = document.getElementById(id);
    var color = obj.firstElementChild.childNodes[2];

    //just a guessing
    var selectedColor = color.options[color.options.selectedIndex].value;

    obj.childNodes[1].style.backgroundColor = selectedColor;
    saveNote(id);

}

function mouseupHandler(e) {
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
    e.preventDefault();
    var noteId = e.target.parentElement.getAttribute("id");
    dragObj = document.getElementById(noteId);
    dragObj.style.left = (_offsetX + e.targetTouches[0].clientX - _startX) + 'px';
    dragObj.style.top = (_offsetY + e.targetTouches[0].clientY - _startY) + 'px';

}

function getMousePos(event) {
    var e = event || window.event;
    return { 'x': e.clientX, 'y': clientY }
}

window.addEventListener("load", init, false);


function init() {
    // Adding event listener for adding note
    var btnNote = document.getElementById("addNote");
    btnNote.addEventListener("click", function () { addNote(); }, false);

    // Adding event listener for deleting stickies
    var btnRemove = document.getElementById("removeAllNote");
    btnRemove.addEventListener("click", function () { deleteNotesAll(); }, false);

    // Adding event listener for clustering stickies based on color
    var btnColor = document.getElementById("heirarchical");
    btnColor.addEventListener("click", function () { heirarchical_clustering(); }, false);

    // Adding event listener for clustering stickies based on color
    var btnColor = document.getElementById("kmean");
    btnColor.addEventListener("click", function () { kmean_clustering(); }, false);

    // Adding event listener for clustering stickies based on color
    var btnColor = document.getElementById("voronoi");
    btnColor.addEventListener("click", function () { voronoi(); }, false);


    // Adding event listener for searching sticky based on color
    var btnSearchNote = document.getElementById("searchNote");
    // btnSearchNote.addEventListener("click", function () { searchSticky(document.querySelector("input").value); }, false);
    btnSearchNote.addEventListener("click", function () { searchSticky(); }, false);


    loadData();
    // Add event listeners

}


function heirarchical_clustering() {
    // Array creation
    var arr = new Array(10);
    for (var i = 0; i < 10; i++) {
        arr[i] = new Array();
    }

    // colorBg.options.add(new Option("", "#EF9A9A"));
    // colorBg.options.add(new Option("", "#CE93D8"));
    // colorBg.options.add(new Option("", "#81D4FA"));
    // colorBg.options.add(new Option("", "#80CBC4"));
    // colorBg.options.add(new Option("", "#C5E1A5"));
    // colorBg.options.add(new Option("", "#FFF59D"));
    // colorBg.options.add(new Option("", "#FFCC80"));
    // colorBg.options.add(new Option("", "#BCAAA4"));
    // colorBg.options.add(new Option("", "#F48FB1"));
    // colorBg.options.add(new Option("", "#9FA8DA"));

    // Count same colored stickies and store in array with sticky keys
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var values = localStorage.getItem(key);
        var value = JSON.parse(values);

        if (value[0].color == "#EF9A9A") {
            arr[0].push(key);
        }
        else if (value[0].color == "#CE93D8") {
            arr[1].push(key);
        }
        else if (value[0].color == "#81D4FA") {
            arr[2].push(key);
        }
        else if (value[0].color == "#80CBC4") {
            arr[3].push(key);
        }
        else if (value[0].color == "#C5E1A5") {
            arr[4].push(key);
        }
        else if (value[0].color == "#FFF59D") {
            arr[5].push(key);
        }
        else if (value[0].color == "#FFCC80") {
            arr[6].push(key);
        }
        else if (value[0].color == "#BCAAA4") {
            arr[7].push(key);
        }
        else if (value[0].color == "#F48FB1") {
            arr[8].push(key);
        }
        else if (value[0].color == "#9FA8DA") {
            arr[9].push(key);
        }

    }

    // Get the dimensions of the screen
    var height = window.screen.height;
    var width = window.screen.width;

    var pos_x = 80, pos_y = 20;
    var start_x = divOffset, start_y = 20;

    for (var i = 0; i < 10; i++) {
        var count = arr[i].length;

        if (count > 0) {
            pos_x = start_x, pos_y = start_y;
            for (var j = 0; j < count; j++) {
                key = arr[i].pop();
                sticky_position_change(key, pos_x, pos_y);
                pos_y += 230;
                if ((pos_y + 230) > height) {
                    pos_y = 20;
                    pos_x += 250;
                }
            }
            start_x = pos_x + 250;
            start_y = 20;
            count = 0;
        }
    }

}

function searchSticky() {

    var h = window.screen.height/2 + 100;
    var w = window.screen.width - 500;
    var input = document.createElement("input");
    input.setAttribute("id", "tbInputText");
    input.setAttribute("placeholder", "Search text here!");
    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = w + "px";
    input.style.top = h + "px";
    input.style.width = 150 + "px";
    input.style.height = 50 + "px";
    input.style.backgroundColor = "yellow";

    document.body.appendChild(input);
    input.addEventListener('keydown', function (event) {
        if (event.keyCode == 13) {
            search_text = document.getElementById('tbInputText').value;
            document.getElementById("tbInputText").remove();
            move_position_sticky(search_text);
        }
        if (event.keyCode == 27) {
            document.getElementById("tbInputText").remove();
        }



    });

}

function move_position_sticky(search_text) {

    var count = 0;
    var sticky_key = 0;
    var original_x = 0, original_y = 0;

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var values = localStorage.getItem(key);
        var value = JSON.parse(values);


        var str1 = value[0].text; // Text in stickies
        var n = str1.search(new RegExp(search_text, "i"));
        if (n != -1) {
            original_x = value[0].notePositionLeft;
            original_y = value[0].notePositionTop;
            break;
        }
    }
    if (n != -1) {
        var height = window.screen.height/2 + 100;
        var width = window.screen.width - 500;
        document.getElementById(key).style.top = height + "px";
        document.getElementById(key).style.left = width + "px";
        var sticky = document.getElementById(key);
        sticky.addEventListener('keydown', function (event) {
            if (event.keyCode == 13) {
                sticky_position_change(key, original_x, original_y);
            }
        });
    }


}

function sticky_position_change(key, new_x, new_y) {
    document.getElementById(key).style.left = new_x + "px";
    document.getElementById(key).style.top = new_y + "px";
    //saveNote(key);
}

function kmean_clustering() {
    // Array creation
    var arr = new Array(10);
    for (var i = 0; i < 10; i++) {
        arr[i] = 0;
    }

    var sticky_positions = new Array(localStorage.length);

    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var values = localStorage.getItem(key);
        var value = JSON.parse(values);

        if (value[0].color == "#EF9A9A") {
            arr[0]++;
            sticky_positions[i] = [key, value[0].notePositionLeft, value[0].notePositionTop, 0];
        }
        else if (value[0].color == "#CE93D8") {
            arr[1]++;
            sticky_positions[i] = [key, value[0].notePositionLeft, value[0].notePositionTop, 1];
        }
        else if (value[0].color == "#81D4FA") {
            arr[2]++;
            sticky_positions[i] = [key, value[0].notePositionLeft, value[0].notePositionTop, 2];
        }
        else if (value[0].color == "#80CBC4") {
            arr[3]++;
            sticky_positions[i] = [key, value[0].notePositionLeft, value[0].notePositionTop, 3];
        }
        else if (value[0].color == "#C5E1A5") {
            arr[4]++;
            sticky_positions[i] = [key, value[0].notePositionLeft, value[0].notePositionTop, 4];
        }
        else if (value[0].color == "#FFF59D") {
            arr[5]++;
            sticky_positions[i] = [key, value[0].notePositionLeft, value[0].notePositionTop, 5];
        }
        else if (value[0].color == "#FFCC80") {
            arr[6]++;
            sticky_positions[i] = [key, value[0].notePositionLeft, value[0].notePositionTop, 6];
        }
        else if (value[0].color == "#BCAAA4") {
            arr[7]++;
            sticky_positions[i] = [key, value[0].notePositionLeft, value[0].notePositionTop, 7];
        }
        else if (value[0].color == "#F48FB1") {
            arr[8]++;
            sticky_positions[i] = [key, value[0].notePositionLeft, value[0].notePositionTop, 8];
        }
        else if (value[0].color == "#9FA8DA") {
            arr[9]++;
            sticky_positions[i] = [key, value[0].notePositionLeft, value[0].notePositionTop, 9];
        }

    }

    var count = 0;
    // Different colors used
    for (var i = 0; i < 10; i++) {
        if (arr[i] > 0) count++;
    }

    // centroids arrays.
    //centroids[][0] is x-coordinate
    //centroids[][1] is y-coordinate
    var centroids = new Array(count);
    for (var i = 0; i < count; i++) {
        centroids[i] = random_position();
    }
    var kk = 0;
    while(kk<5){
        var all_dist_colors = kmean(sticky_positions, centroids, count, arr);


        for (var i = 0; i < all_dist_colors.length; i++) {
            var x_avg = 0;
            var y_avg = 0;
            var count_avg = 0;
            for (var j = 0; j < sticky_positions.length; j++) {
                if (all_dist_colors[i][j][1] !== -1){
                    sticky_position_change(all_dist_colors[i][j][0], all_dist_colors[i][j][3], all_dist_colors[i][j][4]);
                    x_avg += parseFloat(all_dist_colors[i][j][3]);
                    y_avg += parseFloat(all_dist_colors[i][j][4]);
                    count_avg++;
                }
            }
            centroids[i][0] = x_avg/count_avg;
            centroids[i][1] = y_avg/count_avg;
        }
        kk++;
        all_dist_colors = [];
    }

}

// Generate a random position on the screen
function random_position() {

    // Get the dimensions of the screen
    var height = window.screen.height;
    var width = window.screen.width;

    return [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
}

// sticky_positions[i] => [key, notePositionLeft, notePositionTop, color_number];
// centroids => centroids[][0] : x position, centroids[][1] : y position
function kmean(sticky_positions, centroids, k, arr) {

    var visited = new Array(sticky_positions.length);
    var all_dist_colors = new Array();
    for (var i = 0; i < k; i++) {
        var centroid = centroids[i];
        all_dist_colors.push(euclidian_distance(sticky_positions, centroid));
    }
    // console.log(all_dist_colors[0][0]);


    for (var i = 0; i < sticky_positions.length; i++) {
        var small = 9999999;
        var key_small = '';
        // Find the closest sticky to the centroid
        for (var j = 0; j < k; j++) {
            if (all_dist_colors[j][i][1] < small) {
                small = all_dist_colors[j][i][1];
                key_small = all_dist_colors[j][j][0];
            }
        }
        // Remove duplicate stickies assigned to all clusters
        for (var j = 0; j < k; j++) {
            // c1 = parseInt(key_small);
            // c2 = parseInt(all_dist_colors[j][i][0]);
            if (small !== all_dist_colors[j][i][1]) {
                all_dist_colors[j][i][0] = -1;
                all_dist_colors[j][i][1] = -1;
                all_dist_colors[j][i][2] = -1;
            }
        }
    }

    // Exchange of stickies between clusters
    for (var cluster_id = 0; cluster_id < all_dist_colors.length; cluster_id++) {
        var swap_x;
        var swap_y;
        var cost = 999;
        var swap_check = -1;
        for (var i = 0; i < sticky_positions.length; i++) {
            if (all_dist_colors[cluster_id][i][2] !== -1) {
                for (var j = 0; j < k; j++) {
                    if (j > cluster_id) {
                        // temp : [cost, swap_index_best]
                        var temp = cost_eval(all_dist_colors[cluster_id][i][2], all_dist_colors[j]);
                        if (temp[0] === 1 && temp[1] < cost) {
                            cost = temp[1];
                            swap_x = all_dist_colors[cluster_id][i];
                            var x1 = cluster_id;
                            var x2 = i;
                            swap_y = all_dist_colors[j][temp[2]];
                            var y1 = j;
                            var y2 = temp[2];
                            swap_check = 1;
                        }
                    }
                }
            }
        }
        //////// Swap here
        if (swap_check === 1) {

            var temp1 = all_dist_colors[x1][x2];
            var temp2_a = all_dist_colors[y1][y2][3];
            var temp2_b = all_dist_colors[y1][y2][4];

            all_dist_colors[x1][x2] = all_dist_colors[y1][y2];
            all_dist_colors[y1][y2] = temp1;

            all_dist_colors[x1][x2][3] = temp1[3];
            all_dist_colors[x1][x2][4] = temp1[4];

            all_dist_colors[y1][y2][3] = temp2_a;
            all_dist_colors[y1][y2][4] = temp2_b;

        }
    }

    // Update centroids with latest values
    for (var i = 0; i < all_dist_colors.length; i++) { // All clusters
        var x = 0;
        var y = 0;
        var count = 0;
        for (var j = 0; j < sticky_positions.length; j++) { // All stickies in a given cluster  
            for (var k = 0; k < sticky_positions.length; k++) {
                if (parseInt(all_dist_colors[i][j][0]) === parseInt(sticky_positions[k][0])) {
                    count++;
                    var temp_x = parseInt(sticky_positions[k][1]);
                    var temp_y = parseInt(sticky_positions[k][2]);
                    x += temp_x;
                    y += temp_y;
                }
            }
        }
        centroids[i][0] = x / count;
        centroids[i][1] = y / count;
    }

    return all_dist_colors;
}

function euclidian_distance(sticky_positions, centroid) {
    var distance = 0;

    var height = window.screen.height;
    var width = window.screen.width;
    ref_distance = Math.sqrt(Math.pow((width / 2), 2) + Math.pow((height / 2), 2));

    var dist_colors = new Array();
    for (var i = 0; i < sticky_positions.length; i++) {
        d1 = parseInt(sticky_positions[i][1], 10) - centroid[0];
        d2 = parseInt(sticky_positions[i][2], 10) - centroid[1];
        distance = Math.sqrt(Math.pow(d1, 2) + Math.pow(d2, 2));
        // console.log(d1);
        // console.log(d2);
        // console.log(ref_distance);
        // if(distance <= ref_distance){
        dist_colors.push([sticky_positions[i][0], distance, sticky_positions[i][3], sticky_positions[i][1], sticky_positions[i][2]]);
        // }
    }
    // console.log(dist_colors);
    return dist_colors;
}

function cost_eval(ref_val, cluster_colors) {
    var cost = 0;
    var temp_swap_index = -1;
    var check_for_swap = -1;
    for (var i = 0; i < cluster_colors.length; i++) {
        if (ref_val === cluster_colors[i][2]) {
            cost -= 999;
        }
        if (ref_val !== cluster_colors[i][2] && cluster_colors[i][2] !== -1) {
            check_for_swap = 1;
            temp_swap_index = i;
            cost += 999;
        }
    }

    return [check_for_swap, cost, temp_swap_index];
}

function voronoi(){
        // Array creation
        var arr = new Array(10);
        for (var i = 0; i < 10; i++) {
            arr[i] = new Array();
        }
    
        // Count same colored stickies and store in array with sticky keys
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            var values = localStorage.getItem(key);
            var value = JSON.parse(values);
    
            if (value[0].color == "#EF9A9A") {
                arr[0].push(key);
            }
            else if (value[0].color == "#CE93D8") {
                arr[1].push(key);
            }
            else if (value[0].color == "#81D4FA") {
                arr[2].push(key);
            }
            else if (value[0].color == "#80CBC4") {
                arr[3].push(key);
            }
            else if (value[0].color == "#C5E1A5") {
                arr[4].push(key);
            }
            else if (value[0].color == "#FFF59D") {
                arr[5].push(key);
            }
            else if (value[0].color == "#FFCC80") {
                arr[6].push(key);
            }
            else if (value[0].color == "#BCAAA4") {
                arr[7].push(key);
            }
            else if (value[0].color == "#F48FB1") {
                arr[8].push(key);
            }
            else if (value[0].color == "#9FA8DA") {
                arr[9].push(key);
            }
    
        }
        // Setting the initial values
        var pos_x = 0, pos_y = 0;
        var start_x = 0, start_y = 0;
        for (var i = 0; i < 10; i++) {
            var count = arr[i].length;
    
            if (count > 0) {
                var temp = random_position();
                start_x = temp[0];
                start_y = temp[1];
                pos_x = start_x, pos_y = start_y;
                for (var j = 0; j < count; j++) {
                    key = arr[i].pop();
                    sticky_position_change(key, pos_x, pos_y);
                    pos_x+=30;
                    pos_y+=20;
                }
            }
        }
}