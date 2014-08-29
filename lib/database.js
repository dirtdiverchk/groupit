var express = require('express');
var mysql = require('mysql');
var bodyp = require('body-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session');


exports.conectarDB = function (){


	var connection = mysql.createConnection({
	   host: '192.168.0.200',
	   user: 'groupit',
	   password: 'lobito',
	   database: 'groupit',
	   port: 3306
	});


	connection.connect(function(error){
	   if(error){
	      throw error;
	   }else{
	      console.log('Conexion a groupitDB correcta.');
	      
	   }
	});



	return (connection);

	};




exports.login = function(req, res, connection){

	var app = express();

	//Coller os datos do login
	login = {
		sid:"",
		username:"",
		pass:"",
		id:"",
		auth: false
	};

	login.sid	=	req.session.id;
	login.username = req.body.user;
	login.pass = req.body.pass;

	//Llamar a la base de datos para comprobar username+pass

	connection.query('SELECT id,pass from usuario WHERE user="'+login.username+'";', function(err, results) {
	 
	  if(results.length == 0){

	  	//console.log("Usuario NOT OK");

	  }else if(results[0].pass == login.pass){

	  	//console.log("Usuario OK, pass OK");
	  	login.id = results[0].id;
	  	login.auth = true;

	  }else{

	  	//console.log("Usuario OK, pass NOT OK");

	  }


	  //SÍ, se autentico bien
	  if(login.auth){
		//Comprobar que no existe ya la sesion??? login desde varios sitios vs multiples sesiones...

		connection.query('DELETE FROM session WHERE id="'+login.id+'";', function(err, results) {

		if(err){
			      throw err;
			  	}

			//Almacenar session
			connection.query('INSERT INTO session (id, sid) VALUES ("'+login.id+'","'+login.sid+'");', function(err, results) {

				if(err){
			      throw err;
			  	}

			  	//REDIRECCION de página

			  	res.redirect(303, '/user.html'); 
			   	

			});

		});

	//NO, se autentico mal
	}else{

	res.redirect(303, '/index.html?loginerror'); 

	}

	 
	});
	
};


exports.logout = function(req, connection){



	connection.query('DELETE FROM session WHERE sid="'+req.session.id+'";', function(err, results) {

		if(err){
			      throw err;
			  	}

	});

	req.session.destroy(function(err) {
  
	});


};


exports.newGrupo = function(req, connection, newGrupo, res){


	connection.query('SELECT id from session WHERE sid="'+req.session.id+'";', function(err, results) {

		if(err) {
			throw err;
		}
		
		if(results.length == 0){
			console.log("newGrupo --> El usuario no esta logueado");
		}else{

			var usuario = results[0].id; 

			//Quitar Espacios

			var nombregrupo = newGrupo.nombre.replace(/ /g,"_");

			
		var resp = {
			result: true
		}

		connection.query('INSERT INTO grupo (nombre, creador) VALUES ("'+nombregrupo+'","'+usuario+'");'
		,function(err,results){
			if(err){resp.result = false}

			connection.query('SELECT id FROM grupo WHERE nombre="'+nombregrupo+'" AND creador="'+usuario+'";'
			,function(err, results){
				if(err){resp.result = false}
				

				connection.query('INSERT INTO usuario_grupo (id_u, id_g) VALUES ("'+usuario+'","'+results[0].id+'");'
				,function(err, results){
					if(err){resp.result = false}
					
					res.send(resp);


				});
			});
		});


		}

	});

	
};


exports.getGrupos = function(req, res, connection){

	//Devolver un json con los grupos en los que esta...
	var resp = {
		numGrupo: 0,
		grupos: []
	};

	connection.query('SELECT id from session WHERE sid="'+req.session.id+'";', function(err, results) {
	
		if(err){
			throw err;	
		} 

		if(results.length == 0){
			console.log("getGrupos --> El usuario no esta logueado");
			

		}else{

			var usuario = results[0].id;
			connection.query('SELECT grupo.nombre FROM usuario_grupo join grupo on grupo.id=usuario_grupo.id_g where usuario_grupo.id_u="'+usuario+'";', function(err, results) {


				if(err){throw err;} 

				if(results.length == 0){
					//El usuario no está en ningún grupo
					res.send(resp);
				
				}else{
				
					for(i=0; i<results.length; i++){

						resp.grupos.push(results[i]);
						resp.numGrupo += 1; 


					}

					res.send(resp);


				}


			});

		}
	
	});

};


exports.infoGrupo = function(req, res, connection){



	var idgrupo = req.body.idgrupo;

	if (idgrupo==undefined){idgrupo=0};



	connection.query('SELECT id from session WHERE sid="'+req.session.id+'";', function(err, results) {

		if(err){throw err;} 

		if(results.length == 0){
			console.log("getGrupos --> El usuario no esta logueado");
		}else{
			
			connection.query('SELECT ug.id_u, u.user FROM usuario_grupo as ug join usuario as u on ug.id_u=u.id WHERE ug.id_g="'+idgrupo+'";', function(err, results) {

				if(err){throw err;} 

				res.send(results);
				

			});
		}
	});
};





















	



