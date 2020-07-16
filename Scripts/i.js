const socket = new WebSocket("ws://188.227.86.17:2000");

var protocolEn = {
    encode: (text) => btoa(unescape(encodeURIComponent(text)))
}

var Navigation = {
    pages: (page) => document.location.href = page,
    exit: function(){
        localStorage.clear();
        location.reload();
    }
}

var load_page = {
    getdata: function(){
        let gdataUser = {
            name: localStorage.getItem("name"),
            type: "getdata"
        }
        socket.onopen = () => socket.send(protocolEn.encode(JSON.stringify(gdataUser)));
        socket.onmessage = function(message){
            let data = JSON.parse(message.data);
            if(data.type != "getdata") return;
            if(data.text != null) document.querySelector("#profile #about").innerText = data.text;
            if(localStorage.getItem("image") == "" || localStorage.getItem("image") == null){
                if(data.Image == null) return;
                localStorage.setItem("image", data.Image);
            }else document.querySelector("#image").src = localStorage.getItem("image");
        };
    },
    load: function(){
        if(localStorage.getItem("name") == "" || localStorage.getItem("name") == null){
            document.location.href = "hoster_block.html";
        }
        document.querySelector("#profile #name").innerText = localStorage.getItem("name");
        load_page.getdata();
        data_user.newavatar();
    }
}

var data_user = {
    newdata: function(){
        let about = document.querySelector("#profile #newabout").value;
        let pass = document.querySelector("#profile #pass").value;
        let repass = document.querySelector("#profile #repass").value;
        if(about == "" && pass == ""){
            document.querySelector("#profile #msg").innerText = "Заполните хотя бы первое поле";
            return;
        }else if(pass != "" && about != ""){
            if(pass != repass){
                document.querySelector("#profile #msg").innerText = "Пароли не совпадают";
                return;
            }
            let updata = {
                upabout: about,
                uppass: pass,
                name: localStorage.getItem("name"),
                type: "newdata"
            }
            socket.send(protocolEn.encode(JSON.stringify(updata)));
        }else if(pass != "" && about == ""){
            if(pass != repass){
                document.querySelector("#profile #msg").innerText = "Пароли не совпадают";
                return;
            }
            let updata = {
                upabout: "nil",
                uppass: pass,
                name: localStorage.getItem("name"),
                type: "newdata"
            }
            socket.send(protocolEn.encode(JSON.stringify(updata)));
        }else if(pass == "" && about != ""){
            let updata1 = {
                upabout: about,
                uppass: "nil",
                name: localStorage.getItem("name"),
                type: "newdata"
            }
            let json = JSON.stringify(updata1);
            socket.send(protocolEn.encode(json));
        }
        socket.onmessage = function(message){
            let data = JSON.parse(message.data);
            if(data.type != "newdata") return;
            if(data.text == "true_") location.reload();
            document.querySelector("#profile #msg").innerText = data.text;
        };
    },
    newavatar: function(){
        let file = document.querySelector("#profile #fil");
        file.addEventListener("change", function(){
            if(file.length == 0) return;
            let upimage = {
                name:localStorage.getItem("name"),
                type:"upimage"
            }
            let hex = new Blob([JSON.stringify(upimage), '+', file.files[0]])
            socket.send(hex);
            socket.onmessage = function(message){
                let data = JSON.parse(message.data);
                if(data.type != "upimage") return;
                localStorage.setItem("image", data.text);
                location.reload();
            };
        });
    }
}