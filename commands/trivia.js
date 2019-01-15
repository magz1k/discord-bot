const request = require('request-promise');

module.exports = {
    name: 'trivia',
    description: 'Starts a round of trivia',
    usage: '[difficulty 1-3]',
    cooldown: 5,
    async execute(message, args) {
        const difficulties = {
            1: 'easy',
            2: 'medium',
            3: 'hard'
        }
        let difficulty = parseInt(args[0]) ? difficulties[parseInt(args[0])] : difficulties[2];

        await request({
                uri: `https://opentdb.com/api.php`,
                json: true,
                qs: {
                    amount: 1,
                    difficulty: difficulty,
                    encode: 'url3986'
                }
            })
            .then(async response => {
                if (response.response_code !== 0)
                    return message.reply(`An error occured with the trivia API.`)

                const filter = m => m.content.toLowerCase().includes(decodeURIComponent(response.results[0].correct_answer).toLowerCase());
                const data = [];
                data.push(decodeURIComponent(response.results[0].question));

                if (response.results[0].type === 'multiple') {
                    let answers = response.results[0].incorrect_answers;
                    answers.push(response.results[0].correct_answer);
                    data.push(answers.map(a => [Math.random(), a])
                        .sort((a, b) => a[0] - b[0])
                        .map(a => decodeURIComponent(a[1])).join(', '))
                }

                await message.channel.send(data);
                await message.channel.awaitMessages(filter, {
                        max: 1,
                        time: 60000,
                        errors: ["time"]
                    })
                    .then(collected => message.channel.send(`${collected.first().author} got the correct answer (${decodeURIComponent(response.results[0].correct_answer)})! Congratuations!`))
                    .catch(e => message.channel.send('No one got the right answer!'))
            })
            .catch(e => message.client.logger.error(e.message))
        return;
    },
}