const Telegraf = require('telegraf');
require('dotenv').config();
const fs = require('fs');
const bot = new Telegraf(process.env.BOT_TOKEN);
const axios = require('axios');
const apikey = process.env.API_KEY;
const chartimg = process.env.CHART_IMG;

bot.command('start', ctx => {
    let startMessage = 'Hi, welcome! What can I help you?';
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Crypto Price', callback_data: 'price' },
                    { text: 'Crypto Details', callback_data: 'details' },
                    { text: 'Crypto Chart', callback_data: 'chart' },
                ],
                [

                    { text: 'Bonus: Cat Pics!', callback_data: 'cat' },
                    { text: 'Bonus: Quotes!', callback_data: 'quote' }
                ]
            ]
        }

    })
});

bot.action('start', ctx => {
    let startMessage = 'Hi, welcome! What can I help you?';
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Crypto Price', callback_data: 'price' },
                    { text: 'Crypto Details', callback_data: 'details' },
                    { text: 'Crypto Chart', callback_data: 'chart' },
                ],
                [

                    { text: 'Bonus: Cat Pics!', callback_data: 'cat' },
                    { text: 'Bonus: Quotes!', callback_data: 'quote' }
                ]
            ]
        }

    })
});

bot.action('details', ctx => {
    let startMessage = 'Which crypto coin intrigues you?';
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'BTC', callback_data: 'price-BTC' },
                    { text: 'ETH', callback_data: 'price-ETH' },
                    { text: 'LTC', callback_data: 'price-LTC' },
                    { text: 'XRP', callback_data: 'price-XRP' }
                ],
                [
                    { text: 'Back to Main Page', callback_data: 'start' }
                ]
            ]
        }

    })
});

let details = ['price-BTC', 'price-ETH', 'price-LTC', 'price-XRP'];
bot.action(details, async ctx => {
    ctx.deleteMessage();
    let symbol = ctx.match.split('-')[1];
    try {
        let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=IDR&api_key=${apikey}`);
        let data = res.data.DISPLAY[symbol].IDR;

        let message = `${symbol}\nSimbol: ${data.FROMSYMBOL}\nHarga: ${data.PRICE}\nVolume Hari Ini: ${data.VOLUMEDAY}\nNilai Tertinggi Hari Ini: ${data.HIGHDAY}\nNilai Terendah Hari Ini: ${data.LOWDAY}\nMKTCAP: ${data.MKTCAP}\nSupply: ${data.SUPPLY}\nLast Market: ${data.LASTMARKET}`;

        bot.telegram.sendMessage(ctx.chat.id, message, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Back to Main Page', callback_data: 'start' },
                        { text: 'Previous Menu', callback_data: 'details' }
                    ]
                ]
            }

        });

    } catch (err) {
        console.log(err);
        ctx.reply("Error!!!");
    }
});

bot.action('cat', async ctx => {
    ctx.deleteMessage();
    let res = await axios.get('https://aws.random.cat/meow');
    ctx.replyWithPhoto(res.data.file, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Generate More', callback_data: 'cat' },
                    { text: 'Back to Main Page', callback_data: 'start' }
                ]
            ]
        }

    });
});

bot.action('quote', async ctx => {
    ctx.deleteMessage();
    let res = await axios.get('https://quotes15.p.rapidapi.com/quotes/random/', {
        headers: {
            'X-RapidAPI-Key': 'edcc22cbb0msh9c91aead66ee3e9p140364jsnd26f6d72f320',
            'X-RapidAPI-Host': 'quotes15.p.rapidapi.com'
        }
    });
    ctx.reply(res.data.content, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Generate More', callback_data: 'quote' },
                    { text: 'Back to Main Page', callback_data: 'start' }
                ]
            ]
        }

    });
});

bot.action('price', ctx => {
    let startMessage = 'Which crypto coin intrigues you?';
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'BTC', callback_data: 'BINANCE:BTCUSDT' },
                    { text: 'ETH', callback_data: 'BINANCE:ETHUSDT' },
                    { text: 'LTC', callback_data: 'BINANCE:LTCUSDT' },
                    { text: 'XRP', callback_data: 'BINANCE:XRPUSDT' }
                ],
                [
                    { text: 'Back to Main Page', callback_data: 'start' }
                ]
            ]
        }

    })
});

let price = ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'BINANCE:LTCUSDT', 'BINANCE:XRPUSDT'];
bot.action(price, async ctx => {
    ctx.deleteMessage();
    let symbol = ctx.match.split(" ");
    try {
        ctx.deleteMessage();
        let chart = ctx.match.split(" ");
        let res = await axios.get(`https://api.chart-img.com/v1/tradingview/mini-chart?symbol=${symbol}&key=${chartimg}`, {
            responseType: "arraybuffer",
        });
        ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Back to Main Page', callback_data: 'start' },
                        { text: 'Previous Menu', callback_data: 'price' }
                    ]
                ]
            }
        });
    } catch (err) {
        console.log(err);
        ctx.reply("Error!!!");
    }
});

bot.action('chart', ctx => {
    let startMessage = 'Which crypto chart intrigues you?';
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, startMessage, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'BTC, 1m', callback_data: 'BTC, 1m' },
                    { text: 'BTC, 1h', callback_data: 'BTC, 1h' },
                    { text: 'BTC, 1d', callback_data: 'BTC, 1d' },
                    { text: 'BTC, 1w', callback_data: 'BTC, 1w' },
                ],
                [
                    { text: 'ETH, 1m', callback_data: 'ETH, 1m' },
                    { text: 'ETH, 1h', callback_data: 'ETH, 1h' },
                    { text: 'ETH, 1d', callback_data: 'ETH, 1d' },
                    { text: 'ETH, 1w', callback_data: 'ETH, 1w' },
                ],
                [
                    { text: 'LTC, 1m', callback_data: 'LTC, 1m' },
                    { text: 'LTC, 1h', callback_data: 'LTC, 1h' },
                    { text: 'LTC, 1d', callback_data: 'LTC, 1d' },
                    { text: 'LTC, 1w', callback_data: 'LTC, 1w' },
                ],
                [
                    { text: 'XRP, 1m', callback_data: 'XRP, 1m' },
                    { text: 'XRP, 1h', callback_data: 'XRP, 1h' },
                    { text: 'XRP, 1d', callback_data: 'XRP, 1d' },
                    { text: 'XRP, 1w', callback_data: 'XRP, 1w' },
                ],
                [
                    { text: 'Back to Main Page', callback_data: 'start' }
                ]
            ]
        }

    })
});

bot.action('BTC, 1m', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:BTCUSDT&interval=1m&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('BTC, 1h', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:BTCUSDT&interval=1h&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('BTC, 1d', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:BTCUSDT&interval=1d&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('BTC, 1w', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:BTCUSDT&interval=1w&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('ETH, 1m', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:ETHUSDT&interval=1m&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('ETH, 1h', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:ETHUSDT&interval=1h&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('ETH, 1d', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:ETHUSDT&interval=1d&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('ETH, 1w', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:ETHUSDT&interval=1w&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('XRP, 1m', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:XRPUSDT&interval=1m&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('XRP, 1h', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:XRPUSDT&interval=1h&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('XRP, 1d', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:XRPUSDT&interval=1d&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('XRP, 1w', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:XRPUSDT&interval=1w&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('LTC, 1m', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:LTCUSDT&interval=1m&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });

});

bot.action('LTC, 1h', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:LTCUSDT&interval=1h&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('LTC, 1d', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:LTCUSDT&interval=1d&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.action('LTC, 1w', async ctx => {
    ctx.deleteMessage();
    let chart = ctx.match.split(" ");
    let res = await axios.get(`https://api.chart-img.com/v1/tradingview/advanced-chart?symbol=BINANCE:LTCUSDT&interval=1w&key=${chartimg}`, {
        responseType: "arraybuffer",
    });
    ctx.replyWithPhoto({ source: Buffer.from(res.data, 'base64') }, {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Back to Main Page', callback_data: 'start' },
                    { text: 'Previous Menu', callback_data: 'chart' }
                ]
            ]
        }

    });
});

bot.launch()
