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
