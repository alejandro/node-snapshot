var express = require('express');
var crypto = require('crypto')
var app = express.createServer();
var url_ =require('url');
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
});
app.get('/',function(req,res){
  var  url = 'http://' + req.query.url,
  options= {uri:url, headers:req.headers};
  var exec = require('child_process').exec;
  var now = new Date().getTime();
  var name =md5(url + now);
  try {
    exec(['phantomjs ',__dirname + '/render.js', url, name].join(' '), function(err,stdout,stderr){      
      res.writeHead(200,{'Content-Type':'text/html'});
      if (err){
        res.write('Total time: ' +( new Date().getTime() - now )+ 'ms');
        res.write('\n<p> go to <a href="/render/' + name + '.png">' + name+ '.png</a></p>')  
      } else {
        res.write('Total time: ' +( new Date().getTime() - now) + 'ms');
        res.write('\n<p> go to <a href="/render/' + name + '.png">' + name+ '.png</a></p>')  
      }
      res.end()
    });  
  } catch(err){
      res.write('Total time: ' + (new Date().getTime() - now )+ 'ms');
      res.write('\n<p> go to <a href="/render/' + name + '.png">' + name+ '.png</a></p>')
      res.end()
  }
});
app.get('/render/:filename(*)',function(req,res){
  try {
    res.sendfile('./render/' + req.params.filename);
  } catch(e){
    res.end('ERROR NO EXISTE');
  }
})
 process.on('uncaughtException', function(excp) {
  console.log(excp.message);
  console.info((excp.stack).grey);
});
var md5 = module.exports.md5 = function(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}
app.listen(9000);
