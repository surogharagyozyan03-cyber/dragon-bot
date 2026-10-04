const { Telegraf } = require('telegraf');
const cron = require('node-cron');
const fs = require('fs');

const bot = new Telegraf('8980870479:AAE0kD4mUaa2dNMUoDN5QSF69xSjbmLfr5Q');
const CHAT_ID = '1427712111';

function loadEvents() {
    try {
        const data = fs.readFileSync('events.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

bot.start((ctx) => {
    ctx.reply('🛡 Бот-оповещатель запущен и готов к работе!');
});

// Проверка каждую минуту
cron.schedule('* * * * *', () => {
    const now = new Date();
    
    // Проверяем события через 10 минут
    const targetTime10 = new Date(now.getTime() + 10 * 60000);
    const day10 = targetTime10.getDay();
    const time10Str = `${String(targetTime10.getHours()).padStart(2, '0')}:${String(targetTime10.getMinutes()).padStart(2, '0')}`;

    const events = loadEvents();

    events.forEach(event => {
        if (event.dayOfWeek === day10 && event.time === time10Str) {
            let extraText = '';
            if (event.title.includes('Экспедиция')) extraText = ' Читаем доску клана!';
            
            bot.telegram.sendMessage(
                CHAT_ID,
                `⏰ *${event.title}* начнется через 10 минут! (${event.time})${extraText}`,
                { parse_mode: 'Markdown' }
            );
        }
    });
});

bot.launch();
console.log('Бот успешно запущен и ждет тестовое время 23:43!');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));