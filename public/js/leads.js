window.addEventListener('load', (e) => {
    
})
let leads;
let last = -1;
let current = 0;
(async function getLeads(){
    
    
    function getNew() {
        setTimeout(async ()=> {
            const res = await fetch('/get-leads');
            leads = await res.json();
            console.log(leads);
            if(leads.length > 0) {
                last = current;
                current = leads.length;
            }
            if(last < current) {
                getNew();                
            }
        }, 200);   
    }
    getNew();
    
})();