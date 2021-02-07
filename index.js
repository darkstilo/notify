const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json');
const path = require('path');
const http = require('http');
const express = require('express')
const socketio = require('socket.io');

//Express
const app = express() 

const server = http.createServer(app)
const io = socketio(server);

//Diretory
//var bodyParser = require("body-parser");
//var server      = require('http').createServer(app);
//var io          = require('socket.io')(server);

const removeEmojis = text => text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|:[a-z_-]+:)/gi, '').trim();

const parseEmbed = embed => {
    if (embed && embed.title && embed.title.includes('Trabalho de Entrega')) {
        const final = Object.fromEntries(embed.fields.map(({
            name,
            value
        }) => [name, removeEmojis(value)]));
        final['Detalhes'] = Object.fromEntries(final['Detalhes'].split('\n').map(line => line.split(': ')));
        final.author = embed.author && embed.author.name;
        return final;
    }
};

client.on("ready", () => {
    console.log(`Bot foi iniciado, com ${client.users.cache.size} usuários, em ${client.channels.cache.size} canais, em ${client.guilds.cache.size} servidores.`); 

});

client.on("message", async message => {

    if(message.channel.type === "dm") return

    const embed = parseEmbed(message.embeds[0]);
    if (embed) {
        //await message.channel.send(`Entrega feita por ${embed.author}, a partir de ${embed['A partir de']} para ${embed['Para']}, de ${embed.Detalhes['Distância Aceita']} KM/H.`);
        console.log(`Entrega feita por ${embed.author}, a partir de ${embed['A partir de']} para ${embed['Para']}, de ${embed.Detalhes['Distância Aceita']} KM/H.`)
        
        //var motorista = `${embed.author}`
        //var origem = `${embed['A partir de']}`
        //var destino = ` ${embed['Para']}`
        //var distancia = `${embed.Detalhes['Distância Aceita']}`

        const data = {
            motorista: `${embed.author}`,
            origem: `${embed['A partir de']}`,
            destino: `${embed['Para']}`,
            distancia: `${embed.Detalhes['Distância Aceita']}`
          }

        io.emit('message', data);
    }
});

const data2 = {
    motorista: `RandallDustY`,
    origem: `Quiel`,
    destino: `Quiel`,
    distancia: `2555 km`
  }

  const data3 = {
    motorista: `RandallDustY`,
    origem: `Quiel 2`,
    destino: `Quiel 2`,
    distancia: `2555 km`
  }

  setTimeout(function() {
    io.emit('message', data2);
}, 3000);

setTimeout(function() {
    io.emit('message', data3);
}, 11000);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Run when client connects
io.on('connection', socket => {

    // Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined');

    // Runs when client disconnect
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
        console.log('O cliente foi desconectado')
    });
});

const PORT = 4141 || process.env.PORT;

server.listen(PORT, () => console.log(`Servidor funcionando na porta ${PORT}`));

client.login(config.token);