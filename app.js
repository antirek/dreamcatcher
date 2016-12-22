var AsteriskManager = require('asterisk-manager');
var mongoose = require('mongoose');
var moment = require('moment');
var config = require('config');
var console = require('tracer').colorConsole();

var Schema = mongoose.Schema;

var db = mongoose.createConnection(config.mongo);

var Event = db.model('Event', new Schema({
    date: String,
    data: String
}));
    
var saveUserEventData = function (data) {

    var event = new Event({
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        data: data
    });

    event.save(function (err, ev) {
        if (err) {
            console.log(err);
        } else {
            console.log('user event saved');
        }
    });
};
    
var run = function (node) {
    console.log("Start monitoring events for node " + node.name);
    var ami = new AsteriskManager(node.ami.port, node.ami.host, node.ami.username, node.ami.password);
    ami.keepConnected();
    ami.on('userevent', function (data) {
        console.log(node.name, 'userevent', data.userevent)
        saveUserEventData(data)
    });
}

run(config.node);