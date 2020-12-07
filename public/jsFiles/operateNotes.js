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
    document.body.addEventListener("touchstart", selectNote, {passive: false});
    document.body.addEventListener("touchend", removeSelectNote, {passive: false});

}




