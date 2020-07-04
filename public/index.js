
//for pen input just a test now
var strPth = [];
var svgNS = "http://www.w3.org/2000/svg";
var bGWidth = 0;
//var rectBound = svgElement.getBoundingClientRect();
var socket = io();
var displaySize = 1030;
var divOffset = 50;
function NoteOffset(device){
    if (device == "wall")
    {
        displaySize = 1850;
        divOffset = 200;
    };

    if (device == "smartPhone")
    {
        displaySize = 500;
        divOffset = 50;
    };
    
}
