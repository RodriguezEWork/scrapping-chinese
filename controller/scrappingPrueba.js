const puppeteer = require('puppeteer');
var mysql = require('mysql');

const scraping = (req, res) => {

    const { url, numerito, links, cap, IDnovela } = req.body;

    var numero = numerito;
    var capitulos = [];
    var traducciones = [];
    var URL = url;
    var Cap = cap;
    var Novela = IDnovela;
    var textosGenerales = [];

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "novelread"
    });

    recorridoPage();

    async function recorridoPage() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.goto(URL);

        if (URL.includes('wxsy.net')) {
            const titulaso = await page.evaluate(() => {
                const titulos = document.querySelectorAll("div.pt-chapter-cont-detail.full a");

                const Elementos = [];
                for (let titulo of titulos) {
                    Elementos.push(titulo.href);
                }
                return Elementos;
            })

            for (let entradas = 0; entradas <= 480; entradas++) {
                await page.goto(titulaso[entradas]);

                const textoGeneral = await page.evaluate(() => {

                    const texto = document.querySelectorAll("p.content_detail");

                    const Elementos2 = [];
                    for (let textoFijo of texto) {
                        if(textoFijo.includes('huanyuanapp')) {
                            break;
                        }
                        Elementos2.push(textoFijo.innerText);
                    }

                    return Elementos2;
                });

                textosGenerales.push(textoGeneral);

            }
        }

        for (let textoFijo of textosGenerales) {
            capitulos.push(textoFijo.join('\n'));
        }

        for (let capitulo = numero; capitulo < capitulos.length; capitulo++) {

            let traduccion;
            let dato = capitulos[capitulo];

            if (dato.length >= 5000) {

                let parte1 = dato.slice(0, 4999)
                let parte2 = dato.slice(5000)

                await page.goto('https://www.deepl.com/es/translator');

                await page.type('div.lmt__inner_textarea_container', parte1);
                await page.waitForTimeout(10000);
                await page.waitForSelector('[title*="Haz clic en una palabra para mostrar traducciones alternativas"] div.lmt__textarea.lmt__textarea_dummydiv');
                let traduccion1 = await page.evaluate(() => {

                    const respuesta = document.querySelector('[title*="Haz clic en una palabra para mostrar traducciones alternativas"] div.lmt__textarea.lmt__textarea_dummydiv');

                    const dato = respuesta.innerHTML

                    return dato

                })

                await page.goto('https://www.deepl.com/es/translator');

                await page.type('div.lmt__inner_textarea_container', parte2);
                await page.waitForTimeout(10000);
                await page.waitForSelector('[title*="Haz clic en una palabra para mostrar traducciones alternativas"] div.lmt__textarea.lmt__textarea_dummydiv');
                let traduccion2 = await page.evaluate(() => {

                    const respuesta = document.querySelector('[title*="Haz clic en una palabra para mostrar traducciones alternativas"] div.lmt__textarea.lmt__textarea_dummydiv');

                    const dato = respuesta.innerHTML

                    return dato

                })

                traduccion = traduccion1.concat(' ', traduccion2)

            } else {

                await page.goto('https://www.deepl.com/es/translator');

                await page.type('div.lmt__inner_textarea_container', capitulos[capitulo]);
                await page.waitForTimeout(10000);
                await page.waitForSelector('[title*="Haz clic en una palabra para mostrar traducciones alternativas"] div.lmt__textarea.lmt__textarea_dummydiv');
                traduccion = await page.evaluate(() => {

                    const respuesta = document.querySelector('[title*="Haz clic en una palabra para mostrar traducciones alternativas"] div.lmt__textarea.lmt__textarea_dummydiv');

                    const dato = respuesta.innerHTML

                    return dato

                })
            }

            numero++;

            subir(traduccion);

            // traducciones.push(traduccion);

        }
        await page.waitForTimeout(2000);
        await browser.close();

        // console.log(traducciones)

    };

    function subir(texto) {

        var sql = "INSERT INTO capitulos (titulo, numero, marcado, capitulo, id_Novelas) VALUES ?";
        var values = [
            ['Capitulo: ', numero, false, texto, Novela],
        ];
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("1 registro insertado");
        });
    }
}

module.exports = {
    scraping,
}