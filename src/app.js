console.log('bundled');
const websocket = window.io.connect();
const timeSpan  = document.getElementById('current-time');
const roomPath  = parseInt(window.location.pathname.slice(6));

websocket.on('roomStatus', function (data) {
    if (parseInt(data.id) === roomPath) {
        const displayTime = data.status.time / 10000;
        timeSpan.textContent = displayTime + ' seconds';
    }
});
