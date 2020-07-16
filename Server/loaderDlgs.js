const mClient = require("mongodb").MongoClient;
const enc = require("./protocol_Enc.js");

module.exports = {
    dialogs:function(data, sock){
        const url = "mongodb://localhost:27017/";
        const mongoClient = new mClient(url, {useNewUrlParser: true});
        mongoClient.connect(function(err, client){
            let coll = client.db("socialis").collection("messages");
            if(err){
                console.log(`>>>Ошибка: ${err}`);
                client.close();
            }
            coll.find().toArray(function(er, res){
                if(er){
                    console.log(`>>>Ошибка при загрузке диалогов: ${er}`);
                    client.close();
                }
                let i = 0;
                let n = res.length;
                let id = [];
                let isrd = [];
                while(i < n){
                    if(res[i].from == data.id) {
                        id.push(res[i].to);
                        isrd.push(res[i].isread);
                    }else if(res[i].to == data.id){ 
                        id.push(res[i].from);
                        isrd.push(res[i].isread);
                    }
                    i++;
                }
                console.log(">>>Получены id");
                coll = client.db("socialis").collection("users");
                coll.find().toArray(function(er1, res1){
                    if(er1){
                        console.log(`>>>Ошибка при загрузке диалогов 1: ${er1}`);
                        client.close();
                    }
                    let i1 = 0;
                    let n1 = res1.length;
                    let j = 0;
                    let m = id.length;
                    let names = [];
                    let images = [];
                    while(i1 < n1){
                        console.log(j)
                        while(j < m){
                            console.log(res1[i1].ID)
                            if(res1[i1].ID == id[j]){
                                console.log(res1[i1].login)
                                names.push(res1[i1].login);
                                if(res1[i1].Image == null){
                                    images.push("nil");
                                }else images.push(res1[i1].Image);
                            }
                            j++;
                        }
                        j = 0;
                        i1++;
                    }
                    console.log(id)
                    let answert = {
                        imgs:images,
                        nms: names,
                        rd:isrd,
                        type:"getdlgs"
                    }
                    console.log(`>>>Итог: `, answert)
                    let json = JSON.stringify(answert);
                    sock.send(enc.encode(json));
                    console.log(">>>Найдены и отправлены пользователи");
                    client.close();
                });
            });
        });
    }
}