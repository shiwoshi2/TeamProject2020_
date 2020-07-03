function broadcastMessage(messageType, element) {
    socket.emit(messageType, element);

}

socket.on('save', function (msg) {

    if (msg == null || msg === null || msg == 'null') {
        console.log('null found');
    } else
        recieveMessage('save', msg);

});

function recieveMessage(messageType, message) {

    if (messageType == 'save') {
        try {
            document.getElementById(message).remove();
            removeItem(actionStack, message);

        } catch (error) {
            console.log('cant delete:', error);
        }
    }
}
