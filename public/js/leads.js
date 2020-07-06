const $results = document.getElementById('results');
const $msg = document.getElementById('msg');
const $controll = document.querySelector('.controll');

const $findMail = document.getElementById('find-mail');
let allResults = [];
let allEmails = [];
let done = [];
let currentMail = 0;

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
            let name = createDiv(lead.name)
            let street = createDiv(lead.location.display_address[0]);
            let city = createDiv(lead.location.display_address[1]);
            let phone = createDiv(lead.phone);
            let email = createDiv('');
            let row = [];
            row.push(name);
            row.push(street);
            row.push(city);
            row.push(phone);
            row.push(email);
            allResults.push(row);
            
            $results.appendChild(name);
            $results.appendChild(street);
            $results.appendChild(city);
            $results.appendChild(phone);
            $results.appendChild(email);
        })
    }
}

function createDiv(text){
    const div = document.createElement('div');
    div.textContent = text;
    return div;
}

$findMail.addEventListener('click',async (e) => {
    
    
    async function search() {
        allEmails[currentMail] = [];
        if(currentMail > 0) drawCurrentEmail();
        highlightCurrent();
        console.log(currentMail, 'currentMail')
        const data = {name: allResults[currentMail] [0].textContent};
        console.log(data);
        const res = await fetch('/findmail', {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify(data)
        });
        currentMail++;
        
        
        const message = await res.json();
        console.log(message, currentMail);   
        if (message != [] && message != undefined) {
            done[currentMail] = true;
            allEmails[currentMail] = [];
            
            for (let j = 0; j < message.length; j++) {
                if(message[j] != []){
                    message[j].forEach(result => {
                        console.log(allEmails);
                        allEmails[currentMail] = result;
                        console.log(result);
                        console.log(allEmails);
                    })
                }
                
            }
        }
        else {
            done[currentMail] = false;
        }
        if(currentMail < allResults.length) {
            console.log(`currentMail is ${currentMail} and allResults.length ${allResults.length}`);
            search();
        }
    }
    search();
    
})


function highlightCurrent() {
    allResults.forEach(row => row.forEach(el => {
        el.style.backgroundColor = '#fff';
        el.style.color = '#232323';
    }));
    allResults[currentMail].forEach(el => {
        el.style.backgroundColor = '#232323';
        el.style.color = '#fff';
    })
}

function drawCurrentEmail(){
    let string = '';
    for (let i = 0; i < allEmails[currentMail-1].length; i++) {
        string += allEmails[currentMail -1][i];
        string += ' ';
        
    };
    allResults[currentMail -1] [4].textContent = string;
}