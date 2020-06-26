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
        divLeft += 200;
        if (divLeft >= 1200) {
            divTop += 200;
            divLeft = 50;
        }
    }
    else {
        divLeft = 50;
    }

    if (values.length == 0) {

        var values = [];
        var initValue = {};
        initValue['text'] = "";
        initValue['color'] = '#CCFFCC';
        initValue['notePositionLeft'] = divLeft;
        initValue['notePositionTop'] = divTop;
        initValue['pen'] = "";
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
    if (values[0]['color']) {
        mainDiv.style.backgroundColor = values[0]['color'];
    }
    colorBg.setAttribute("onclick", "changeColor('" + id + "')");

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
    var numSpan = createNumSpan(values[0]["text"],inputLimit);
    mainDiv.appendChild(titleDiv);
    mainDiv.appendChild(contentDiv);
    mainDiv.appendChild(numSpan);
    document.body.appendChild(mainDiv);
    limitInput(contentDiv,inputLimit);
}

// Move the note
var dragObj;
var _startX = 0;
var _startY = 0;
var _offsetX = 0;
var _offsetY = 0;
var z = 0;
var noteLocation;
function createNumSpan(text,inputLimit) {
    // var intNum = document.createElement("div");
    var numSpan = document.createElement("span");
    numSpan.setAttribute("class","counter");
    numSpan.innerText = text.length+"/"+inputLimit;
    return numSpan;
}
function createTextContent(text,id,isText){
    // only text input editable
    var contentDiv = document.createElement("div");
    contentDiv.innerText = text;
    contentDiv.setAttribute("class", "noteContent");
    contentDiv.setAttribute("contenteditable", "true");
    contentDiv.setAttribute("onblur", "saveNote('" + id + "')");
    contentDiv.setAttribute("textInput",isText);
    contentDiv.style.width = "100%";
    contentDiv.style.height = "80%";
    return contentDiv;
}

function limitInput(noteContent,length=10) {
    //reference source https://codepen.io/ramonsenadev/pen/jywRQg by 25.06.2020
    var counter = noteContent.parentNode.childNodes[2];
    input = noteContent;
    settings = {
        maxLen: length,
    }
    keys = {
        'backspace': 8,
        'shift': 16,
        'ctrl': 17,
        'alt': 18,
        'delete': 46,
        // 'cmd':
        'leftArrow': 37,
        'upArrow': 38,
        'rightArrow': 39,
        'downArrow': 40,
    }
    utils = {
        special: {},
        navigational: {},
        isSpecial(e) {
            return typeof this.special[e.keyCode] !== 'undefined';
        },
        isNavigational(e) {
            return typeof this.navigational[e.keyCode] !== 'undefined';
        }
    }
    utils.special[keys['backspace']] = true;
    utils.special[keys['shift']] = true;
    utils.special[keys['ctrl']] = true;
    utils.special[keys['alt']] = true;
    utils.special[keys['delete']] = true;
    utils.navigational[keys['upArrow']] = true;
    utils.navigational[keys['downArrow']] = true;
    utils.navigational[keys['leftArrow']] = true;
    utils.navigational[keys['rightArrow']] = true;
    input.addEventListener('keyup', function(event) {
        let len = event.target.innerText.trim().length;
        counter.innerHTML = len+"/"+length;
        if (len >= settings.maxLen && !hasSelection) {
            event.preventDefault();
            return false;
        }
    });
    input.addEventListener('keydown', function(event) {
        let len = event.target.innerText.trim().length;
        hasSelection = false;
        selection = window.getSelection();
        isSpecial = utils.isSpecial(event);
        isNavigational = utils.isNavigational(event);

        if (selection) {
            hasSelection = !!selection.toString();
        }
        if (isSpecial || isNavigational) {
            return true;
        }
        if (len >= settings.maxLen && !hasSelection) {
            event.preventDefault();
            return false;
        }
    });
}

function mousedownHandler(e) {

    if (e.target.className == 'noteTitle') {
        //locate the note
        dragObj = e.target.parentNode;
        var t = dragObj.style.top;
        var l = dragObj.style.left;
        z += 1;
        dragObj.setAttribute("style", "top:" + t + ";left:" + l + ";z-index:" + z);
        _startX = e.targetTouches[0].clientX;
        _startY = e.targetTouches[0].clientY;
        _offsetX = dragObj.offsetLeft;
        _offsetY = dragObj.offsetTop;
        document.addEventListener("touchmove", mousemoveHandler, false);
        //dierctly way to do
        $('html,body').css('height', '100%').css('overflow', 'hidden');
    }
    if (e.target.className == "noteContent") {
        console.log("notecontent touched");
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
            //console.log("svgtouched");
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
        //console.log("rotate");
        var noteId = e.target.parentNode.parentNode.getAttribute("id");
        var obj = document.getElementById(noteId);
        //obj.style.transform = "rotate(90deg)";
        //as width = 180, width = 170
        var rotateButton = obj.childNodes[0].childNodes[5];
        rotateButton.addEventListener("touchstart",function(e){
            e.preventDefault();
            var center_x =(obj.offsetLeft)+(90);
            var center_y = (obj.offsetTop)+ (85);
            // var touch_x = e.targetTouches[0].pageX;
            // var touch_y = e.targetTouches[0].pageY;
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
    console.log("clear");
    var obj = document.getElementById(key);
    var isText = obj.childNodes[1].getAttribute("textInput");
    if(isText=='true'){
        obj.childNodes[1].innerText = "";
    }else {
        obj.childNodes[1].firstChild.remove(obj.childNodes[1].firstChild.childNodes);
    }
}
function penInput(key) {
    //switch container to svg
    //locate mainDiv
    var obj = document.getElementById(key);
    var nodeName = obj.childNodes[1].nodeName;
    if(nodeName == "DIV"){
        var isTextInput = obj.childNodes[1].getAttribute("textInput");
        console.log("pen "+isTextInput);
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
            var numSpan = createNumSpan(tempData[key],inputLimit);
            obj.appendChild(numSpan);
            limitInput(obj.childNodes[1],inputLimit);
        }
    }
}

function textInput(key) {
    //switch container back to text
    var obj = document.getElementById(key);
    var nodeName = obj.childNodes[1].nodeName;

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


    console.log("insave"+obj.childNodes[1].getAttribute("textInput"));
    var isText = obj.childNodes[1].getAttribute("textInput");
    if(isText=='true'){
        value['text'] = obj.childNodes[1].innerText;
        value['pen'] =tempPenData[key];
        console.log(value['pen']);

    }else {
        console.log(obj.childNodes[1].firstChild);
        value['pen'] = obj.childNodes[1].firstChild.outerHTML;
        console.log(value['pen']);
        value['text'] = tempData[key];
    }
    var color = obj.firstElementChild.childNodes[2];
    var selectedColor = color.options[color.options.selectedIndex].value;
    value['color'] = selectedColor;

    var notePositionLeft = obj.style.left;
    var notePositionTop = obj.style.top;
    console.log("notePosition " + notePositionLeft, notePositionTop);
    value['notePositionLeft'] = notePositionLeft.replace("px", "");
    value['notePositionTop'] = notePositionTop.replace("px", "");

    values.push(value);
    values = JSON.stringify(values);
    if (values.length > 0) {
        //save to storage
        localStorage.setItem(key, values);
        console.log(values);

    }
}

//reload from local
function loadData() {
    //key,value as json，passed to addNote
    var idLength = 0;
    var idArray = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        var values = localStorage.getItem(key);
        var value = JSON.parse(values);
        idLength++;
        idArray.push(key);
        addNote(key, value);
    }

    //test line link when note num is 2
    if (idLength == 2) {
        //link(idArray);
    }


}
//delete note
function deleteNote(key) {
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

    obj.style.backgroundColor = selectedColor;
    saveNote(id);

}

function mouseupHandler(e) {
    // //after moving it will save the note automatically
    $('html,body').removeAttr('style');
    document.removeEventListener("touchmove", mousemoveHandler, false);
    saveNote(e.target.parentNode.id);

    // document.removeEventListener("mousemove", mousemoveHandler, false);

}
function mousemoveHandler(e) {
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
    var btnColor = document.getElementById("clusterColorStickies");
    btnColor.addEventListener("click", function () { clusterColorStickies(); }, false);


    // Adding event listener for searching sticky based on color
    var btnSearchNote = document.getElementById("searchNote");
    // btnSearchNote.addEventListener("click", function () { searchSticky(document.querySelector("input").value); }, false);
    btnSearchNote.addEventListener("click", function () { searchSticky(); }, false);


    loadData();
    // Add event listeners
    document.addEventListener("touchstart", mousedownHandler, false);
    document.addEventListener("touchend", mouseupHandler, false);
}


function clusterColorStickies() {

    // Array creation
    var arr = new Array(10);
    for(var i=0;i<10; i++){
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
        else if (value[0].color == "#CE93D8"){
            arr[1].push(key);
        }
        else if (value[0].color == "#81D4FA"){
            arr[2].push(key);
        }
        else if (value[0].color == "#80CBC4"){
            arr[3].push(key);
        }
        else if (value[0].color == "#C5E1A5"){
            arr[4].push(key);
        }
        else if (value[0].color == "#FFF59D"){
            arr[5].push(key);
        }
        else if (value[0].color == "#FFCC80"){
            arr[6].push(key);
        }
        else if (value[0].color == "#BCAAA4"){
            arr[7].push(key);
        }
        else if (value[0].color == "#F48FB1"){
            arr[8].push(key);
        }
        else if (value[0].color == "#9FA8DA"){
            arr[9].push(key);
        }

    }
    // console.log(arr[0].length);      
    // Get the dimensions of the screen
    var height = window.screen.height;
    var width = window.screen.width;

    var pos_x = 0, pos_y = 0;
    var start_x = 0, start_y = 0;

    for(var i=0;i<10;i++){
        var count = arr[i].length;
        if(count>0){
            pos_x = start_x, pos_y = start_y;
            for(var j=0; j<count; j++){
                key = arr[i].pop();
                sticky_position_change(key,pos_x,pos_y);
                pos_y+= 180;
                if((pos_y+180) > height){
                    pos_y = 0;
                    pos_x += 220;
                }
            }
            start_x = pos_x + 220;
            start_y = 0;
            count = 0;
        }
    }

}

function searchSticky() {

    var h = window.screen.height - 280;
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
            console.log("keydown");
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

    // console.log(search_text);
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
        var height = window.screen.height - 300;
        var width = window.screen.width - 300;
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

function sticky_position_change(key,new_x, new_y){
    document.getElementById(key).style.left = new_x + "px";
    document.getElementById(key).style.top = new_y + "px";
    saveNote(key);
}
