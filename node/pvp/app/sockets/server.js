var battleCount = 0,
    roomCount = 1;

// socket.ioのソケットを管理するオブジェクト
var socketsOf = {};

// 指定したroomIdに属するクライアントすべてに対しイベントを送信
function emitToRoom(roomId, event, data, fn) {
    var sockets;
    if (socketsOf[roomId] === undefined) {
        return;
    }
    sockets = socketsOf[roomId];
    Object.keys(sockets).forEach(function (key) {
        sockets[key].emit(event, data, fn);
    });
}

// socket.ioのコネクション設定
exports.onConnection = function (socket) {

    // コネクションが確立されたら実行
    socket.emit('connected', {});

    // 認証情報を確認する
    socket.on('check credential', function (client) {
        battleCount += 1;
        if (battleCount > 2) {
            battleCount = 1;
            roomCount += 1;
            client.roomId = client.roomId + roomCount;
        } else {
            client.roomId = client.roomId + roomCount;
        }

        if (socketsOf[client.roomId] === undefined) {
            socketsOf[client.roomId] = {};
        } else {
            if (socketsOf[client.roomId][client.userName] !== undefined) {
                battleCount -= 1;
                socket.emit('userName exists', {});
                return;
            }
        }

        // ソケットにクライアントの情報をセット
        socket.set('client', client, function () {
            socketsOf[client.roomId][client.userName] = socket;
        });

        // 認証成功
        socket.emit('credential ok', client, {});

        // 既存クライアントにメンバーの変更を通知
        var members = Object.keys(socketsOf[client.roomId]);
        emitToRoom(client.roomId, 'update members', members);
        if (members.length === 1) {
            socket.emit('battle wait');
        }
        if (members.length === 2) {
            emitToRoom(client.roomId, 'battle start');
        }
    });

    // ソケットが切断された場合、ソケット一覧からソケットを削除
    socket.on('disconnect', function () {
        socket.get('client', function (err, client) {
            var sockets = socketsOf[client.roomId],
                members = Object.keys(sockets);
            if (err || !client) {
                return;
            }
            if (sockets !== undefined) {
                delete sockets[client.userName];
            }
            battleCount -= 1;
            if (members.length === 0) {
                delete socketsOf[client.roomId];
            } else {
                emitToRoom(client.roomId, 'update members', members);
                emitToRoom(client.roomId, 'battle wait', members);
            }
        });
    });

    // setHand
    socket.on('setHand', function (client, fn) {
        var sockets = socketsOf[client.roomId],
            clientData = client;
        Object.keys(sockets).forEach(function (key) {
            if (sockets[key] === sockets[client.from]) {
                sockets[client.from].selectedHand = clientData.selectHand;
            } else {
                sockets[key].emit('getStatus', clientData, fn);
            }
        });
    });

    // battleReset
    socket.on('battleReset', function (client) {
        var sockets = socketsOf[client.roomId];
        Object.keys(sockets).forEach(function (key) {
            sockets[key].selectedHand = undefined;
        });
    });

    // getEnemyData
    socket.on('getEnemyData', function (client, fn) {
        var sockets = socketsOf[client.roomId],
            clientData = client,
            enemyName,
            enemySelect;
        Object.keys(sockets).forEach(function (key) {
            if (key !== clientData.userName) {
                enemyName = key;
                enemySelect = sockets[enemyName].selectedHand;
            }
        });
        sockets[clientData.userName].emit('battle judge', enemySelect, fn);
    });

    //battle timeout
    socket.on('battleTimeout', function (client) {
        var sockets = socketsOf[client.roomId],
            result;
        Object.keys(sockets).forEach(function (key) {
            if (sockets[key].selectedHand === undefined) {
                result = "lose";
            } else {
                result = "win";
            }
            sockets[key].emit('battle timeout', result);
        });
    });

};

