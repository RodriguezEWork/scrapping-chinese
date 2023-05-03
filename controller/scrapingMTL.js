const puppeteer = require('puppeteer');
var mysql = require('mysql');

const puppeteer2 = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer2.use(StealthPlugin())

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
        password: "",
        database: "novelread"
    });

    recorridoPage();

    async function recorridoPage() {

        const args = [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list',
            '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.5478.0 Safari/537.36"'
        ];
    
        const options = {
            // args,
            headless: false,
            ignoreHTTPSErrors: true,
            userDataDir: './tmp'
        };
        const browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.goto(URL);
        
            const titulaso = await page.evaluate(() => {
                const titulos = document.querySelectorAll("div.separator div.separator b span a");

                const Elementos = [];
                for (let titulo of titulos) {
                    Elementos.push(titulo.href);
                }
                return Elementos;
            })

            for (let entradas = 0; entradas < titulaso.length; entradas++) {
                await page.goto(titulaso[entradas]);

                const textoGeneral = await page.evaluate(() => {

                    const texto = document.querySelectorAll("div.separator div.separator span");

                    const Elementos2 = [];
                    for (let textoFijo of texto) {
                        Elementos2.push(textoFijo.innerText);
                    }

                    return Elementos2;
                });

                textosGenerales.push(textoGeneral);

            }

        await browser.close();

        for (let textoFijo of textosGenerales) {
            if(textoFijo == "<br>"){
                break;
            }
            capitulos.push(textoFijo.join('\n'));
        }

        for (let capitulo = 0; capitulo < capitulos.length; capitulo++) {
            let dato = capitulos[capitulo];
            numero++;
            subir(dato);
        }

        // console.log(traducciones)

    };

    function subir(texto) {

        var nuevo = texto.replace(/'/g, "\\'");
        nuevo = removeEmojis(nuevo);
        var sql = "INSERT INTO capitulos (titulo, numero, marcado, capitulo, id_Novelas) VALUES ?";
        var values = [
            ['Capitulo: ', numero, false, nuevo, Novela],
        ];
        con.query(sql, [values], function (err, result) {
            if (err){
                console.log(result);
                throw err;
            } 
            console.log("1 registro insertado");
        });
    }

    function removeEmojis(string) {
        return string.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '');
    }
}

module.exports = {
    scraping,
}