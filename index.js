const discord = require('discord.js');
const bot = new discord.Client();


const config = require('./config.json');
bot.config = config;
const prefix = bot.config.prefix
var userTickets = new Map();

const fs = require('fs');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');

bot.login(config.token);

bot.on('ready', () => {

    console.log(`${bot.user.username} est en ligne dans ${bot.guilds.cache.size} serveur(s)`)

    let statuses = ['faire !commander',"La V1.5 est arrivée !"];

    setInterval(() => {
        let status = statuses[Math.floor(Math.random() * statuses.length)];
        bot.user.setActivity(status, {type: "PLAYING"})
	}, 3000);
});

bot.on('message', async message => {

    if(message.content.toLowerCase() === prefix + "commander"){
        message.delete();
        let interdiction = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setTitle('**Vous ne pouvez pas passer commande dans ce salon !**')
        if (message.channel.id !=='728275243038146590') return message.channel.send(interdiction)        //ici
        .then(async msg => {
            setTimeout(() => {
                msg.delete()
            }, 5000);
        })
        const server = message.channel.guild;
        const auteur = message.author;
        await server.channels.create(`_${message.author.username}`, {
            parent: '716269243972452353',                                                           //ici
            type: 'text',
            permissionOverwrites: [
                {
                    id: auteur.id,
                    allow: ['VIEW_CHANNEL']
                },                
                {
                    id: server.id,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: "647138042464698378",                                               //ici
                    allow: ['VIEW_CHANNEL']
                },
            ]
            
        }).then(ch => {
            
            userTickets.set(message.author.id, ch.id);
            ch.send(message.author.toString());
            setTimeout(function() {
                ch.bulkDelete(parseInt(1)); 
                var embeddébut = new discord.MessageEmbed()
                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                .setTitle('Salut à toi ' + message.author.username)
                .setDescription("**Je vais te poser une série de questions concernant ta commande.\nTu auras à chaque fois 2 minutes pour répondre.**\n\n__**ATTENDS 5 SECONDES **__")
                .setColor('GREEN')
                .setTimestamp()
            ch.send(embeddébut)
            console.log('Channel créé avec message !')
            }, 500);
            
            setTimeout(function() {
                ch.bulkDelete(parseInt(1)); 
                var embeddébut2 = new discord.MessageEmbed()
                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                .setTitle('Salut à toi ' + message.author.username)
                .setDescription("**Je vais te poser une série de questions concernant ta commande.\nTu auras à chaque fois 2 minutes pour répondre.**")
                .setColor('GREEN')
                ch.send(embeddébut2)
                setTimeout(function() {
                    pseudo(ch, auteur);   
                }, 1000);
            }, 5000); 

            
        }).catch(err => console.log(err));
    }
});

async function pseudo(ch, auteur){
    var embedpseudo = new discord.MessageEmbed()
        .setAuthor(bot.user.username, bot.user.displayAvatarURL())
        .setDescription("**Quel est ton pseudo en Jeu ?**")
        .setColor('#eb8934')
    ch.send(embedpseudo)
    .then(() => {
        ch.awaitMessages(reponse => reponse.content, {
            max: 1,
            time: 120000,
            errors: ['time'],
            })
            .then(async collected => {
                nompseudo = collected.first().content

                return item(ch, auteur, nompseudo);
            })
            .catch(() => {
                var annul = new discord.MessageEmbed()
                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                .setTitle('**Commande annulée !**')
                .setDescription("**Vous n'avez pas répondu à temps**")
                .setTimestamp()
                .setColor('BLACK')
                ch.send(annul);
                setTimeout(() => {
                    ch.delete();
                }, 5000);
                return;
            });
    });
}

async function item(ch, auteur, nompseudo){

    await ch.bulkDelete(parseInt(2));

    var embedpseudo = new discord.MessageEmbed()
        .setAuthor(bot.user.username, bot.user.displayAvatarURL())
        .setDescription("**Que veux-tu commander ?**")
        .setColor('#eb8934')
    ch.send(embedpseudo)
    .then(() => {
        ch.awaitMessages(reponse => reponse.content, {
            max: 1,
            time: 120000,
            errors: ['time'],
            })
            .then(async collected => {
                itemnom = collected.first().content

                return quantité(ch, auteur, nompseudo, itemnom)
            })
            .catch(() => {
                var annul = new discord.MessageEmbed()
                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                .setTitle('**Commande annulée !**')
                .setDescription("**Vous n'avez pas répondu à temps**")
                .setTimestamp()
                .setColor('BLACK')
                ch.send(annul);
                setTimeout(() => {
                    ch.delete();
                }, 5000);
                return;
            });
    });
}

async function quantité(ch, auteur, nompseudo, itemnom){

    await ch.bulkDelete(parseInt(2));

    var embedpseudo = new discord.MessageEmbed()
        .setAuthor(bot.user.username, bot.user.displayAvatarURL())
        .setDescription("**Quelle est la quantité de ta commande ?**")
        .setColor('#eb8934')
    ch.send(embedpseudo)
    .then(() => {
        ch.awaitMessages(reponse => reponse.content, {
            max: 1,
            time: 120000,
            errors: ['time'],
            })
            .then(async collected => {
                quantiténom = collected.first().content

                return prix(ch, auteur, nompseudo, itemnom, quantiténom)
            })
            .catch(() => {
                var annul = new discord.MessageEmbed()
                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                .setTitle('**Commande annulée !**')
                .setDescription("**Vous n'avez pas répondu à temps**")
                .setTimestamp()
                .setColor('BLACK')
                ch.send(annul);
                setTimeout(() => {
                    ch.delete();
                }, 5000);
                return;
            });
    });
}

async function prix(ch, auteur, nompseudo, itemnom, quantiténom){

    await ch.bulkDelete(parseInt(2));

    var embedpseudo = new discord.MessageEmbed()
        .setAuthor(bot.user.username, bot.user.displayAvatarURL())
        .setDescription("**Quel est le prix de ta commande ?**")
        .setColor('#eb8934')
    ch.send(embedpseudo)
    .then(() => {
        ch.awaitMessages(reponse => reponse.content, {
            max: 1,
            time: 120000,
            errors: ['time'],
            })
            .then(async collected => {
                prixnom = collected.first().content

                var fin = new discord.MessageEmbed()
                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                    .setTitle('**Ta commande est bien celle ci ?**')
                    .addFields(
                        {name: '**Pseudo en jeu**', value: nompseudo, inline: false},
                        {name: '**Commande**', value: itemnom, inline: false},
                        {name: '**Quantité**', value: quantiténom, inline: false},
                        {name: '**Prix**', value: prixnom, inline: false},
                        {name: "\n **------------**\n\n**Si cette commande te convient, clique sur   <a:send:748853097408757831>\n\nSinon, pour recommencer, clique sur   <a:refresh:748852838364610622>**\n\n**------------**\n", value: "\u200b", inline: false}
                    )                                           //ici au dessus *2
                    .setColor('GREEN')
                await ch.bulkDelete(parseInt(10))
                ch.send(fin)
                .then(async msg => {
                    await msg.react(':send:748853097408757831')    //ici
                    await msg.react(':refresh:748852838364610622')   //ici

                    const filter = (reaction, user) => {
                        return ['748853097408757831', '748852838364610622'].includes(reaction.emoji.id) && user.id !== msg.author.id;
                    };                              //ici au dessus *2
                    
                    msg.awaitReactions(filter, { max: 1, time: 600000, errors: ['time'] })
                        .then(async collected => {
                            const reaction = collected.first();
                    
                            if (reaction.emoji.id === '748853097408757831') {               //ici

                                await ch.bulkDelete(parseInt(99));
                                ch.send("<@&647138042464698378>")                   //ici
                                var embed = new discord.MessageEmbed()
                                    .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                                    .setTitle(`Résumé de la commande de ${auteur.username}`)
                                    .addFields(
                                        {name: '**Commande de**', value: auteur, inline: false},
                                        {name: '**Pseudo en jeu**', value: nompseudo, inline: false},
                                        {name: '**Commande**', value: itemnom, inline: false},
                                        {name: '**Quantité**', value: quantiténom, inline: false},
                                        {name: '**Prix**', value: prixnom, inline: false}
                                    )
                                    .setColor('GREEN')
                                    .setTimestamp()
                                ch.send(embed)
                                return envoi(ch, auteur, nompseudo, itemnom, quantiténom, prixnom, auteur);
                            } 
                            if (reaction.emoji.id === '748852838364610622') {               //ici
                                await ch.bulkDelete(parseInt(10));
                                return pseudo(ch, auteur,);
                            } 
                        })
                })
            })
            .catch(() => {
                var annul = new discord.MessageEmbed()
                .setAuthor(bot.user.username, bot.user.displayAvatarURL())
                .setTitle('**Commande annulée !**')
                .setDescription("**Vous n'avez pas répondu à temps**")
                .setTimestamp()
                .setColor('BLACK')
                ch.send(annul);
                setTimeout(() => {
                    ch.delete();
                }, 5000);
                return;
            });
    });
}

async function envoi(ch, auteur, nompseudo, itemnom, quantiténom, prixnom){

    const comm = ch.guild.channels.cache.find(c => c.name === '『⚓』logs-commande');                 //ici

    var embed = new discord.MessageEmbed()
        .setAuthor(bot.user.username, bot.user.displayAvatarURL())
        .setTitle('**Commande**')
        .addFields(
            {name: '**Commande de**', value: auteur, inline: false},
            {name: '**Acheteur**', value: prixnom, inline: false},
            {name: '**Pseudo en jeu**', value: nompseudo, inline: false},
            {name: '**Commande**', value: itemnom, inline: false},
            {name: '**Quantité**', value: quantiténom, inline: false},
            {name: '**Prix**', value: prixnom, inline: false},
            )
        .setColor('BLUE')
        .setTimestamp()
    comm.send(embed)
}

bot.on('message', async message => {
    if(message.content.toLowerCase() === prefix + "valider"){

        const channel_name = message.channel.name;
        let role_vendeur = message.guild.roles.cache.find(role => role.name === 'Vendeur');
        let autorisation2 = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setTitle('**<a:tickred:753750938996703352>  Autorisation refusée !**  <a:tickred:753750938996703352>')
            .setDescription("**Cette commande est déjà validée !**")
            .setTimestamp()
            .setColor('RED')
        if(message.channel.name.startsWith('💠')) return message.channel.send(autorisation2);

        let autorisation1 = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setTitle('**<a:tickred:753750938996703352>  Autorisation refusée !**  <a:tickred:753750938996703352>')
            .setDescription("Ce channel n'est pas un ticket, impossible donc de valider cette commande !")
            .setTimestamp()
            .setColor('RED')
        if(!message.channel.name.startsWith('_')) return message.channel.send(autorisation1);

        let autorisation4 = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setTitle('**<a:tickred:753750938996703352>  Autorisation refusée !**  <a:tickred:753750938996703352>')
            .setDescription("Vous n'avez pas les permissions requises pour effectuer cette commande !")
            .setTimestamp()
            .setColor('DARK')
        if(!message.member.roles.cache.has(role_vendeur.id)) return message.channel.send(autorisation4);
        
        let embed_valide = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setDescription('**<a:tickgreen:753750937968836618>  Cette commande a été validée par ' + message.author.username + '**  <a:tickgreen:753750937968836618>')
            .setColor('GREEN')
            message.channel.send(embed_valide);
        message.channel.setParent('716269323873812550');                        //ici
        message.delete();
        message.channel.setName(`💠${channel_name}`);
        
    };

    if(message.content.toLowerCase() === prefix + 'fermer'){
        let role_vendeur = message.guild.roles.cache.find(role => role.name === 'Vendeur');
        let autorisation = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setTitle('**<a:tickred:753750938996703352>  Autorisation refusée !**  <a:tickred:753750938996703352>')
            .setDescription("Vous n'avez pas les permissions requises pour effectuer cette commande !")
            .setTimestamp()
            .setColor('DARK')
        if(!message.member.roles.cache.has(role_vendeur.id)) return message.channel.send(autorisation);

        let autorisation1 = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setTitle('**<a:tickred:753750938996703352>  Autorisation refusée !**  <a:tickred:753750938996703352>')
            .setDescription("Ce channel n'est pas un ticket, impossible donc de fermer ce channel !")
            .setTimestamp()
            .setColor('DARK')
        if(!message.channel.name.startsWith('💠')) return message.channel.send(autorisation1);
        
        message.channel.bulkDelete(parseInt(99));

        var embed_fin = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setDescription(`**<:heartbox:753754484479361147>  Merci pour ton achat !**`)
            .setColor('GREEN')
        var embed_fin2 = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setDescription(`**<:warn:753753033598304316>  A l'attention du vendeur :** n'oublie pas de poster ton screen dans #logs-vendeur ! `)
            .setColor('BLUE')
        var embed_fin3 = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setDescription(`<a:loading:716338471412826223>  **Ce ticket va se supprimer dans 5 secondes...**`)
            .setColor('RED')
        message.channel.send(embed_fin);
        message.channel.send(embed_fin2);
        message.channel.send(embed_fin3);
        setTimeout(() => {
            message.channel.delete();
        }, 5000);
    };

    if(message.content.toLowerCase() === prefix + 'annuler'){
        let role_vendeur = message.guild.roles.cache.find(role => role.name === 'Vendeur');
        let autorisation = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setTitle('**<a:tickred:753750938996703352>  Autorisation refusée !**  <a:tickred:753750938996703352>')
            .setDescription("Vous n'avez pas les permissions requises pour effectuer cette commande !")
            .setTimestamp()
            .setColor('DARK')
        if(!message.member.roles.cache.has(role_vendeur.id)) return message.channel.send(autorisation);

        let autorisation1 = new discord.MessageEmbed()
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setTitle('**<a:tickred:753750938996703352>  Autorisation refusée !**  <a:tickred:753750938996703352>')
            .setDescription("Ce channel n'est pas un ticket, impossible donc de fermer ce channel !")
            .setTimestamp()
            .setColor('DARK')
        if(!message.channel.name.startsWith('_') && !message.channel.name.startsWith('💠')) return message.channel.send(autorisation1);
        
        message.channel.bulkDelete(parseInt(99));

        var embed_fin11 = new discord.MessageEmbed()    
            .setAuthor(bot.user.username, bot.user.displayAvatarURL())
            .setDescription(`<a:loading:716338471412826223>  **Ce ticket va se supprimer dans 5 secondes...**`)
            .setColor('RED')
        message.channel.send(embed_fin11);
        setTimeout(() => {
            message.channel.delete();
        }, 5000);
    };
});


