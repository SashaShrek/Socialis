//const scrap = require("osmosis");
const enc = require("./protocol_Enc.js");
const scrap = require("x-ray");
const puppeteer = require('puppeteer');

var x = scrap();

const dataScrap = {
    City: "._-_-components-src-organism-CurrentConditions-CurrentConditions--location--1YWj_",
    Time: "._-_-components-src-organism-CurrentConditions-CurrentConditions--timestamp--1ybTk",
    Temp: "._-_-components-src-organism-CurrentConditions-CurrentConditions--tempValue--MHmYY",
    Type: "._-_-components-src-organism-CurrentConditions-CurrentConditions--phraseValue--mZC_p",
    Verot: "._-_-components-src-organism-CurrentConditions-CurrentConditions--precipValue--2aJSf span"
}
const dataNews = {
    /*title: "#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child(1) > div > a > div > div > div.card-content__info > div.card-content__title",
    shortText: "#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child(1) > div > a > div > div > div.card-content__info > div.card-content__lead",
    author: "#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child(1) > div > a > div > div > div.card-content__info > div.card-tools > div.card-tools__author",
    link: "#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child(1) > div > a@href",*/
    themeImg: "#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child(1) > div > a > div > div > div.card-content__picture > img"
}
module.exports = {
    weather: function(data, sock){
        const siteW = data.city;
        x(siteW, dataScrap)(async function(err ,data){
            if(err){
                console.log(">>>Возникла ошибка при загрузке данных");
                return;
            }
            console.log(data);
            
            let answert = {
                city: data.City,
                time: data.Time,
                temp: data.Temp,
                typeW: data.Type,
                verot: data.Verot,
                title: [],
                shortText: [],
                author: [],
                link: [],
                nameComp: "Forbes",
                img: [],
                linkFrom: "https://www.forbes.ru/new",
                type: "worldnews"
            };

            const browser = await puppeteer.launch({args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]});
            const page = await browser.newPage();
            console.log(">>>Загружаю новости...");
            await page.goto("https://www.forbes.ru/new");
            await page.waitForSelector("body");
            await page.waitFor(2000);
            console.log(">>>Готово. Начинаю собирать данные...");
            let n = await page.evaluate(() => {
                return document.querySelectorAll("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div").length;
            });
            //await browser.close();
            console.log(">>>Количество блоков.." + n);
            answert.title = await page.evaluate(() => {
                let n = document.querySelectorAll("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div").length;
                let i = 1;
                let tElem = [];
                while(i <= n){
                   try{
                       tElem.push(document.querySelector("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child(" + String(i) + ") > div > a > div > div > div.card-content__info > div.card-content__title").innerText);
                   }catch(e){
                       tElem.push("nil");
                   }
                   i++;
                }
                return tElem;
           });
           console.log(answert.title);
/*2*/       answert.shortText = await page.evaluate(() => {
               let n = document.querySelectorAll("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div").length;
                let i = 1;
                let tElem = [];
                while(i <= n){
                   try{
                       tElem.push(document.querySelector("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child(" + String(i) + ") > div > a > div > div > div.card-content__info > div.card-content__lead").innerText);
                   }catch(e){
                       tElem.push("nil");
                   }
                   i++;
                }
                return tElem;
           });
           console.log(answert.shortText);
/*3*/       answert.author = await page.evaluate(() => {
               let n = document.querySelectorAll("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div").length;
                let i = 1;
                let tElem = [];
                while(i <= n){
                   try{
                       tElem.push(document.querySelector("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child(" + String(i) + ") > div > a > div > div > div.card-content__info > div.card-tools").innerText);
                   }catch(e){
                       tElem.push("nil");
                   }
                   i++;
                }
                return tElem;
           });
           console.log(answert.author);
/*4*/       answert.link = await page.evaluate(() => {
               let n = document.querySelectorAll("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div").length;
                let i = 1;
                let tElem = [];
                while(i <= n){
                   try{
                       tElem.push(document.querySelector("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child(" + String(i) + ") > div > a").href);
                   }catch(e){
                       tElem.push("nil");
                   }
                   i++;
                }
                return tElem;
           });
           console.log(answert.link);
           let i = 1;
           let z = await page.evaluate(() => document.querySelectorAll("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div").length);
            while(i < z){
                await page.evaluate((i) => {
                    document.querySelector("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child("+String(i)+")").scrollIntoView()
                }, i);
                i++;
                await page.waitFor(200)
            }
           answert.img = await page.evaluate(() => {
                let n = document.querySelectorAll("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div").length;
                //let N = document.querySelectorAll("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child("+String(i)+") > div > a > div > div > div.card-content__picture > img")
                let i = 1;
                let tElem = [];
                while(i <= n){
                    try{
                        tElem.push(document.querySelector("#__layout > div > div.layout__container > div.layout__page > div > div.grid > div > div > div.grid-cell.cell-row--1.cell-col--8.cell-col-md--8.cell-col-sm--12 > div > div.news-list > div:nth-child(1) > div:nth-child("+String(i)+") > div > a > div > div > div.card-content__picture > img").src);
                    }catch(e){
                        tElem.push("nil");
                    }
                    i++;
                }
                return tElem;
            });
            await browser.close();
            console.log(answert.img);
            console.log(">>>Готово");
            let json = JSON.stringify(answert);
            sock.send(enc.encode(json));
            sock.send(enc.encode(json));
        });
    },
    NewWeather: async function(data, sock){
        const browser = await puppeteer.launch({args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]});
        let link = "";
        try{
            const page = await browser.newPage();
            await page.goto("https://weather.com/ru-RU/weather/today/l/42b655221eb402a3f86992560067396cbc0706f1555dd868c4cc706b24fa4b11");
            console.log(">>>Сайт загружен");
            await page.waitForSelector("body");
            await page.waitFor(3000);
            await page.click("#LocationSearch_input");
            await page.keyboard.type(data.city);
            console.log(">>>Данные введены.." + data.city);
            await page.waitFor(3000);
            await page.click("#LocationSearch_listbox-0");
            await page.waitFor(3000);
            link = String(await page.url());
            console.log(">>>Ссылка получена.." + link);
        }catch(e){
            link = "nil";
            console.log(">>>Ошибка");
        }
        await browser.close();
        let answert = {
            lnk: link,
            type: "getNewW"
        };
        let json = JSON.stringify(answert);
        sock.send(enc.encode(json));
    }
    /*weather: function(data, sock){
        scrap.get("https://weather.com/ru-BY/weather/today/l/42b655221eb402a3f86992560067396cbc0706f1555dd868c4cc706b24fa4b11")
        .set(dataScrap).data(function(data){
            console.log(data);
            let answert = {
                city: data.City,
                time: data.Time,
                temp: data.Temp,
                typeW: data.Type,
                verot: data.Verot,
                type: "worldnews"
            }
            let json = JSON.stringify(answert);
            //sock.send(enc.encode(json));
        });
    }*/
}
