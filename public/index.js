
//for pen input just a test now
var strPth = [];
var svgNS = "http://www.w3.org/2000/svg";
//var rectBound = svgElement.getBoundingClientRect();
var displaySize = 1030;
var divOffset = 50;
function NoteOffset(a){
   
    

    
    if (a == 2500)
    {
        displaySize = 1850;
        divOffset = 200;
    };

    if (a == 800)
    {
        displaySize = 500;
        divOffset = 50;
    };
    
    addNote();
}