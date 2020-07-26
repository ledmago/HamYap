var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});
var oyuncular = Array();
var solposition = Array();
var yukariposition = Array();
var ozelkodfunc = Array();
var allconnection = Array();

io.on('connection', function(socket){

	
  socket.on('baglanankullanici', function(nick,ozelkod){
	
	  if(oyuncular.indexOf(nick) == "-1")
	  {
	  
	   console.log(nick + ' sunucuya ' + ozelkod + ' ile baglandi');
	  
	   oyuncular.push(nick);
	    console.log(oyuncular);
	    solposition.push(0);
		 yukariposition.push(0);
		 ozelkodfunc.push(ozelkod);
		 allconnection.push(socket);
		 



				
		  }
							  oyuncular.forEach(function(entry) {
								  var numara = oyuncular.indexOf(entry);
						 io.emit('hizala', oyuncular[numara], solposition[numara], yukariposition[numara]);
											io.emit('ekle', oyuncular[numara]);
					});
		 
  });
  
  
     socket.on('disconnect', function() {
      

      var i = allconnection.indexOf(socket);
	  	  console.log(oyuncular[i] + ' Oyundan Çıktı !');
		     io.emit('oyuncu_sil',oyuncular[i]);
      allconnection.splice(i, 1);
	  oyuncular.splice(i,1);
	  solposition.splice(i,1);
	  ozelkodfunc.splice(i,1);
	  yukariposition.splice(i,1);


   });

});


io.on('connection', function(socket){
	
 // console.log('a user connected');
  


  
  
  
  
   
});

io.on('connection', function(socket){

	
	
	
  socket.on('posizyon_degis', function(nick,sol,ust){
	  
 if(oyuncular.indexOf(nick) != "-1")
 {
	 console.log(nick +' ' + gelenid);
	 var gelenid = oyuncular.indexOf(nick);
	 solposition[gelenid] = sol;
	 yukariposition[gelenid] = ust;
	     io.emit('kullanici_hizala',nick,sol,ust);
 }
  });
 
  
  socket.on('yondegis', function(nick,rotati){
 if(oyuncular.indexOf(nick) !== "-1")
 {
	 var gelenid = oyuncular.indexOf(nick);
	 ozelkodfunc[gelenid] = rotati;
	     io.emit('yon_hizala',nick,rotati);
 }
  });
  
  
  
});



io.emit('some event', { for: 'everyone' });

http.listen(3000, function(){
  console.log('listening on *:3000');
});