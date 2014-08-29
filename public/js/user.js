var socket = null;

function init(){
	
	socket = io.connect("http://192.168.0.180:3001");
	socket.on("mensaje", msgRec);

};


$(document).ready(function(){ //Todo el código jQuery dentro de esto

	//En la entrada de texto del chat cuando se presione enter hace click en send.
	$("#chatinput").keyup(function(event){
	    if(event.keyCode == 13){
	        $("#send").click();
	    }
	});
	

});





function mensaje(){

	var content = document.getElementById("chatinput").value;

	console.log("content: "+ content);

	socket.emit("mensaje", {user:"iago",content:content});

};

function msgRec(msg){

	console.log(msg.content);
	var chat = document.getElementById("chatwindow");
	chat.innerHTML += "<br>" +msg.user+": "+ msg.content;
	
	chat.scrollTop = chat.scrollHeight; //Scroll queda abajo
	document.getElementById("chatinput").value = "";

};

function grupo(){

	location.href='grupo.html';


};

function newGrupo(){

	var nombre = document.getElementById("groupName").value;

	var data = {};
	data.nombre = nombre;
	
	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://192.168.0.180:3000/grupos/newGrupo',						
        
        success: function(data) {
            
            var pantalla = document.getElementById("chatwindow");
            pantalla.innerHTML = pantalla.innerHTML + data.result; 
        }
    });

};

function getGrupos(){

	var data = {};
	

	$.ajax({
		type: 'GET',
		data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://192.168.0.180:3000/grupos/getGrupos',						
        
        success: function(data) {
            
            var pantalla = document.getElementById("chatwindow");
            pantalla.innerHTML = pantalla.innerHTML + data.numGrupo;
            return data; 
        }
    });

};

function infoGrupo(){

	var idgrupo = document.getElementById("groupId").value;

	var data = {}
	data.idgrupo = idgrupo;
	

	$.ajax({
			type: 'POST',
			data: JSON.stringify(data),
	        contentType: 'application/json',
	        url: 'http://192.168.0.180:3000/grupos/infoGrupo',						
	        
	        success: function(data) {
	            
	            var pantalla = document.getElementById("chatwindow");
	            
	            if (data!=undefined){
	            	for(i=0;i<data.length;i++){
	            		pantalla.innerHTML += data[i].user;
	            	}
	            }
	            if(data.length == 0){
	            	pantalla.innerHTML += "-";
	            }

	            return data; 
	        }
	});


};















