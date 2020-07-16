'use strict';
const socket = new WebSocket("ws://188.227.86.17:2000");

var Navigation = {
    pages: function(page){
        document.location.href = page;
    }
}

var load_page = {
    load: function(){
        if(localStorage.getItem("name") == "" || localStorage.getItem("name") == null){
            document.location.href = "hoster_block.html";
        }
        this.getWorldnws();
        let butW = $("#wcontrols > button");
        let input = $("#wcontrols > input[type=text]");
        //input.onkeypress = (e) => {if(e.keyCode == 13)  new Weather().GetWeather()};
        butW.click(() => new Weather().GetWeather());
    },
    getWorldnws: function(){
        if(localStorage.getItem("city") == null) return;
        $("main #loader").css("display", "block");
        let data = {
            city: localStorage.getItem("city"),
            type:"worldnews"
        };
        let json = JSON.stringify(data);
        socket.onopen = () => socket.send(protocolEn.encode(json));
        socket.onmessage = function(msg){
            let news = JSON.parse(protocolEn.decode(msg.data));
            if(news.type == "worldnews"){
                $("main #weather > #city").text(news.city);
                $("main #weather > #time").text(news.time);
                $("main #weather > h1").text(news.temp);
                $("main #weather > #type").text(news.typeW);
                $("main #weather > #verot").text(news.verot);
                let nws = new News(news);
                nws.Create_Elems();
            }
            $("main #loader").css("display", "none");
        };
    }
}

var protocolEn = {
    encode: (text) => btoa(unescape(encodeURIComponent(text))),
    decode:text => decodeURIComponent(escape(atob(text)))
}

class Weather {
    GetWeather(){
        $("main #loader").css("display", "block");
        let ct = $("#wcontrols > input[type=text]").val();
        let getNewW = {
            city:ct,
            type:"getNewW"
        }
        let json = JSON.stringify(getNewW);
        socket.send(protocolEn.encode(json));
        $("main > #wcontrols > p").text("Не закрывайте страницу, это может занять несколько минут");
        socket.onmessage = (msg) =>{
            let data = JSON.parse(protocolEn.decode(msg.data));
            if(data.type == "getNewW" && data.lnk != "nil"){
                localStorage.setItem("city", data.lnk);
                location.reload();
            }else $("main > #wcontrols > p").text("Возникла ошибка. Повторите позже");
            $("main #loader").css("display", "none");
        };
    }
}

class News{
    constructor(js){
        this.j = js;
    }
    Create_Elems(){
        let i = 0;
        let n = this.j.title.length;
        while(i < n){
            if(this.j.title[i] == "nil") {
                i++;
                continue;
            }
            let div = document.createElement("div");
            let nameComp = document.createElement("p");
            let title = document.createElement("p");
            let text = document.createElement("p");
            let img = document.createElement("img");
            let author = document.createElement("p");
            let linkFrom = document.createElement("a");
            nameComp.innerText = this.j.nameComp;
            title.innerText = this.j.title[i];
            text.innerText = this.j.shortText[i];
            img.src = this.j.img[i];
            author.innerText = "Автор " + this.j.author[i];
            linkFrom.href = this.j.linkFrom[i];
            linkFrom.innerHTML = "Источник";
    
            div.style.width = 100 +'%';
            div.style.borderBottom = "solid 1px dimgray";
            nameComp.style.fontStyle = "normal";
            nameComp.style.fontSize = 130 + '%';
            title.style.fontSize = 120 + '%';
            title.style.textAlign = "center";
            title.style.fontStyle = "bold";
            img.style.borderRadius = 10 + "px";
            img.style.width = 60 + '%';
            img.style.marginLeft = 20 + '%';
            text.style.fontSize = 115 + '%';
            author.style.textAlign = "right";
    
            div.append(nameComp);
            div.append(title);
            div.append(img);
            div.append(text);
            div.append(author);
            div.append(linkFrom);
            $("main > #news").append(div);
            i++;
        }
    }
}