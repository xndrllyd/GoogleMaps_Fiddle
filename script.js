var map,
    world = new google.maps.LatLng(40.97990, 1.40625),
    usa = new google.maps.LatLng(39.77477, -98.61328),
    uk = new google.maps.LatLng(54.11094, -4.57031),
    url
    btns = [];

function initialize() {
    var options = {
            center: world,
            zoom: 1,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        marker = [],
        elm = document.getElementById("buttons").firstChild;
        
    map = new google.maps.Map(document.getElementById("map"),
        options);
        
    var myRequest = new XMLHttpRequest();
    myRequest.open("GET", "assets/coords.json", true);
    myRequest.onreadystatechange = response;
    myRequest.send(null);
    
    function response() {
        if(myRequest.readyState == 4) {
            if(myRequest.status == 200) {
                var items = eval('(' + myRequest.responseText + ')');
                for (var i = 0; i < items.length; i++) {
                    var coords = new google.maps.LatLng(items[i].lat, items[i].lng)
                    marker[i] = new google.maps.Marker({
                        position: coords,
                        map: map
                    });
                    
                    url = "assets/" + items[i].loc + ".json";
                    attachInfo(marker[i]);
                }
            }
            else {
                alert("An error has occurred: " + myRequest.statusText);
            }
        }
    }
    
    do { btns.push(elm);
    } while (elm = elm.nextSibling);
}

function attachInfo(marker) { 
    var text = "",
        myRequest = new XMLHttpRequest();

    myRequest.open("GET", url, true);
    myRequest.onreadystatechange = response;
    myRequest.send(null);
    
    function response() {
        if(myRequest.readyState == 4) {
            if(myRequest.status == 200) {
                var items = eval('(' + myRequest.responseText + ')');

                for (var i = 0; i < items.length; i++) {
                    
                    text += items[i] + "<br />";
                }
                var infowindow = new google.maps.InfoWindow(
                {
                    content: text
                });
                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map,marker);
                });
                google.maps.event.addListener(map,'click',function() {
                    infowindow.close();
                    map.setCenter(world);
                });
            }
            else {
                alert("An error has occurred: " + myRequest.statusText);
            }
        } 
    }
}

function changeLocation(location) {
    for(var i = 0; i < btns.length; i++) {
        btns[i].className = "";
    }

    event.target.className = "active";

    switch(location) {
        case "USA":
            map.setCenter(usa)
            map.setZoom(3);
            break;
        case "UK":
            map.setCenter(uk);
            map.setZoom(5);
            break
        default:
            map.setCenter(world)
            map.setZoom(1); 
    }
}

