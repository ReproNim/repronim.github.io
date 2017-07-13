// See file COPYING distributed with hypothesis-widget for
// copyright and license.

var h_months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function h_activate_feed(feed_div) {

    var tag = feed_div.getAttribute("data-hypothesis-tag");
    if(!tag) {
        throw "no tag defined";
    }

    var loading_text = feed_div.getAttribute("data-hypothesis-loading");
    if(!loading_text) {
        loading_text = "Loading...";
    }

    var none_text = feed_div.getAttribute("data-hypothesis-none");
    if(!none_text) {
        none_text = "No annotations found.";
    }

    var error_text = feed_div.getAttribute("data-hypothesis-error");
    if(!error_text) {
        error_text = "Error loading annotations.";
    }

    feed_div.innerHTML = loading_text;

    var req = new XMLHttpRequest();

    req.onreadystatechange = function() {

        /// wait for DONE
        if(req.readyState != 4) {
            return;
        }

        if(req.status == 200) {

            var obj = eval("(" + req.responseText + ")");
            var i;

            if(obj.rows.length == 0) {
                feed_div.innerHTML = none_text;
                return;
            }

            feed_div.innerHTML = "";

            for(i = 0;i < obj.rows.length;i++) {

                var row = obj.rows[i];
                var d = new Date(row.updated);
                var date_string;
                var div;
                var link_text;

                link_text = row.text;
                if(link_text.length == 0) {
                    link_text = row.document.title;
                }

                if(link_text.length == 0) {
                    link_text = row.uri;
                }

                date_string = h_months[d.getMonth()]
                              + " "
                              + d.getDate()
                              + ", "
                              + d.getFullYear();

                div = document.createElement("div");
                div.className = "item";
                div.innerHTML = "<div class='date'>" + date_string + "</div>"
                                + "<div class='text'>"
                                + "<a class='text-danger' href='" + row.uri + "'>"
                                + link_text
                                + "</a>";
                                + "</div>";
                feed_div.appendChild(div);
            }

        } else { // req.status != 200

            feed_div.innerHTML = error_text;

        }

    }

    url = "https://hypothes.is/api/search?tag="
          + tag
          + "&limit=5&sort=updated&order=desc";
    req.open("GET", url, true);
    req.setRequestHeader("Content-type", "application/json");
    req.send();

    return;

} // end h_activate_feed()

function h_activate_feeds() {

    var divs = document.getElementsByTagName("div");
    var i;

    for(i = 0;i < divs.length;i++) {

        var classes = divs[i].className.split(" ");
        var j;

        for(j = 0;j < classes.length;j++) {
            if(classes[j] == "hypothesis-feed") {
                try {
                    h_activate_feed(divs[i]);
                } catch(e) {
                    if(e == "no tag defined") {
                        console.log("hypothesis-feed div found with not tag");
                    } else {
                        throw(e);
                    }
                }
                break;
            }
        }

    }

    return;

} // end h_activate_feeds()

// eof
