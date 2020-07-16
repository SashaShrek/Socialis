const mClient = require("mongodb").MongoClient;

module.exports = {
    searchUser:function(data, sock){
        const url = "mongodb://localhost:27017/";
        const mongoClient = new mClient(url, {useNewUrlParser: true});
        mongoClient.connect(function(err, client){
            let coll = client.db("socialis").collection("users");
            if(err){
                console.log(`Ошибка: ${err}`);
                let answer_f = {
                    text:"Возникла ошибка! Повторите позже",
                    type:"searchUser"
                }
                sock.send(JSON.stringify(answer_f));
                client.close();
            }
            coll.find().toArray(function(err1, res){
                let answer_t = {};
                for(let i = 0; i < res.length; i++){
                    if(res[i].login == data.name){
                        let answer_t = {
                            name:res[i].login,
                            image:res[i].Image,
                            type:"searchUserYes"
                        }
                        console.log(">>>Пользователь найден");
                        sock.send(JSON.stringify(answer_t));
                        break;
                    }else if(i == res.length - 1){
                        answer_t = {
                            text:"Пользователь не найден",
                            type:"searchUserNo"
                        }
                        console.log(">>>Пользователь не найден");
                        sock.send(JSON.stringify(answer_t));
                    }
                }
                if(err1){
                    console.log(`Ошибка: ${err1}`);
                    let answer_f1 = {
                        text:"Возникла ошибка! Повторите позже",
                        type:"searchUser"
                    }
                    sock.send(JSON.stringify(answer_f1));
                }
                client.close();
            });
        });
    }
}