var express = require('express');
var mysql = require('mysql');
var cookiep = require('cookie-parser');
var session = require('express-session');


var app = express();

//Variables Globales
var connection;

///////////////////// MODIFICADO POR MIN /////////////////
var usuarios=[];
//////////////////////////////////////////////////////////

app.use(cookiep('my secret here'));
app.use(session());
///////////////////// MODIFICADO POR MIN /////////////////
app.use(require('body-parser')());
//////////////////////////////////////////////////////////

//Routing 	=============================================================

app.get('/',function(req,res){

	req.session.lastPage = "/index.html";
	res.sendFile("/ProxectosNode/groupit2/public/index.html");


});

app.post('/login', function(req, res){

	//Comprobar credenciales e iniciar a galleta co id do usuario

	// req.session.tok = "imatoken";
	
///////////////////// MODIFICADO POR MIN /////////////////
	login = {
		sid:"",
		username:"",
	};

	login.sid	=	req.session.id;
	login.username = req.body.user;

	if (login){
		usuarios.push(login);
	};
	
	console.log(usuarios);
///////////////////////////////////////////////////////////////
	res.redirect(303, '/user.html'); 


});


app.get('/awesome', function(req, res){
  
  req.session.lastPage = "/awesome";
  res.send("Wow, you are awesome!");

});

app.get('/session', function(req, res){
  
  res.send("Session info: Last page: "+req.session.lastPage+" tok: "+req.session.tok);
  
  req.session.lastPage = "/session";

});


app.use(express.static(__dirname + '/public'));



conectarDB();

//Escuchar
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});



//Funciones   ===========================================================

function conectarDB(){

/*
	connection = mysql.createConnection({
	   host: 'localhost',
	   user: 'groupit',
	   password: 'lobito',
	   database: 'groupit',
	   port: 3306
	});


	connection.connect(function(error){
	   if(error){
	      throw error;
	   }else{
	      console.log('Conexion correcta.');
	   }
	}

*/
	console.log("Conexion a base de datos simulada OK.");

	};

