const { Client, MessageAttachment} = require('discord.js');
const client = new Client();
const {token, prefix} = require('./config.json');

// arguments for url
let url = [
  "https://chart.googleapis.com/chart?",
  "cht=qr",
  "choe=UTF-8",
]

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(token);

client.on('message', message => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  // scan qr
  if(message.content.slice(1).split(' ')[0] === 'qr') {
    const regexp1 = new RegExp('"(.*?)"', 'i'); // match with string wrapped quote ""
    const regexp2 = new RegExp("'(.*?)'", 'i'); // match with string wrapped quote ''
    const result = message.content.trim().match(regexp1) || message.content.trim().match(regexp2);

    if(!result) {
      sendError(message, 'Not have any arguments')
      return;
    } 

    // reg scan size : /size=(\d*[x]\d*)/i
    const regSize = new RegExp('size=(\\d*[x]\\d*)', 'i');
    let size = message.content.match(regSize);
    if(size) url.push(`chs=${size[1]}`);
    else url.push('chs=200x200'); // size default

    let content = result[1].trim().replace(' ', '+'); // take content wrapepd by quote in message
    url.push(`chl=${content}`);

    message.channel.send(url.join('&')); // send qr code
  }
})

function sendError(message, error) {
  message.reply(error);
}
