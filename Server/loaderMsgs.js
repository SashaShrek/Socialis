const mClient = require("mongodb").MongoClient;
const enc = require("./protocol_Enc.js");

module.exports = {
    messages:function(data, sock, users){
        const url = "mongodb://localhost:27017/";
        const mongoClient = new mClient(url, {useNewUrlParser: true});
        mongoClient.connect(function(err, client){
            let coll = client.db("socialis").collection("users");
            if(err){
                console.log(`>>>Ошибка: ${err}`);
                client.close();
            }
            coll.find().toArray(function(er, res){
                if(res.length == 0) return;
                let i = 0;
                let id = 0;
                while(i < res.length){
                    if(res[i].login == data.to) {
                        id = res[i].ID;
                        break;
                    }
                    i++;
                }


                coll = client.db("socialis").collection("messages");
                coll.find().toArray(function(er1, res1){
                    if(res1.length == 0) return;
                    let i = 0;
                    let answert = {};
                    while(i < res1.length){
                        if((res1[i].from == data.id && res1[i].to == id) || (res1[i].from == id && res1[i].to == data.id)){
                            if(res1[i].isread == false){
                                if((res1[i].struct[res1[i].struct.length - 1] == 0 && res1[i].to == data.id) ||
                                (res1[i].struct[res1[i].struct.length - 1] == 1 && res1[i].from == data.id)){
                                    coll.updateOne({ from: res1[i].from, to: res1[i].to}, {$set:{isread: true}}, function(e, r){
                                        if (e) {
                                            console.log(`>>>Ошибка при обновлении данных: ${e}`);
                                            client.close();
                                        }
                                        console.log(">>>Сообщения прочитаны");
                                        let msg = {
                                            text:data.message,
                                            filter:data.from,
                                            type:"justmsg"
                                        }
                                        console.log(data.message)
                                        let j = 0;
                                        while(j < users.countID.length){
                                            if(users.countID[j] == id) break;
                                            j++;
                                        }
                                        users.usersId[j].send(enc.encode(JSON.stringify(msg)));
                                        client.close();
                                    });
                                }
                            }
                            answert = {
                                struct:res1[i].struct,
                                msg:res1[i].msg,
                                first:res1[i].from,
                                type:"loadmsgs"
                            };
                            let json = JSON.stringify(answert);
                            sock.send(enc.encode(json));
                            break;
                        }
                        i++;
                    }
                });
            });
        });
    }
}