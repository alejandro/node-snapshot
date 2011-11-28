var request = require('request');
var jsdom = require('jsdom');
var express = require('express')
var app = express.createServer();
var url_ =require('url');
app.configure(function(){
  app.use(express.bodyParser());
});
app.get('/',function(req,res){
  var  url = 'http://' + req.query.url,
  options= {uri:url, headers:req.headers};
if (/^(http:\/\/)([\w]+\.){1,}[A-Z]{2,}\b/gi.test(url)){
 request(url, function(e,d,b){
    if (b != undefined && b != null){
    b = new Buffer(b);b = b.toString(); var n = 0;
      jsdom.env({html: b,scripts: []}, function (err, window) {
        if (err){
          res.end('["ERROR","Internal server error"]');
        }else{
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
           if (Object.keys(document.images).length === n) {
             res.writeHeader(200,{'Content-Type':'application/json'})
             res.end(JSON.stringify(imgs));
           }
           n++;
        }
        }
     });
      
    } else {
     res.writeHead(404);
     res.end('["No found: Use\n http://snap.nodejitsu.com/?url=URL"]');
    }
  });
} else {
  res.writeHead(200);
  res.end('["Invalid URL"]');
}

 });
 process.on('uncaughtException', function(excp) {
  console.log(excp.message);
  console.info((excp.stack).grey);

});
app.listen(9000);
