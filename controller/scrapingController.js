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
    var nuevoNumero = Number(numerito) + 50; 

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "novelread"
    });

    recorridoPage();

    async function recorridoPage() {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1366, height: 768 }, // Establecer dimensiones de escritorio
          });
          const page = await browser.newPage();
        
          await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36'
          );
        
          await page.goto(URL);
          await page.waitForTimeout(2000);

        if (URL.includes('ddxs.com')) {
            const titulaso = await page.evaluate(() => {
                const titulos = document.querySelectorAll("table:not(:first-of-type) tbody tr td a");

                const Elementos = [];
                for (let titulo of titulos) {
                    Elementos.push(titulo.href);
                }
                return Elementos;
            })

            for (let entradas = numero; entradas < nuevoNumero; entradas++) {
                await page.goto(titulaso[entradas]);

                const textoGeneral = await page.evaluate(() => {

                    const texto = document.querySelectorAll("div.bdsub dd#contents p:not([style])");

                    const Elementos2 = [];
                    for (let textoFijo of texto) {
                        if(textoFijo.innerText.includes('huanyuanapp')) {
                            continue;
                        }
                        Elementos2.push(textoFijo.innerText + "\n\n");
                    }

                    return Elementos2;
                });

                textosGenerales.push(textoGeneral);

            }
        }

        if (URL.includes('faloo.com')) {
            const titulaso = await page.evaluate(() => {
                const titulos = document.querySelectorAll("#mulu .DivTable a");

                const Elementos = [];
                for (let titulo of titulos) {
                    Elementos.push(titulo.href);
                }
                return Elementos;
            })

            for (let entradas = numero; entradas <= nuevoNumero; entradas++) {
                await page.goto(titulaso[entradas]);

                const textoGeneral = await page.evaluate(() => {

                    const texto = document.querySelectorAll("div.noveContent p");

                    const Elementos2 = [];
                    for (let textoFijo of texto) {
                        Elementos2.push(textoFijo.innerText + "\n\n");
                    }

                    return Elementos2;
                });

                textosGenerales.push(textoGeneral);

            }
        }

        if (URL.includes('hrsx8.net')) {
            const titulaso = await page.evaluate(() => {
                const titulos = document.querySelectorAll("div.container.mb20 div.info-chapters a");

                const Elementos = [];
                for (let titulo of titulos) {
                    Elementos.push(titulo.href);
                }
                return Elementos;
            })

            for (let entradas = numero; entradas <= titulaso.length; entradas++) {
                await page.goto(titulaso[entradas]);

                const textoGeneral = await page.evaluate(() => {

                    const texto = document.querySelectorAll("article p");

                    const Elementos2 = [];
                    for (let textoFijo of texto) {
                        Elementos2.push(textoFijo.innerText);
                    }

                    return Elementos2;
                });

                textosGenerales.push(textoGeneral);

            }
        }

        if (URL.includes('wxsy.net')) {
            const titulaso = await page.evaluate(() => {
                const titulos = document.querySelectorAll("div.pt-chapter-cont-detail.full a");

                const Elementos = [];
                for (let titulo of titulos) {
                    Elementos.push(titulo.href);
                }
                return Elementos;
            })

            for (let entradas = 0; entradas <= titulaso.length; entradas++) {
                await page.goto(titulaso[entradas]);

                const textoGeneral = await page.evaluate(() => {

                    const texto = document.querySelectorAll("p.content_detail");

                    const Elementos2 = [];
                    for (let textoFijo of texto) {
                        Elementos2.push(textoFijo.innerText);
                    }

                    return Elementos2;
                });

                textosGenerales.push(textoGeneral);

            }
        }

        if (URL.includes('kutun.net')) {
            const titulaso = await page.evaluate(() => {
                const titulos = document.querySelectorAll("dl div.readlist dd a");

                const Elementos = [];
                for (let titulo of titulos) {
                    Elementos.push(titulo.href);
                }
                return Elementos;
            })

            for (let entradas = numero; entradas <= titulaso.length; entradas++) {
                await page.goto(titulaso[entradas]);

                const textoGeneral = await page.evaluate(() => {

                    const texto = document.querySelectorAll(".reading-content .text-left p");

                    const Elementos2 = [];
                    for (let textoFijo of texto) {
                        Elementos2.push(textoFijo.innerText + "\n\n");
                    }

                    return Elementos2;
                });

                textosGenerales.push(textoGeneral);

            }
        }

        if(URL.includes('f2u2.com')) {
            const titulaso = await page.evaluate(() => {
                const titulos = document.querySelectorAll("div.listmain dl dd a");

                const Elementos = [];
                for (let titulo of titulos) {
                    var url = titulo.href; 
                    if (!url.includes("javascript")) {
                        Elementos.push(url);
                    }
                }
                return Elementos;
            })

            for (let entradas = numero; entradas < nuevoNumero; entradas++) {
                await page.goto(titulaso[entradas]);

                const textoGeneralUnico = await page.evaluate(() => {

                    var divElement = document.getElementById("chaptercontent");

                    var textNodes = Array.from(divElement.childNodes).filter(function(node) {
                        return node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '';
                    });
                    
                    // Obtener el texto entre los elementos <br> para cada nodo de texto
                    var text = "";
                    for (var i = 0; i < textNodes.length; i++) {
                        text += textNodes[i].nodeValue.trim() + "\n\n";
                    }
                      
                    return text;
                });
                textosGenerales.push(textoGeneralUnico);
            }
        }

        if(URL.includes('gdsoftga.com')) {
            const titulaso = await page.evaluate(() => {
                const titulos = document.querySelectorAll(".listmain dl dd a");

                const Elementos = [];
                for (let titulo of titulos) {
                    var url = titulo.href; 
                    if (!url.includes("javascript")) {
                        Elementos.push(url);
                    }
                }
                return Elementos;
            })

            for (let entradas = numero; entradas < nuevoNumero; entradas++) {
                await page.goto(titulaso[entradas]);

                const textoGeneralUnico = await page.evaluate(() => {

                    var divElement = document.getElementById("content");

                    var textNodes = Array.from(divElement.childNodes).filter(function(node) {
                        return node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '';
                    });
                    
                    // Obtener el texto entre los elementos <br> para cada nodo de texto
                    var text = "";
                    for (var i = 0; i < textNodes.length; i++) {
                        text += textNodes[i].nodeValue.trim() + "\n\n";
                    }
                      
                    return text;
                });
                textosGenerales.push(textoGeneralUnico);
            }
        }

        if (URL.includes('novel-gate.com')) {
            const titulaso = await page.evaluate(() => {
                const titulos = document.querySelectorAll(".main.version-chap li a");

                const Elementos = [];
                for (let titulo of titulos) {
                    Elementos.push(titulo.href);
                }
                return Elementos.reverse();
            })

            for (let entradas = numero; entradas <= nuevoNumero; entradas++) {
                await page.goto(titulaso[entradas]);

                const textoGeneral = await page.evaluate(() => {

                    const texto = document.querySelectorAll(".reading-content .text-left p");

                    const Elementos2 = [];
                    for (let textoFijo of texto) {
                        Elementos2.push(textoFijo.innerText + "\n\n");
                    }

                    return Elementos2;
                });

                textosGenerales.push(textoGeneral);

            }
        }

        for (let capitulo = 0; capitulo < 50; capitulo++) {
            
            let dato = textosGenerales[capitulo].join("");
            const partes = dividirTexto(dato, 1499);
            let traduccion;
            
            for (let [index, parte] of partes.entries()) {
                const selector = 'div.lmt__inner_textarea_container [contenteditable="true"]';
                await page.goto('https://www.deepl.com/es/translator');
                
                await page.waitForSelector(selector);
                await page.type(selector, parte);
                await page.waitForTimeout(10000);
                const resultado = await page.evaluate(() => {
                    document.querySelector('button[data-testid="translator-target-toolbar-copy"]').click();
                    
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            navigator.clipboard.readText()
                            .then((text) => {
                        resolve(text);
                      })
                      .catch((error) => {
                        console.error('Error al leer el portapapeles:', error);
                        resolve('');
                      });
                  }, 1000);
                });
              });
          
              traduccion = traduccion + ' ' + resultado;
            };
                        
            numero++;
            
            subir(traduccion);            
        }
        await page.waitForTimeout(2000);
        await browser.close();
        
    };
    
    function subir(texto) {
        
        var sql = "INSERT INTO capitulos (titulo, numero, marcado, capitulo, id_Novelas) VALUES ?";
        var values = [
            ['Capitulo: ', numero, false, texto, Novela],
        ];
        con.query(sql, [values], function (err, result) {
            if (err) throw err;
            console.log("1 registro insertado= ", numero);
        });
    }
    
    function dividirTexto(texto, longitudMaxima) {
        const pedazos = [];
      
        let i = 0;
        while (i < texto.length) {
          let pedazo = texto.slice(i, i + longitudMaxima);
          let ultimoSaltoLinea = pedazo.lastIndexOf('\n');
      
          // Si no hay salto de línea en el pedazo o el pedazo completo cabe en la longitud máxima
          if (ultimoSaltoLinea === -1 || ultimoSaltoLinea >= longitudMaxima) {
            pedazos.push(pedazo);
            i += longitudMaxima;
          } else {
            pedazos.push(texto.slice(i, i + ultimoSaltoLinea + 1));
            i += ultimoSaltoLinea + 1;
          }
        }
      
        return pedazos;
      }      
    
}

module.exports = {
    scraping,
}