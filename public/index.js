//for pen input just a test now
var svgNS = "http://www.w3.org/2000/svg";
var socket = io();
var displaySize = window.screen.width;
var divOffset = 50;
var colorIndex = ["#EF9A9A", "#CE93D8", "#81D4FA", "#80CBC4", "#C5E1A5", "#FFF59D", "#FFCC80", "#BCAAA4", "#F48FB1", "#9FA8DA"];
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

