const $term = document.getElementById('term');
const $location = document.getElementById('location');
const $sbt = document.getElementById('sbt');
const $msg = document.getElementById('msg');


$sbt.addEventListener('click', (e) => {
    const term = $term.value;
    const location = $location.value;
    const data  = {term, location};
    console.log(data);
    if(term != undefined && location != undefined) {
        (async () => {
            const res = await fetch('/search', {
                method: 'POST',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: JSON.stringify(data)
            });
            const msg = await res.json();
            if (msg.status == 1) {
                window.location.replace('/leads');
            }
        })();
    }
})