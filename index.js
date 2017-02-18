var colors = require('colors');
var fs = require('fs');
var start = true;

console.log('|------------------------------|');
console.log('| '+'REVERSE TUNNEL SSH 0.1'.green+'       |');
console.log('| '+'Por: CompuLabs.com.br'.blue+'        |');
console.log('| '+'Desenvolvimento: Victor Hugo'.yellow+' |');
console.log('|------------------------------|\n\n');

console.log('[OK]'.green+' Carregando configuração.');
var config = [];
process.argv.forEach((val, index) => {
	if(index > 1)
	{
		config[index-2] = val;
	}
});

function startsrv()
{
	var tunnel = require('reverse-tunnel-ssh');
	console.log('[OK]'.green+' Classe de tunelamento importada');
	console.log('[OK]'.green+' Conectando SSH com: '+config[0].yellow);
	console.log('[OK]'.green+' Iniciando tunelamento com: '+config[0].yellow);
	var conn = tunnel({
		host: config[0],
		username: config[2],
		password: config[3],
		port: config[1],
		dstHost: config[4],
		dstPort: config[5],
		srcHost: config[6],
		srcPort: config[7],
	}, function (error, clientConnection) {
		if (config[8] == true) {
			console.log('[REQUISICAO]'.green+' '+config[4]+':'+config[5]+" >> "+config[6]+":"+clientConnection._forwarding[config[4]+':'+config[5]]);
		}else{
			console.log('[REQUISICAO]'.green);
		}
	});
	conn.on('forward-in', function (port) {
		console.log('[OK]'.green+' Tunelamento rodando em: '+colors.red.bold(config[4]+":"+config[5])+"\n\n");
		var stream = fs.createWriteStream("./configuration.json");
		stream.once('open', function(fd) {
		  stream.write(JSON.stringify(config)+"\n");
		  stream.end();
		});
	});
}

if(config.length < 8)
{
	start = false;
	fs.stat('./configuration.json', function(err, stat) {
	    if(err == null) {
			console.log('[ALERTA]'.yellow+' Argumentos faltando, buscando arquivo de configuração');
			fs.readFile('./configuration.json', 'utf8', function (err,data) {
				if (err) {
					console.log('[ERRO]'.red+err);
				}else{
					config = JSON.parse(data);
					if(config.length < 8)
					{
						console.log('[ERRO]'.red+' Argumentos faltando no arquivo de configuração');
					}
					else
					{
						console.log('[OK]'.green+' Configuração carregada');
						startsrv();
					}
				}
			});
	    } else {
	    	console.log('[ERRO]'.red+' Argumentos faltando');
	    }
	});
}
else
{
	startsrv();
}