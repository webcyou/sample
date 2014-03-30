/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Node.js PvP じゃんけん' });
};

exports.battle = function(req, res) {
  var roomName = 'battleRoom',
      yourName = 'user' + Math.floor(Math.random() * 100),
  params = {
    title: 'Node.js PvP じゃんけん',
    room: { name: roomName },
    user: { name: yourName }
  };
  res.render('battle', params);
};

exports.result = function(req, res) {
  var battleResult = req.query.result,
  params = {
    title: 'Node.js PvP じゃんけん',
    battleResult: battleResult
  }
  res.render('result', params);
};