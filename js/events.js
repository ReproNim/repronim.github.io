function load_events(n=null) {

    events_div = document.getElementById("events");

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
        /// wait for DONE
        if(req.readyState != 4) {
            return;
        }
        if(req.status == 200) {
            var obj = eval("(" + req.responseText + ")");
            var i;
            events_div.innerHTML = "";
            for(i = 0;i < obj.length;i++) {
                a = document.createElement("a");
                a.href = obj[i][0];
                a.target = "_blank";
                a.innerHTML = obj[i][1];
                div = document.createElement("div");
                div.className = "event";
                div.appendChild(a);
                events_div.appendChild(div);
            }
        } else { // req.status != 200
            events_div.innerHTML = "There was an error getting the events.";
        }
    }

    if(n === null) {
        url = "http://www.virtualbrain.org/events_feed";
    } else {
        url = "http://www.virtualbrain.org/events_feed?n=" + n;
    }
    req.open("GET", url, true);
    req.send();

    return;

}

// eof
