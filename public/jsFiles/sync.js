//basic io issues because limited time and lab access
function broadcastMessage(messageType, element) {
    socket.emit(messageType, element);

}

socket.on('update', function (msg) {
    if (msg == null || msg === null || msg == 'null') {
        console.log('null found');
    } else
        recieveMessage('update', msg);
});
socket.on('delete', function (msg) {
    if (msg == null || msg === null || msg == 'null') {
        console.log('null found');
    } else
        recieveMessage('delete', msg);

});
socket.on('add', function (msg) {
    if (msg == null || msg === null || msg == 'null') {
        console.log('null found');
    } else
        recieveMessage('add', msg);

});

function recieveMessage(messageType, message) {
    if (messageType == 'update') {
        try {
            var msgValue = JSON.parse(message);
            deleteNoteWithoutIO(msgValue[0]['id']);
            updateNoteWithoutIO(msgValue[0]['id'],msgValue);
        } catch (error) {
            console.log('cant update:', error);
        }
    }
    if (messageType == 'delete') {
        try {
            deleteNoteWithoutIO(message);

        } catch (error) {
            console.log('cant delete:', error);
        }
    }
    if (messageType == 'add') {
        try {
            var msgValue = JSON.parse(message);
            updateNoteWithoutIO(msgValue[0]['id'],msgValue);

        } catch (error) {
            console.log('cant delete:', error);
        }
    }
}
