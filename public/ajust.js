function adjustToFreezeWidth(rootSvg) {
    var windowWidth =  parseInt(window.innerWidth);
    var windowHeight =  parseInt(window.innerWidth);

   /* var viewBoxVal = rootSvg.getAttribute("viewBox");
    var viewBoxWidth = viewBoxVal.split(",")[2];
    var viewBoxHeight = viewBoxVal.split(",")[3];
    
    var setHeight = (setWidth * viewBoxHeight) / viewBoxWidth;*/
    rootSvg.removeAttribute("width");
    rootSvg.removeAttribute("height");

    var setWidth = windowWidth ? windowWidth : parseInt(rootSvg.style("width"));
    var setHeight = windowHeight ? windowHeight : parseInt(rootSvg.style("height"));

    rootSvg.setAttribute("width", setWidth);
    rootSvg.setAttribute("height", setHeight);
}
 
function adjustToNone(rootSvg) {
 
    var viewBoxVal = rootSvg.getAttribute("viewBox");
    var viewBoxWidth = viewBoxVal.split(",")[2];
    var viewBoxHeight = viewBoxVal.split(",")[3];
    rootSvg.removeAttribute("width");
    rootSvg.removeAttribute("height");
 
    rootSvg.setAttribute("width", viewBoxWidth);
    rootSvg.setAttribute("height", viewBoxHeight);
 
}
 
function adjustToFreezeHeight(rootSvg) {
 
    var windowHeight = $(window).height();
 
    var viewBoxVal = rootSvg.getAttribute("viewBox");
    var viewBoxWidth = viewBoxVal.split(",")[2];
    var viewBoxHeight = viewBoxVal.split(",")[3];
    rootSvg.removeAttribute("width");
    rootSvg.removeAttribute("height");
 
    var setHeight = windowHeight;
    var setWidth = (setHeight * viewBoxWidth)/viewBoxHeight;
    rootSvg.setAttribute("width", setWidth);
    rootSvg.setAttribute("height", setHeight);
}
 
function adjustToFreezeAll(rootSvg) {
 
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    
    rootSvg.removeAttribute("width");
    rootSvg.removeAttribute("height");
 
    rootSvg.setAttribute("width", windowWidth);
    rootSvg.setAttribute("height", windowHeight);
 
}