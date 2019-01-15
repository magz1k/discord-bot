const ytdl = require('ytdl-core');
const {
    RichEmbed
} = require('discord.js');

let queue = {}

module.exports = {
    addSong: async function (message, youtubeUrl) {
        let songTitle = '';

        if (youtubeUrl == '' || youtubeUrl === undefined)
            return false;

        if (!queue.hasOwnProperty(message.guild.id)) {
            queue[message.guild.id] = {},
                queue[message.guild.id].playing = false,
                queue[message.guild.id].songs = [];
        }

        await ytdl.getInfo(youtubeUrl, (err, info) => {
            if (err) {
                message.client.logger.error(err.message);
                return false;
            }
            queue[message.guild.id].songs.push({
                url: youtubeUrl,
                title: info.title,
                requester: message.author.username
            });
            songTitle = info.title;
        })

        return songTitle;
    },

    remove: async function (message, youtubeUrl) {

    },

    getInfo: async function (message) {
        if (!queue.hasOwnProperty(message.guild.id) || !queue[message.guild.id].playing)
            return false;
        const embed = new RichEmbed()
            .setAuthor(`${queue[message.guild.id].songs[0].title}`, 'http://www.stickpng.com/assets/images/580b57fcd9996e24bc43c545.png', `${queue[message.guild.id].songs[0].url}`)
            .setColor(0xff0000)
            .setTimestamp(Date.now())
        if (queue[message.guild.id].songs.length > 1)
            embed.addField('Next 5 queued songs', `${queue[message.guild.id].songs.slice(1, 7).map(data => `${data.title} added by ${data.requester}\n`).join('')}`);
        return embed;
    },

    play: async function (message, next = false) {
        if (!queue.hasOwnProperty(message.guild.id))
            return false;
        if (queue[message.guild.id].songs.length === 0) {
            message.member.voiceChannel.leave();
            return false;
        }
        if (!message.guild.voiceConnection)
            message.member.voiceChannel.join();
        if (queue[message.guild.id].playing)
            return message.reply(`Music is already playing!`);
        const currentSong = queue[message.guild.id].songs.shift();

        message.channel.send(`Now playing: ${currentSong.title}`)
        const stream = ytdl(currentSong.url, {
            filter: 'audioonly'
        });

        dispatcher = message.guild.voiceConnection.playStream(stream, {
            volume: message.client.config.defaultVolume
        });

        queue[message.guild.id].playing = true;

        dispatcher.on('end', () => {
            queue[message.guild.id].playing = false;
            this.play(message)
        });
    },

    skip: async function (message) {
        const queue = message.client.youtube.queue;

        if (queue.length === 0)
            return false;

    }
}