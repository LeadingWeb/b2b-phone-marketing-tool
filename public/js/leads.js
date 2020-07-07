const $results = document.getElementById('results');
const $msg = document.getElementById('msg');
const $controll = document.querySelector('.controll');
const $pageNav = document.querySelector('.pageNav');
const $back = document.getElementById('back');
const $forward = document.getElementById('forward');
const $goBack = document.getElementById('go-back');
const $export = document.getElementById('export-list');


let allResults = [];
let parsedLeads = [];

const perPage = 50;
let currentPage = 0;
let leads;
let third = -2;
let last = -1;
let current = 0;
(async function getLeads(){
    
    
    function getNew() {
        setTimeout(async ()=> {
            const res = await fetch('/get-leads');
            leads = await res.json();
            console.log(leads);
            if(leads.length == 0) {
                noResults();
            }
            if(leads.length > 0) {
                third = last;
                last = current;
                current = leads.length;
            }
            if(last < current && third < last) {
                getNew();                
            }
            if(current != 0) {
                drawLeads();
            }
            if(current == last) {
                $msg.textContent = `Es wurden insgesamt ${leads.length} Unternehmen gefunden!`;
                $controll.style.display = 'block';
            }
        }, 2000);   
    }
    getNew();
    
})();

function drawLeads(){
    if(leads != undefined && leads != []) {
        allResults.forEach(row => {
            row.forEach(el => {
                el.remove();
            })
        })
        allResults = [];
        leads.forEach((lead, index) => {
            
            if (index >= perPage * currentPage && index <= perPage*(currentPage+1) ) {

                parsedLeads[index] = {
                    name: lead.name,
                    street: lead.location.display_address[0],
                    city: `${lead.location.zip_code} ${lead.location.city}`,
                    phone: lead.phone
                };
                
                let name = createDiv(lead.name)
                let street = createDiv(lead.location.display_address[0]);
                let city = createDiv(`${lead.location.zip_code} ${lead.location.city}`);
                let phone = createDiv(lead.phone);
                let row = [];
                row.push(name);
                row.push(street);
                row.push(city);
                row.push(phone);
                allResults.push(row);
                
                $results.appendChild(name);
                $results.appendChild(street);
                $results.appendChild(city);
                $results.appendChild(phone);
            }
            
            if (leads.length > perPage) {
                $pageNav.style.display = 'flex';
                
                if(currentPage == 0) {
                    $back.style.display = 'none';
                }else $back.style.display = 'block';
                let sumAllPages = Math.floor(leads.length / perPage);
                if (currentPage == sumAllPages) {
                    $forward.style.display = 'none';
                }else $forward.style.display = 'block';
            }
        })
    }else {
        noResults();
    }
}

function noResults() {
    $msg.textContent = 'Leider wurden keine Unternehmen für diese Suche gefunden!';
    $controll.style.display = 'block';
    $export.style.display = 'none';

}

function createDiv(text){
    const div = document.createElement('div');
    div.textContent = text;
    return div;
}

$forward.addEventListener('click', () => {
    currentPage++;
    drawLeads();
});

$back.addEventListener('click', () => {
    currentPage--;
    drawLeads();
});

$goBack.addEventListener('click', (e) => {
    e.preventDefault();
    fetch('/reset')
    .then(response => response.json())
    .then(data => {
        if(data.status == 1) {
            window.location.replace('/app');
        }
    });
})

const download = function(data) {
    const blob = new Blob([data], { type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);
    const a  = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'download.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

$export.addEventListener('click', (e) => {
    const csvData = objectToCsv(parsedLeads);
    download(csvData);
})

const objectToCsv = function(data) {

    const csvRows = [];

    // get the headers
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));

    // console.log(csvRows);

    // loop over rows
    for (let row of data) {
        const values = headers.map(header => {
            const escaped = (''+row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`
        });
        csvRows.push(values.join(','));
    }

    return csvRows.join('\n');

    // form escaped comma seperated values
}