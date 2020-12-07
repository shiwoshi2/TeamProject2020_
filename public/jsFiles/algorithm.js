
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
    while(kk<50){
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
        console.log(kk);
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

    //var visited = new Array(sticky_positions.length);
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
                key_small = all_dist_colors[j][i][0];
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
        //  if(distance <= ref_distance){
        // ref_distance= distance;
        dist_colors.push([sticky_positions[i][0], distance, sticky_positions[i][3], sticky_positions[i][1], sticky_positions[i][2]]);
         //}
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
