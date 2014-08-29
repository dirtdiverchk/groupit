var express = require('express');
var cookiep = require('cookie-parser');
var session = require('express-session');
var bodyp = require('body-parser');
//Módulos propios
var io = require('./lib/chat.js');
var db = require('./lib/database.js');


var app = express();

//Variables Globales
var connection;
var usuarios=[];

app.use(cookiep('lobitomexaporriba'));
app.use(session());
app.use(bodyp());


//Routing 	=============================================================

//HANDLERS RUTAS
app.get('/',function(req,res){

	req.session.lastPage = "/index.html";
	res.sendFile("/Users/MacIago/Dropbox/_DEVELOPER_/Proyectos/Juli-Iago/groupit2/public/index.html");

});

app.get('/index.html',function(req,res){

	req.session.lastPage = "/index.html";
	res.sendFile("/Users/MacIago/Dropbox/_DEVELOPER_/Proyectos/Juli-Iago/groupit2/public/index.html");

});


app.get('/user.html', function(req, res){

	req.session.lastPage = "/user.html";

	res.sendFile("/Users/MacIago/Dropbox/_DEVELOPER_/Proyectos/Juli-Iago/groupit2/public/user.html");

});


//HANDLER EVENTOS
app.post('/login', function(req, res){

	//Comprobar coa DB se as credenciales son válidas e redireccionar asegún.
	db.login(req, res, connection);

});

app.get('/logout', function(req, res){

	db.logout(req, connection);

	res.redirect(303, '/index.html'); 

});


//API GRUPOS
app.post('/grupos/newGrupo', function(req, res){ 
	
	var newGrupo = {
		nombre: "",
		id: ""
	};

	newGrupo.nombre = req.body.nombre;

	db.newGrupo(req, connection, newGrupo, res);

});

app.get('/grupos/getGrupos', function(req, res){

	db.getGrupos(req, res, connection);

});

app.post('/grupos/infoGrupo',function(req, res){

	db.infoGrupo(req,res, connection);

});


//API PRUEBA
app.get('/awesome', function(req, res){
  
  req.session.lastPage = "/awesome";

  res.send("Wow, you are awesome!");
  
});

app.get('/session', function(req, res){
  
	

  res.send("Session info: Last page: "+req.session.lastPage+" tok: "+req.session.tok);
  
});



app.use(express.static(__dirname + '/public'));


connection = db.conectarDB();


io.startIO();


//Escuchar
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});



//Funciones   ===========================================================

