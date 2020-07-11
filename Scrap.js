const puppeteer = require('puppeteer');

class Scrap{
    constructor () {
        this.emails = [];
        
    }
    async start(){
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
    }
    async findMailOf(name) {
        
        function nameToURL(_name) {
            console.log(_name)
            const plus = _name.split(' ').join('+');
            const imp = plus + '+impressum';
            const uri = `https://duckduckgo.com/?q=${imp}&t=hj&ia=webb`;
            return uri;
        }
        
        await this.page.setExtraHTTPHeaders({
            'Accept-Language': 'de'
        });
        const URL = nameToURL(name);
        await this.page.goto(URL, {waitUntil: 'networkidle2'});
        let links = await this.page.evaluate(() => {
            let data = [];
            let links = document.querySelectorAll('.result__a');
            links.forEach((link, index) => {
                const obj = {
                    text: link.innerText,
                    textContent: link.textContent,
                    href: link.href,
                    host: link.hostname,
                    pathname: link.pathname,
                    protocol: link.protocol
                };
                data[index] = obj;
                
            })

            return data;
        });
        
        function linkToPath (link) {
            const uri = `${link.protocol}//${link.host}/impressum`
            return uri;
        }

        
        for(let i = 0; i < 3; i++) {
            if(links[i] != undefined) {
                await this.page.goto(linkToPath(links[i]), {waitUntil: 'networkidle2'});
                await this.page.waitForSelector('a');
                const found = await this.page.evaluate(() => {
                    const pArray = document.querySelectorAll('p');
                    const aArray = document.querySelectorAll('a');
                    let pText = [];
                    let aText = [];
                    pArray.forEach(p => {
                        pText.push(p.textContent);
                    });
                    aArray.forEach(a => {
                        aText.push(a.href);
                    })
                    let obj = {pText, aText};
                    return obj;
                    
                });
                let allAts = [];
                found.aText.forEach(a => {
                    const ats = a.search('@');
                    if (ats >= 0){
                        const mailto = a.search('mailto');
                        if(mailto < 0) {
                            allAts.push(a);
                        }else {
                            const split = a.split(':');
                            allAts.push(split[1]);
    
                        }
                        
                    }
                });
                this.emails[i] = allAts;
                let allAtsP = [];
                found.pText.forEach(p => {
                    const ats = p.search('@');
                    if (ats >= 0) {
    
                    }
                })
                console.log(allAts, 'ALLATS')
            
                console.log(this.emails, 'this.emails')
                
                if(i == 2) {
                    return this.emails;
                    setTimeout(() => {
                        console.log(this.emails, 'this.emails after 300ms');
                    }, 300);
                }

            }
            
        }
         
    }
}

module.exports = Scrap;