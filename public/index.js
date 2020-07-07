//for pen input just a test now
var strPth = [];
var svgNS = "http://www.w3.org/2000/svg";
var bGWidth = 0;
//var rectBound = svgElement.getBoundingClientRect();
var socket = io();
var displaySize = window.screen.width;
var divOffset = 50;

//compute in every eqiupment the note offset
function NoteOffset(device){
    if (device == "wall")
    { 
       displaySize = window.screen.width-190-260;
       
        divOffset = 200;
    };

    if (device == "smartPhone")
    {displaySize=540;
      displaySize = window.screen.width-260;
        divOffset = 50;
    };
}

//ref:https://blog.csdn.net/zlq_CSDN/java/article/details/90543614
function colorRGBtoHex(color) {
    // console.log(color);
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).substring(1);
    var hex = hex.toUpperCase();
    //console.log(hex);
    return hex;
}

