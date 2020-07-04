function deleteNoteByIO(key) {
    var obj = document.getElementById(key);
    obj.parentNode.removeChild(obj);
    // localStorage
    localStorage.removeItem(key);
}

function updateNoteByIO(key = 0, values = []) {
    console.log("add1123");
    console.log("key"+typeof key);
    id = key;
    // for (var i = 0; i < localStorage.length; i++) {
    //     if(localStorage.key(i)==key){
    //         d = new Date().getTime();new Date().getTime();
    //     }
    // }
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
    if (values[0]['color']) {
        contentDiv.style.backgroundColor = values[0]['color'];
    }
    // var numSpan = createNumSpan(values[0]["text"],inputLimit);
    mainDiv.appendChild(titleDiv);
    mainDiv.appendChild(contentDiv);
    // mainDiv.appendChild(numSpan);
    document.body.appendChild(mainDiv);
    // limitInput(contentDiv,inputLimit);
    saveNoteByIO(id);
}
function saveNoteByIO(key) {
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
    var color = obj.firstElementChild.childNodes[2];
    var selectedColor = color.options[color.options.selectedIndex].value;
    value['color'] = selectedColor;
    var notePositionLeft = obj.style.left;
    var notePositionTop = obj.style.top;
    //console.log("notePosition " + notePositionLeft, notePositionTop);
    value['notePositionLeft'] = notePositionLeft.replace("px", "");
    value['notePositionTop'] = notePositionTop.replace("px", "");
    value['id'] = key;
    values.push(value);
    values = JSON.stringify(values);
    if (values.length > 0) {
        //save to storage
        localStorage.setItem(key, values);
    }
}