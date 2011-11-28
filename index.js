var request = require('request');
var jsdom = require('jsdom');
var express = require('express')
var app = express.createServer();
var url_ =require('url');
app.configure(function(){
  app.use(express.bodyParser());
});
app.get('/',function(req,res){
  var  url = 'http://' + req.query.url;
  request(url, function(e,d,b){
    if (!e){
      jsdom.env({html: b,scripts: []}, function (err, window) {
        var imgs =[], document = window.document;
        for(var i in document.images){
          if (document.images[i].src != undefined){
            var r = url_.parse(document.images[i].src).hostname;
             if (url_.parse(document.images[i].src).hostname != undefined){
               imgs.push(document.images[i].src)
             }else {                
               imgs.push(url +(document.images[i].src.substr(0,1)==='/' ? document.images[i].src : '/'+ document.images[i].src ));
             }
           }
           if (i === 'length'){
             res.writeHeader(200,{'Content-Type':'application/json'})
             res.end(JSON.stringify(imgs));
           }
        }
     });
    } else {
     res.writeHead(404);
     res.end(' No found  ');
    }
  });
});
app.listen(9000);
