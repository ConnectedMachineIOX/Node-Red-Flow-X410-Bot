const {
    BotkitConversation
   } = require('botkit');
   var http = require('follow-redirects').http;
   var fs = require('fs');
   module.exports = function(controller) {
   
    const convo = new BotkitConversation('led', controller);
   
    convo.ask('To turn on or off led type `LED1-On`, `LED2-On`, `LED3-On`, `motorOn`,  `LED1-Off`, `LED2-Off`, `LED3-Off`, `motorOff` and `cancel` to leave loop ', [{
      pattern: 'LED1-On',
      handler: async (response, convo) => {
        myFunc('/R1',"true")
       convo.gotoThread('light1');
      }
     },
     {
      pattern: 'LED2-On',
      handler: async (response, convo) => {
        myFunc('/R2',"true") 
       await convo.gotoThread('light2');
      },
     },
     {
      pattern: 'LED3-On',
      handler: async (response, convo) => {
        myFunc('/R3',"true")
       await convo.gotoThread('light3');
      },
     },   
      {
        pattern: 'motorOn',
        handler: async (response, convo) => {
          myFunc('/R4',"true")
         await convo.gotoThread('light3')
        },
       },   
     {
        pattern: 'LED1-Off',
        handler: async (response, convo) => {   
            myFunc('/R1',"false")
            await convo.gotoThread('light1off');
        },
       },
       {
        pattern: 'LED2-Off',
        handler: async (response, convo) => {
            myFunc('/R2',"false")
         await convo.gotoThread('light2off');
        },
       },
       {
        pattern: 'LED3-Off',
        handler: async (response, convo) => {   
            myFunc('/R3',"false")
            await convo.gotoThread('light3off');
        },
       },
       {
        pattern: 'motorOff',
        handler: async (response, convo) => {   
            myFunc('/R4',"false")
            await convo.gotoThread('light3off');
        },
       },
       {
        pattern: 'no|neh|non|na|birk|cancel|stop|exit',
        handler: async ( response, convo ) => {

            await convo.gotoThread( 'cancel' );
        },
    },
    {
        default: true,
        handler: async ( response, convo ) => {
            await convo.gotoThread( 'bad_answer' );
        }
    }
]);
   //adds the messages to the convo 
    convo.addMessage({
     text: 'Sorry, I did not understand...',
     action: 'default',
    }, 'bad_answer');
    convo.addMessage({
        text: 'Turning on LED1 \n',
        action: 'default',
       }, 'light1');
       convo.addMessage({
        text: 'Turning on LED2 \n',
        action: 'default',
       }, 'light2');
       convo.addMessage({
        text: 'Turning on LED3 \n',
        action: 'default',
       }, 'light3');
       convo.addMessage({
        text: 'Turning off LED1 \n',
        action: 'default',
       }, 'light1off');
       convo.addMessage({
        text: 'Turning off LED2 \n',
        action: 'default',
       }, 'light2off');
       convo.addMessage({
        text: 'Turning off LED3 \n',
        action: 'default',
       }, 'light3off');
       convo.addMessage({
        text: 'Got it, cancelling...',
        action: 'stop', // this marks the converation as unsuccessful
    }, 'cancel');
    controller.addDialog(convo);
   
   
    controller.hears('showLights', 'message,direct_message', async (bot, message) => {
   
     await bot.beginDialog('led');
    });
   
   
    controller.commandHelp.push({
     command: 'showLights',
     text: 'shows which lights can be turned on'
    });
   
   }
   //this is the function for the get request sent 
   function myFunc(path, data) {
    var options = {
        'method': 'POST',
        'hostname': '127.0.0.1',
        'port': 1880,
        'path': path,
        'headers': {
         'Content-Type': 'application/json'
        },
        'maxRedirects': 20
       };
   
       var req = http.request(options, function(res) {
        var chunks = [];
   
        res.on("data", function(chunk) {
         chunks.push(chunk);
        });
   
        res.on("end", function(chunk) {
         var body = Buffer.concat(chunks);
         console.log(body.toString());
        });
   
        res.on("error", function(error) {
         console.error(error);
        });
       });
   
       var postData = JSON.stringify({
        "Value": data
       });
   
       req.write(postData);
   
       req.end();
   }