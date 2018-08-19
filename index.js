"use strict";

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const _ = require('lodash');
const robotcop = require('robotjs');

const port = process.env.PORT || 3000;

server.listen(port, () => {
  let logMsg = 'Server listening at port ' + port;
  logger(logMsg);
});

app.get('/getAction/:action/:button', (req, res)=>{
  let command = '';
  let action = req.params.action;
  let fakebutton = '<button onclick="alert(\'123\')">Faker</button>'

  logger(action);

  if (typeof action === 'string') {
    switch (action.toLowerCase()) {
      case 'move':
        let x = req.params.X;
        let y = req.params.Y;
        logger(x);
        logger(y);
        if (isNaN(x) || isNaN(y)) {
          res.send('Wrong coordinate sent');
        } else {
          command = {
            event: action,
            x: x,
            y: y
          };
          robotcop.moveMouse(x, y);
          io.emit('command', command);
          res.send('Successfully sent');
        }
        break;
      case 'click':
        let button = req.params.button;
        logger(button);
        command = {
          event: action,
          button: button || 'left'
        };

        // io.emit('command', command);
        res.send(fakebutton);
        robotcop.moveMouse(370, 450);
        robotcop.keyToggle(String.fromCharCode(16), 'down', 'shift');

        // setTimeout(()=>{
        //   robotcop.mouseClick(button);
        // }, 500);
        //Mouse down at 0, 0 and then drag to 100, 100 and release.
        // robotcop.keyToggle('shift', 'down');
        robotcop.mouseToggle("down");
        // robotcop.keyToggle('shift', 'down');
        robotcop.dragMouse(370, 550);
        // robotcop.setMouseDelay(100);
        // robotcop.setKeyboardDelay(100);
        // robotcop.moveMouse(370, 420);

        setTimeout(()=>{
          robotcop.dragMouse(370, 600);
          robotcop.keyToggle(String.fromCharCode(16), 'up', 'shift');
          robotcop.mouseToggle("up");
          // robotcop.keyToggle("shift", "down");
          // robotcop.mouseToggle("down");
          // robotcop.dragMouse(370, 650);
        }, 5000);
        // // robotcop.dragMouse(370, 650);
        // setTimeout(()=>{
        //   // robotcop.mouseToggle("down");
        // //   robotcop.dragMouse(370, 650);
        // }, 1000);
        // for (let index = 0; index < 10; index++) {
        //   let mouse = robotcop.getMousePos();
        //   logger(mouse.y);
        //   robotcop.dragMouse(25, mouse.y + 50);

        // }




        // robotcop.dragMouse(25, 340);
        // robotcop.dragMouse(25, 440);
        // robotcop.dragMouse(25, 540);
        // robotcop.dragMouse(25, 640);
        // setTimeout(()=>{
        //   robotcop.mouseToggle("up");
        // }, 1500);
        break;
      default:
        res.send('Action is not recognize');
    }
  } else {
    res.send('No action send');
  }

});

pathFoctory();

io.on('connection', (socket) => {
  logger('Connected!');
});

/**
 * @name pathFoctory
 * @description Generate path and serve it to express server
 */
function pathFoctory () {
  let pathObj = {
    'public' : '/',
    'node_modules/socket.io-client/dist': '/js',
    'node_modules/jquery/dist': '/js',
  };

  _.forEach(pathObj, (v,k) => {
    logger(path.join(__dirname, k));
    let fullPath = express.static(path.join(__dirname, k));
    app.use(v, fullPath);
  });
}

/**
 * @name logger
 * @description Log everything arguments that passed
 */
function logger () {
  _.forEach(arguments, (v,k) => {
    console.log(v); // log whatever that come in
  });
}
