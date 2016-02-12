var express = require('express');
var bodyParser = require('body-parser');
var Twitter = require('twitter');
var request = require('request');
var app = express();

app.use(bodyParser());

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.send("Hello, World!");
});

var tweets_res = '';

app.get('/tweets/:query', function (req, res){
    var master_tweet = '';
    var client = new Twitter({
                consumer_key: '<<CONSUMERKEY>>',
                consumer_secret: '<<CONSUMERSECRET>>',
                access_token_key: '<<ACCESSTOKEN>>',
                access_token_secret: '<<ACCESSTOKENSECRET>>'
    });
    var par = {count: '5', q: '@'+req.params.query, lang: 'en'};
    client.get('search/tweets', par, function(error, tweets, response){
        if(!error){
          // res.send(statuses);
          
          tweets_res = tweets.statuses;      
            for(var i=0;i<5;i++){
            master_tweet += tweets.statuses[i].text.replace(/[@,#]/g," ") + ' ';
            }
            console.log(master_tweet);
            request("http://localhost:5000/sentiment/"+master_tweet, function(error, response, body) {
                console.log("Score : "+body);
                res.send(200, body);
        });
            }
        });
    });

app.get('/sentiment/:msg',function (req, res){
    request("https://api.havenondemand.com/1/api/sync/analyzesentiment/v1?text="+req.params.msg+"&apikey=<<HAVENAPIKEY>>", function(error, response, body) {
                var resp = body;
                var a = JSON.parse(resp);
                var tmp = a.aggregate.score.toFixed(3);
                if(tmp>0)
                   res.send(200,tmp);
                else
                  res.send(200,tmp);
            });
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
