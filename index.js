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

var yem_isim = Array();
var yem_sol = Array();
var yem_ust = Array();


console.log("Yemler Yükleniyor..");
for(i = 0; i<140; i++)
{
	yem_isim.push(makeid());
	yem_sol.push(Math.floor(Math.random() * 4800) + 20);
	yem_ust.push(Math.floor(Math.random() * 2400) + 20);
	
	
}

for (i = 0; i<140; i++)
{
		var simdikiSol = Math.abs(yem_sol[i]);
	
		var simdikiUst = Math.abs(yem_ust[i]);
	yem_isim.forEach(function(entry) 
		 {
			var numara = yem_isim.indexOf(entry);
			var oncekiSol = Math.abs(yem_sol[numara]);
			var oncekiUst = Math.abs(yem_ust[numara]);
			
			var aradaki_bosluk = 300;
			
					if(Math.abs(simdikiSol - oncekiSol) < aradaki_bosluk)
					{
						var gelengiden = Math.abs(simdikiSol - oncekiSol);
						var tekrar_azalt = aradaki_bosluk - gelengiden;
						yem_sol[entry] += tekrar_azalt; 
						
					}
					
					if(Math.abs(simdikiUst - oncekiUst) < aradaki_bosluk)
					{
						var gelengiden2 = Math.abs(simdikiUst - oncekiUst);
						var tekrar_azalt2 = aradaki_bosluk - gelengiden2;
						yem_ust[entry] += tekrar_azalt2; 

					}
						
			
		});
	
}





io.on('connection', function(socket){

	
  socket.on('baglanankullanici', function(nick){
	
	if(nick != '')
	{
						  if(oyuncular.indexOf(nick) == "-1")
						  {
						  
						   console.log(nick + ' sunucuya  baglandi');
						  
						   oyuncular.push(nick);
							console.log(oyuncular);
							solposition.push(0);
							 yukariposition.push(0);
							 ozelkodfunc.push(0);
							 allconnection.push(socket);
							 



									
							  }
												  oyuncular.forEach(function(entry) {
											 var numara = oyuncular.indexOf(entry);
											 io.emit('hizala', oyuncular[numara], solposition[numara], yukariposition[numara]);
												io.emit('ekle', oyuncular[numara]);
										});
										
										//Yemleri Gönder
										
										 yem_isim.forEach(function(entry) 
										 {
											var numara = yem_isim.indexOf(entry);
											
											io.emit('yem_yukle', yem_isim[numara], yem_sol[numara], yem_ust[numara]);
										});
										
										
	}
  });
  
  
     socket.on('disconnect', function() {
      

      var i = allconnection.indexOf(socket);
	  	  console.log(oyuncular[i] + ' Oyundan Çıktı !');
		     io.emit('nesne_sil',oyuncular[i],'oyuncu');
      allconnection.splice(i, 1);
	  oyuncular.splice(i,1);
	  solposition.splice(i,1);
	  ozelkodfunc.splice(i,1);
	  yukariposition.splice(i,1);


   });

});



io.on('connection', function(socket){

	
	
	
  socket.on('posizyon_degis', function(nick,sol,ust,yon,burun_left,burun_top){
	  
 if(oyuncular.indexOf(nick) != "-1")
 {
	
	 var gelenid = oyuncular.indexOf(nick);
	 solposition[gelenid] = sol;
	 yukariposition[gelenid] = ust;
	  ozelkodfunc[gelenid] = yon;
	     io.emit('kullanici_hizala',nick,sol,ust,yon);
		 
		 
										yem_isim.forEach(function(entry) {
											 var numara = yem_isim.indexOf(entry);
											 var genislik = 30;
											 var yukseklik = 30;
											if((burun_left + 10  > yem_sol[numara] && burun_left < yem_sol[numara] + genislik) && (burun_top + 10 > yem_ust[numara] && burun_top < yem_ust[numara] + yukseklik))
											{
												   io.emit('nesne_sil',yem_isim[numara],'yem');
												
											}
											
										});
		 
		 
		 
 }
  });
 
  

  
  
});



io.emit('some event', { for: 'everyone' });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}