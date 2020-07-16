const socket = new WebSocket("ws://188.227.86.17:2000");

var loadPage = {
    page: function(){
        document.querySelector("main #loader").style.display = "block";
        let text = decodeURI(location.search);
        let n = text.indexOf('&');
        let name = text.substring(6, n).replace(/_/, ' ');
        let image = text.substring(n + 7 , text.length);
        document.querySelector("#user > img").src = image
        document.querySelector("#user > p").innerText = name;
        document.querySelector("body").style.opacity = 1;

        let fromname = localStorage.getItem("name");
        let toname = document.querySelector("main #user > p").innerText;
        let firstconn = {
            id:localStorage.getItem("ID"),
            from:fromname,
            to:toname,
            type:"firstconn"
        }
        socket.onopen = () => socket.send(protocolEn.encode(JSON.stringify(firstconn)));
        this.onmsgs();
        document.querySelector("main #loader").style.display = "none";
        document.querySelector("main #controls > textarea").addEventListener("keydown", e => {if(e.keyCode == 13) contentSend.send()});
    },
    onmsgs:() => socket.onmessage = function(message){
        let data = JSON.parse(protocolEn.decode(message.data));
        if(data.type == "loadmsgs"){
            let struct = data.struct;
            let msg = data.msg;
            let first = data.first;
            let i = 0;
            let n = data.msg.length;
            while(i < n){
                let div = document.createElement("div");
                let p = document.createElement("p");
                if(first == localStorage.getItem("ID")){
                    div.style.marginLeft = struct[i] == 0 ? 0 : 47 + '%';
                }else div.style.marginLeft = struct[i] == 0 ? 47 + '%' : 0;
                p.innerText = msg[i];
                div.append(p);
                document.querySelector("main #panelMsgs").append(div);
                i++;
            }
        }else if(data.type == "justmsg"){
            if(data.filter == document.querySelector("main #user > p").innerText){
                let div = document.createElement("div");
                div.style.marginLeft = 47 + '%';
                let p = document.createElement("p");
                p.innerText = data.text;
                div.append(p);
                document.querySelector("main #panelMsgs").append(div);
            }else {
                let audio = document.querySelector("main audio");
                audio.play();
                document.querySelector("head title").innerText = "Новое сообщение";
            }
        }
        document.querySelector("main #panelMsgs").scrollTop = document.querySelector("main #panelMsgs").scrollHeight;
    }
}

var navigation = {
    back: () => window.history.back(),
    pages: (page) => document.location.href = page,
    profileus:function(){
        let name = document.querySelector("main #user > p").innerText;
        let image = document.querySelector("main #user > img").src;
        let itog = "profileus.html?name=" + name + "&image=" + image;
        this.pages(itog); 
    }
}

var contentSend = {
    send:function(){
        document.querySelector("main #loader").style.display = "block";
        let text = document.querySelector("main #controls > textarea").value;
        if(text == null || text == "") return;
        let fromid = localStorage.getItem("ID");
        let toname = document.querySelector("main #user > p").innerText;
        let data = {
            from:fromid,
            to:toname,
            message:text,
            type:"messageText"
        }

        socket.send(protocolEn.encode(JSON.stringify(data)));
        let div = document.createElement("div");
        let p = document.createElement("p");
        p.innerText = document.querySelector("main #controls > textarea").value;
        div.append(p);
        document.querySelector("main #panelMsgs").append(div);
        document.querySelector("main #controls > textarea").value = null;
        document.querySelector("main #panelMsgs").scrollTop = document.querySelector("main #panelMsgs").scrollHeight;
        socket.onmessage = function(message){
            let data = JSON.parse(protocolEn.decode(message.data));
            if(data.type == "justmsg"){
                if(data.filter == document.querySelector("main #user > p").innerText){
                    let div = document.createElement("div");
                    div.style.marginLeft = 47 + '%';
                    let p = document.createElement("p");
                    p.innerText = data.text;
                    div.append(p);
                    if(data.text != null) document.querySelector("main #panelMsgs").append(div);
                }else {
                    let audio = document.querySelector("main audio");
                    audio.play();
                    document.querySelector("head title").innerText = "Новое сообщение";
                }
            }
            document.querySelector("main #panelMsgs").scrollTop = document.querySelector("main #panelMsgs").scrollHeight;
        }
        document.querySelector("main #loader").style.display = "none";
    }
}

var protocolEn = {
    encode:text => btoa(unescape(encodeURIComponent(text))),
    decode:text => decodeURIComponent(escape(atob(text)))
}