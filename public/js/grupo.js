var socket = null;

function init(){
	
	socket = io.connect("http://192.168.0.180:3000");
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

	location.href='index.html';


};




