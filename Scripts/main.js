const socket = new WebSocket("ws://188.227.86.17:2000");

var protocolEn = {
    encode: (text) => btoa(unescape(encodeURIComponent(text))),
    decode:text => decodeURIComponent(escape(atob(text)))
}

var Navigation = {
    pages: page => document.location.href = encodeURI(page)
}
var load_page = {
    load: function(){
        if(localStorage.getItem("name") == null || localStorage.getItem("name") == ""){
            document.getElementById("reg").style.display = "block";
            document.querySelector("header").style.display = "none";
            document.querySelector("main").style.display = "none";
            document.querySelector("footer").style.display = "none";
        }
        //document.querySelector("main audio").autoplay = null;
        this.prsentr();
        this.dialogs();
    },
    keyup:(elem) => document.querySelector(elem).value = document.querySelector(elem).value.replace('+', ''),
    prsentr:function(){
        document.querySelector("#reg #pass").addEventListener("keydown", e => {if(e.keyCode == 13) reg.input()});
        document.querySelector("#reg #repass1").addEventListener("keydown", e => {if(e.keyCode == 13) reg.register()});
        document.querySelector("#reg #name").addEventListener("keydown", e => {
            if(e.keyCode == 13) document.querySelector("#reg #pass").focus();
        });
        document.querySelector("#reg #name1").addEventListener("keydown", e => {
            if(e.keyCode == 13) document.querySelector("#reg #pass1").focus();
        });
        document.querySelector("#reg #pass1").addEventListener("keydown", e => {
            if(e.keyCode == 13) document.querySelector("#reg #repass1").focus();
        });
        document.querySelector("#search input").addEventListener("keydown", e => {if(e.keyCode == 13) searchUser.search()});
    },
    dialogs:function(){
        let dilgs = {
            id:localStorage.getItem("ID"),
            type:"getdlgs"
        }
        let json = JSON.stringify(dilgs);
        socket.onopen = () => socket.send(protocolEn.encode(json));
        socket.onmessage = function(message){
            let data = JSON.parse(protocolEn.decode(message.data));
            if(data.type == "getdlgs"){
                let n = data.nms.length;
                let i = 0;
                while(i < n){
                    let div = document.createElement("div");
                    let p = document.createElement("p");
                    let img = document.createElement("img");
                    p.innerText = data.nms[i];
                    img.src = data.imgs[i] == "nil" ? "Images/logoSocialis.png" : data.imgs[i];
                    div.onclick = () => document.location.href = "msgs.html?name=" + p.innerText + "&image=" + img.src;
                    if(data.rd[i] == false) div.style.backgroundColor = "#f1c195";
                    div.append(img);
                    div.append(p);
                    document.querySelector("main #panelMsgs").append(div);
                    i++;
                }
                if(n == 0) document.querySelector("main #msger").innerText = "Тут пока пусто";
            }else if(data.type == "justmsg"){
                
                //document.querySelector("main audio").setAttribute("autoplay", '');
                location.reload();
            }
        };
    }
}
var reg = {
    input: function(){
        let user = {
            name: document.querySelector("#reg #name").value,
            pass: document.querySelector("#reg #pass").value,
            type: "input"
        }
        if(user.name == "" || user.pass == ""){
            document.querySelector("#reg #msg").innerText = "Заполните все поля";
            return;
        }
        let json = JSON.stringify(user);
        socket.send(protocolEn.encode(json));
        socket.onmessage = function(message){
            let data = JSON.parse(message.data);
            if(data.type == "input"){
                if(data.ans != "true_"){
                    document.querySelector("#reg #msg").innerHTML = data.ans;
                }else{
                    localStorage.setItem("name", user.name);
                    localStorage.setItem("ID", data.id);
                    location.reload();
                }
            }
        };
    },
    register: function(){
        socket.onmessage = null;
        let user1 = {
            name: document.querySelector("#reg #name1").value,
            pass: document.querySelector("#reg #pass1").value,
            type: "register"
        }
        if(user1.name == "" || user1.pass == "" || document.querySelector("#reg #repass1").value == ""){
            document.querySelector("#reg #msg1").innerText = "Заполните все поля";
            return;
        }else if(document.querySelector("#reg #repass1").value != user1.pass){
            document.querySelector("#reg #msg1").innerText = "Пароли не совпадают";
            return;
        }
        let json = JSON.stringify(user1);
        socket.send(protocolEn.encode(json));
        socket.onmessage = function(message){
            let data = JSON.parse(message.data);
            if(data.type == "register"){
                if(data.ans != "true_"){
                    document.querySelector("#reg #msg1").innerHTML = data.ans;
                }else{
                    localStorage.setItem("name", user1.name);
                    localStorage.setItem("ID", data.ID);
                    location.reload();
                }
            }
        };
    }
}

var searchUser = {
    search:function(){
        document.querySelector("main #loader").style.display = "block";
        let text = document.querySelector("#search input").value;
        socket.onmessage = null;
        let sUser = {
            name:text,
            type:"searchUser"
        }
        socket.send(protocolEn.encode(JSON.stringify(sUser)));
        socket.onmessage = function(message){
            let data = JSON.parse(message.data);
            if(data.type != "searchUserYes"){
                document.querySelector("main #msger").innerText = data.text;
                document.querySelector("main #loader").style.display = "none";
                return;
            }
            document.querySelector("main #msger").innerText = null;
            //document.querySelector("main #panelMsgs").removeChild(document.querySelector("main #panelMsgs > div"));
            let node = document.querySelector("main #panelMsgs");
            while(node.firstChild){
                node.removeChild(node.firstChild);
            }
            //let template = document.querySelector("main #tmplMsgs");
            //let elem = template.content.querySelector("div");
            let div = document.createElement("div");
            div.onclick = () => document.location.href = "msgs.html?name=" + data.name + "&image=" + data.image;
            let image = document.createElement("img");
            image.src = data.image == null ? "Images/logoSocialis.png" : data.image;
            let p = document.createElement("p");
            p.innerText = data.name;
            div.append(image);
            div.append(p);
            document.querySelector("main #panelMsgs").append(div);
            /*elem.onclick = () => document.location.href = "msgs.html?name=" + data.name;
            let elem_img = template.content.querySelector("img");
            elem_img.src = data.Image == null ? "Images/logoSocialis.png" : data.Image;
            let elem_p = template.content.querySelector("p");
            elem_p.innerText = data.name;*/
            //elem.append(template.content.cloneNode(true));
            //document.querySelector("main #panelMsgs").append(elem);
            document.querySelector("main #loader").style.display = "none";
        };
    }
}