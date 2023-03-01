const { Bot } = require('grammy');
const Category = require('./models/Category');
const Walls = require('./models/Walls');
require('dotenv').config();
// Create new instance of Bot class, pass your token in the Bot constructor.
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// Register listeners below
// Handle /start command
bot.command("start", async (ctx) => {
    await ctx.reply("*Hi\\!* _Welcome_ to [United Walls](t.me/UnitedWalls_Bot)\\.", { parse_mode: "MarkdownV2" } );
    await ctx.reply("As you see\\, I'm just a bot\\. Join our Group to access our Awesome Walls\\! \\:\\)\n\nOur Group is [United Setups](t.me/unitedsetups)\\.", { parse_mode: "MarkdownV2" } )
});

// Check messages
bot.on("message", async (ctx) => {
    const msg = ctx.message;
    if( 'document' in msg && (msg.document?.mime_type == 'image/png' || msg.document?.mime_type == 'image/jpg' || msg.document?.mime_type == 'image/jpeg') && (msg.from.id == 975024565 || msg.from.id == 934949695) && msg.is_topic_message && msg.message_thread_id && msg.message_thread_id == 122) {
        try {
            const fileNameRegexp = /[A-Z][a-z].*_[0-9]+.*[A-Za-z]+/;

            let wall = await Walls.findOne({ file_name: msg.document?.file_name.split('.')[0] });

            let category = await Category.findOne({name: msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim()});

            if (!wall) {
                if (!msg.document?.file_id) {
                    console.error("File doesn't have an id!");
                    await bot.api.sendMessage(-1001725269941, `Error: Hey, @${ msg.from.username }, No ID for file could be fetched, can not save to database.\n\nIt seems like you suck at uploading wallpapers, which is weird because it should be easy to do.`);
                    return;
                }

                if (msg.document?.file_name.match(fileNameRegexp) == null) {
                    console.error("Invalid File name");
                    await bot.api.sendMessage(-1001725269941, `Error: Hey, @${ msg.from.username }, Your shitty file name **${msg.document?.file_name}**, is invalid, it should be like SomeName_12345.ext.\n\nIt's no rocket science, I don't know if your parents taught you simple ABCD, but like c'mon, you really suck at this`);
                    return;
                }

                if (!category) {
                    let newCategory = await Category.create({
                        name: msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim()
                    });

                    const newWall = await Walls.create({
                        file_name: msg.document?.file_name.split('.')[0],
                        file_id: msg.document?.file_id,
                        mime_type: msg.document?.mime_type,
                        category: newCategory._id
                    });

                    await Category.findByIdAndUpdate(newCategory._id, { $push: { walls: newWall } });

                    await bot.api.sendMessage(-1001725269941, `**New category** - ${ newCategory.name } created and added to the database.\n\n**Wallpaper** - ${ newWall.file_name } added to database.\n\n**Object id** - ${ newWall._id } (for reference).\n\n**Added by** - ${ msg.from.username }.`);
                    return;
                } else {
                    const newWall = await Walls.create({
                        file_name: msg.document?.file_name.split('.')[0],
                        file_id: msg.document?.file_id,
                        mime_type: msg.document?.mime_type,
                        category: category._id
                    });

                    await Category.findByIdAndUpdate(category._id, { $push: { walls: newWall } });

                    await bot.api.sendMessage(-1001725269941, `**Wallpaper** - ${ newWall.file_name } added to database.\n\n**Category** - ${ category.name }.\n\nObject ID - ${ newWall._id } (for reference).\n\n**Added by** - ${ msg.from.username }.`);
                    return;
                }
            } else {
                await bot.api.sendMessage(-1001725269941, `Error: Hey, @${ msg.from.username }, a wallpaper with the same name - ${wall.file_name} whose database document Object ID is ${wall._id} (for reference), is already added to the database.\n\nPlease have some common sense, don't be an idiot and change the name or make sure it's not already added in the Database.`);
                return;
            }
        } catch (error) {
            console.error(error.message);
            ctx.reply(`Error: Hey, @${ msg.from.username }, could not save to Database.\n\nYou've become the greatest and the worst person to do this job, that's saying something!`);
            return;
        }
    }
});

module.exports = TgBot = bot;