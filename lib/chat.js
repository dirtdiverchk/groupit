var io = require('socket.io');


exports.startIO = function(){

	var socket = io.listen(3001);

};


