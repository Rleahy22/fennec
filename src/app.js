console.log('bundled');
const websocket = window.io.connect();

const timeSpan = document.getElementById('current-time');

websocket.on('timer', function (data) {
    const displayTime = data.time / 10000;
    timeSpan.textContent = displayTime + ' seconds';
});
