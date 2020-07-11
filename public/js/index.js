const $start = document.getElementById('start');
const $vid = document.querySelector('video');

$vid.playbackRate = 0.7;

$start.addEventListener('click', ()=> {
    window.location.replace('app');
})