// battle.js
(function (global) {
    var socket,
        document = global.document;

    function battle() {
        var targetElem = {},
            battleData = {
                userName: params.user,
                roomId: params.room,
                countTime: 10,
                commend: false,
                enemyCommend: false
            };

        socket = io.connect('http://localhost');
        // サーバーへの接続完了
        socket.on('connected', function () {
            socket.emit('check credential', battleData);
        });

        // 認証成功
        socket.on('credential ok', function (data) {
            battleData.roomId = data.roomId;
        });

        // ルームに同名ユーザー存在 再度生成
        socket.on('userName exists', function () {
            battleData.userName = 'user' + Math.floor(Math.random() * 100);
            socket.emit('check credential', battleData);
        });

        socket.on('battle wait', function () {
            battleCtrl.battleWait();
        });

        socket.on('battle start', function () {
            battleCtrl.battleStart();
        });

        socket.on('battle judge', function (data) {
            battleCtrl.judge(data);
        });

        socket.on('battle timeout', function (result) {
            battleCtrl.battleResult(result);
        });

        socket.on('update members', function (members) {
            battleCtrl.membersSet(members);
        });

        socket.on('getStatus', function () {
            battleData.enemyCommend = true;
            battleCtrl.enemySet();
        });

        var battleControler = function () {
        };
        battleControler.prototype = {
            init: function () {
                var that = this, i;
                targetElem.modalBg = document.querySelector('.modalBg');
                targetElem.modal = document.querySelector('.modalWindow');
                targetElem.battleView = document.querySelector('.battleView');
                targetElem.timeVal = document.querySelector('.countTime > .val');
                targetElem.myHand = document.querySelector('.handList > .you');
                targetElem.enemyHand = document.querySelector('.handList > .enemy');
                targetElem.handList = document.querySelectorAll('.handList.command > li');
                targetElem.membersList = document.querySelectorAll('.userNameList > li');
                for (i = 0; i < targetElem.handList.length; i++) {
                    (function (arg) {
                        targetElem.handList[arg].addEventListener('click', function () {
                            that.commandSet(arg);
                        }, false);
                    })(i);
                }
            },

            battleStart: function () {
                var that = this;
                targetElem.modalBg.style.display = "none";
                targetElem.modal.style.display = "none";
                targetElem.battleView.classList.add("start");
                that.timeCount(battleData.countTime);
            },

            battleReset: function () {
                var that = this;
                clearTimeout(that.timmer);
                battleData.commend = false;
                battleData.enemyCommend = false;
                battleData.countTime = 10;
                targetElem.timeVal.innerHTML = "00:10";
                targetElem.enemyHand.style.webkitAnimationPlayState = "";
                targetElem.myHand.style.webkitAnimation = "";
                targetElem.enemyHand.classList.remove("selected");
                socket.emit('battleReset', battleData);
            },

            battleReStart: function () {
                var that = this;
                that.battleReset();
                that.timeCount(battleData.countTime);
            },

            timeCount: function (time) {
                var that = this,
                    limitTime = time;
                if (limitTime > 0 && battleData.commend == false) {
                    that.timmer = setTimeout(function () {
                        limitTime -= 1;
                        targetElem.timeVal.innerHTML = "00:0" + limitTime;
                        that.timeCount(limitTime);
                    }, 1000);
                } else if (limitTime === 0) {
                    socket.emit('battleTimeout', battleData);
                }
            },

            commandSet: function (arg) {
                var that = this,
                    num = parseInt(arg + 1);
                targetElem.myHand.style.webkitAnimation = "none";
                battleData.commend = true;
                targetElem.myHand.className = "you"
                targetElem.myHand.classList.add("hand0" + num);
                if (num === 1) {
                    battleData.selectHand = "g";
                }
                if (num === 2) {
                    battleData.selectHand = "c";
                }
                if (num === 3) {
                    battleData.selectHand = "p";
                }
                battleData.from = battleData.userName;
                socket.emit('setHand', battleData, {});
                if (battleData.enemyCommend) {
                    socket.emit('getEnemyData', battleData, {});
                } else {
                    return false;
                }
            },

            enemySet: function () {
                var that = this;
                targetElem.enemyHand.style.webkitAnimationPlayState = "paused";
                targetElem.enemyHand.classList.add("selected");
                if (battleData.commend) {
                    socket.emit('getEnemyData', battleData, {});
                } else {
                    return false;
                }
            },

            judge: function (enemySelectedHand) {
                var that = this,
                    enemyHand = enemySelectedHand,
                    drawIcon;
                if (enemyHand === "g" && battleData.selectHand === "p" || enemyHand === "c" && battleData.selectHand === "g" || enemyHand === "p" && battleData.selectHand === "c") {
                    //勝ち
                    that.battleResult("win");
                } else if (enemyHand === "g" && battleData.selectHand === "g" || enemyHand === "c" && battleData.selectHand === "c" || enemyHand === "p" && battleData.selectHand === "p") {
                    //あいこ
                    drawIcon = document.createElement("p");
                    drawIcon.className = "pic battleDraw";
                    targetElem.battleView.classList.add("draw");
                    drawIcon.addEventListener('webkitAnimationEnd', function () {
                        targetElem.battleView.removeChild(drawIcon);
                        targetElem.battleView.classList.remove("draw");
                    }, false);
                    targetElem.battleView.appendChild(drawIcon);
                    that.battleReStart();
                } else {
                    //負け
                    that.battleResult("lose");
                }
            },

            battleWait: function () {
                targetElem.modalBg.style.display = "block";
                targetElem.modal.style.display = "block";
            },

            membersSet: function (members) {
                var that = this, i;
                that.battleReset();
                for (i = 0; i < members.length; i++) {
                    targetElem.membersList[i].innerHTML = members[i];
                }
            },

            battleResult: function (result) {
                if (result === "lose") {
                    location.href = "/result?result=lose";
                } else if (result === "win") {
                    location.href = "/result?result=win";
                }
            }
        };
        var battleCtrl = new battleControler();
        battleCtrl.init();
    }
    document.addEventListener('DOMContentLoaded', battle, false);
})(this);

