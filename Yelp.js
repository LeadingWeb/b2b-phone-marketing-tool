
const yelp = require('yelp-fusion');
const apiKey = 'E_d2ceyeDMwnU5DixVr36U4CEqqJF7aT4qU27laQHzJsqLFlj79KRmMea1TdkRdZ6HnTNJJcpsE2ed5d9CE3Cj6UcVwRplu9suy98nNRPCAxUpqW07BhwVpXNfHfXnYx';

class Yelp {
    
    constructor() {
        
        this.client = yelp.client(apiKey);
        this.search;
        this.leads = [];
        this.current = 0;
        this.last = -1;
    }
    init(term, location) {
        this.term = term;
        this.location = location;
        
        // console.log(this.term, this.location);
    } 
    findYelpPage() {
        
        let LIMIT = 50;
        let offset = 0;
        this.searchTerm = {
            
            term: this.term,
            location: this.location,
            limit: LIMIT,
            offset: offset
            
            
        }
        
        
        
        this.search = function () {
            this.client.search(this.searchTerm).then(response => {
                let businesses = response.jsonBody.businesses;
                let data = JSON.stringify(businesses);
                //fs.writeFileSync('dentist.json', data);
                
                for (let i = 0; i < businesses.length; i++) {
                    let shops = {
                        id: businesses[i].id,
                        alias: businesses[i].alias,
                        name: businesses[i].name,
                        location: businesses[i].location,
                        phone: businesses[i].phone,
                        display_phone: businesses[i].display_phone,
                        categories: businesses[i].categories,
                        
                        
                    }
                    const found = this.leads.find(element => element.id == shops.id);
                    if (found == undefined || found == null) {
                        const l = new Lead(shops)
                        this.leads.push(l);
                    }
                    
                }
                this.last = this.current;
                
                this.current = this.leads.length;
                console.log(this.leads.length);
                console.log(this.leads);
                // console.log(currentLength, lastLength)
                //console.log(businesses);
                
                if(this.last < this.current) {
                    
                    setTimeout(()=> {
                        this.searchTerm.offset += this.searchTerm.limit;
                        this.search();
                        if(this.last == this.current) {
                            console.log(`FINISH!! FOUND ${this.leads.length} LEADS !`);
                        }
                    }, 500);
                }
                
                
                
                
                
                
            }).catch(e => {
                console.log(e);
            });
        }

        this.search();
        
        
    }
    
}


function Lead(el) {
    this.id = el.id;
    this.alias = el.alias;
    this.name = el.name;
    this.review_count = el.review_count;
    this.location = el.location;
    this.phone = el.phone;
    this.display_phone = el.display_phone;
    this.emails = [];
    this.preparedEmails = [];
}





module.exports = Yelp;