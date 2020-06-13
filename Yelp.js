
const yelp = require('yelp-fusion');
const apiKey = 'E_d2ceyeDMwnU5DixVr36U4CEqqJF7aT4qU27laQHzJsqLFlj79KRmMea1TdkRdZ6HnTNJJcpsE2ed5d9CE3Cj6UcVwRplu9suy98nNRPCAxUpqW07BhwVpXNfHfXnYx';

class Yelp {
    
    constructor() {
        
        this.client = yelp.client(apiKey);
    }
    init(term, location) {
        this.term = term;
        this.location = location;
        console.log(this.term, this.location);
    } 
}


module.exports = Yelp;