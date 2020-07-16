const socket = new WebSocket("ws://188.227.86.17:2000");

var load_page = {
    load:function(){
        let dataStr = location.search;
        dataStr = decodeURIComponent(dataStr);
        let n = dataStr.indexOf('&');
        let name = dataStr.substring(6, n).replace(/_/, ' ');
        let image = dataStr.substring(n + 7, dataStr.length);
        document.querySelector("main #profile a > #image").src = image;
        document.querySelector("main #profile > a").href = image;
        //document.querySelector("main #profile > #image").addEventListener("click", navigation.zoom(this));
        document.querySelector("main #profile > #name").innerText = name;
        document.querySelector("head title").innerText = name;
        document.querySelector("header div #user > i").innerText = name;

        let reqst = {
            login:name,
            type:"profileus"
        }
        let json = JSON.stringify(reqst);
        socket.onopen = () => socket.send(prtclEnc.encode(json));
        socket.onmessage = function(msg){
            let data = JSON.parse(prtclEnc.decode(msg.data));
            if(data.type == "profilus"){
                let about = data.about;
                document.querySelector("main #profile > #about").innerText = about;
            }
        }
    }
}

var navigation = {
    back: () => window.history.back(),
    pages: page => document.location.href = page
}

var prtclEnc = {
    encode: data => btoa(unescape(encodeURIComponent(data))),
    decode: data => decodeURIComponent(escape(atob(data)))
}