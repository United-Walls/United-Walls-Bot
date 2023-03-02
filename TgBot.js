const { Bot, InlineKeyboard, GrammyError, HttpError } = require('grammy');
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

const inlineKeyboard = new InlineKeyboard().text("Edit Wall", "edit-payload").text("Delete Wall", "delete-payload").row().text("Exit", "exit-payload");

let messageToDelete2 = 0;
let messageToDelete = 0;
let chat_id = 0

bot.command("menu", async (ctx) => {
    messageToDelete2 = 0;
    messageToDelete = ctx.update.message.message_id + 1;
    chat_id = ctx.update.message.chat.id;
    if (ctx.update.message.from.id == 975024565 || ctx.update.message.from.id == 934949695 || ctx.update.message.from.id == 1889905927) {
        await ctx.reply(`Welcome to the United Walls Menu. Below are settings to manipulate the Wallpapers added in the Database. So, @${ctx.update.message.from.username} what you want to do?`, { reply_markup: inlineKeyboard });
    } else {
        await ctx.reply(`Ok who the fuck? You're not allowed to use this bot Motherfucker! Fuck off!`);

        setTimeout(() => {
            bot.api.deleteMessage(chat_id, messageToDelete);
        }, 3500);
    }
});

bot.callbackQuery("exit-payload", async (ctx) => {
    if (chat_id != 0 && messageToDelete2 != 0 && messageToDelete2 != null) {
        bot.api.deleteMessage(chat_id, messageToDelete2);
    }
    
    if (chat_id != 0 && (messageToDelete != 0 && messageToDelete != null)) {
        bot.api.deleteMessage(chat_id, messageToDelete);
    }
})
  
// Wait for click events with specific callback data.
bot.callbackQuery("edit-payload", async (ctx) => {
    if (chat_id != 0 && (messageToDelete != 0 && messageToDelete != null)) {
        bot.api.deleteMessage(chat_id, messageToDelete);
    }

    messageToDelete2 = 0;
    messageToDelete = ctx.update.callback_query.message.message_id + 1;
    chat_id = ctx.update.callback_query.message.chat.id;

    if (ctx.update.callback_query.from.id == 975024565 || ctx.update.callback_query.from.id == 934949695 || ctx.update.callback_query.from.id == 1889905927) {
        const allCategories = await Category.find().sort({ file_name: 1 });

        let editKeyboard = { inline_keyboard: [] };
        let categoriesMapped = [];

        await Promise.all(allCategories.map(category => {
            categoriesMapped.push({
                text: category.name,
                callback_data: `Cat_${category.id}`
            });
        }));

        let array = [];

        for(let i = 0; i < categoriesMapped.length; i++) {
            let mappedCategory = categoriesMapped[i];
            array.push(mappedCategory);

            if ((i + 1) % 2 == 0) {
                editKeyboard.inline_keyboard.push(array);
                array = []
            }
        }

        editKeyboard.inline_keyboard.push([{
            text: "Go back",
            callback_data: "go-back-from-edit-payload"
        }]);

        editKeyboard.inline_keyboard.push([
            {text: "Exit",
            callback_data: 'exit-payload'}
        ]);

        await ctx.reply(`Choose a Category to edit a Wallpaper from -`, { reply_markup: editKeyboard })
    } else {
        await ctx.reply(`Ok who the fuck? You're not allowed to use this bot Motherfucker! Fuck off!`);

        setTimeout(() => {
            bot.api.deleteMessage(chat_id, messageToDelete);
        }, 3500);
    }
});

bot.callbackQuery("go-back-from-edit-payload", async (ctx) => {
    if (chat_id != 0 && (messageToDelete != 0 && messageToDelete != null)) {
        bot.api.deleteMessage(chat_id, messageToDelete);
    }

    messageToDelete2 = 0;
    messageToDelete = ctx.update.callback_query.message.message_id + 1;
    chat_id = ctx.update.callback_query.message.chat.id;

    if (ctx.update.callback_query.from.id == 975024565 || ctx.update.callback_query.from.id == 934949695 || ctx.update.callback_query.from.id == 1889905927) {
        await ctx.reply(`Welcome to the United Walls Menu. Below are settings to manipulate the Wallpapers added in the Database. So, @${ctx.update.callback_query.from.username} what you want to do?`, { reply_markup: inlineKeyboard });
    } else {
        await ctx.reply(`Ok who the fuck? You're not allowed to use this bot Motherfucker! Fuck off!`);

        setTimeout(() => {
            bot.api.deleteMessage(chat_id, messageToDelete);
        }, 3500);
    }
})

bot.on("callback_query:data", async(ctx) => {
    if (chat_id != 0 && (messageToDelete != 0 && messageToDelete != null)) {
        bot.api.deleteMessage(chat_id, messageToDelete);
    }

    if (chat_id != 0 && messageToDelete2 != 0 && messageToDelete2 != null) {
        bot.api.deleteMessage(chat_id, messageToDelete2);
    }

    if (ctx.update.callback_query.data.split('_')[0] == "Cat") {
        messageToDelete2 = 0;
        messageToDelete = ctx.update.callback_query.message.message_id + 1;
        chat_id = ctx.update.callback_query.message.chat.id;

        if (ctx.update.callback_query.from.id == 975024565 || ctx.update.callback_query.from.id == 934949695 || ctx.update.callback_query.from.id == 1889905927) {
            const category_id = ctx.update.callback_query.data.split('_')[1]

            const category = await Category.findById(category_id).populate({ path: 'walls', options: { sort: { 'file_name': 1 } } });

            let editKeyboard = { inline_keyboard: [] };
            let wallsMapped = [];

            await Promise.all(category.walls.map(wall => {
                wallsMapped.push({
                    text: wall.file_name,
                    callback_data: `Wal_${wall.id}`
                });
            }));

            let array = [];

            for (let i = 0; i < wallsMapped.length; i++) {
                let mappedWall = wallsMapped[i];

                if (wallsMapped.length > 2) {
                    array.push(mappedWall);
        
                    if ((i+1) % 2 == 0) {
                        editKeyboard.inline_keyboard.push(array);
                        array = []
                    }
                } else {
                    editKeyboard.inline_keyboard.push([mappedWall])
                }
            }

            editKeyboard.inline_keyboard.push([{
                text: "Go back",
                callback_data: "edit-payload"
            }]);

            editKeyboard.inline_keyboard.push([
                {text: "Exit",
                callback_data: 'exit-payload'}
            ]);

            await ctx.reply(`Choose a Wallpaper to edit -`, { reply_markup: editKeyboard });
        } else {
            await ctx.reply(`Ok who the fuck? You're not allowed to use this bot Motherfucker! Fuck off!`);
    
            setTimeout(() => {
                bot.api.deleteMessage(chat_id, messageToDelete);
            }, 3500);
        }
    }

    if (ctx.update.callback_query.data.split('_')[0] == "Wal") {
        messageToDelete2 = ctx.update.callback_query.message.message_id + 2;
        messageToDelete = ctx.update.callback_query.message.message_id + 1;
        chat_id = ctx.update.callback_query.message.chat.id;

        if (ctx.update.callback_query.from.id == 975024565 || ctx.update.callback_query.from.id == 934949695 || ctx.update.callback_query.from.id == 1889905927) {
            const wall_id = ctx.update.callback_query.data.split('_')[1];

            const wall = await Walls.findById(wall_id).populate('category').sort({ 'file_name': 1 });

            let editKeyboard = { inline_keyboard: [
                [
                    {text: "Edit Name",
                    callback_data: `EdN_${wall_id}`}
                ],
                [
                    {text: "Add Uploader",
                    callback_data: `AdU_${wall_id}`}
                ],
                [
                    {text: "Edit Uploader",
                    callback_data: `EdU_${wall_id}`}
                ],
                [
                    {text: "Edit Category",
                    callback_data: `EdC_${wall_id}`}
                ],
                [
                    {text: "Go back",
                    callback_data: `Cat_${wall.category.id}`}
                ],
                [
                    {text: "Exit",
                    callback_data: 'exit-payload'}
                ]
            ] };

            await bot.api.sendDocument(chat_id, wall.file_id);
            await ctx.reply(`Edit ${wall.file_name}?`, { reply_markup: editKeyboard });
        } else {
            await ctx.reply(`Ok who the fuck? You're not allowed to use this bot Motherfucker! Fuck off!`);
    
            setTimeout(() => {
                bot.api.deleteMessage(chat_id, messageToDelete);
            }, 3500);
        }
    }
});

// Check messages
bot.on("message", async (ctx) => {
    const msg = ctx.message;
    if( 'document' in msg && (msg.document?.mime_type == 'image/png' || msg.document?.mime_type == 'image/jpg' || msg.document?.mime_type == 'image/jpeg') && (msg.from.id == 975024565 || msg.from.id == 934949695 || msg.from.id == 1889905927) && msg.is_topic_message && msg.message_thread_id && msg.message_thread_id == 185847) {
        if (msg.document?.file_size > 5000000) {
            console.error("File is more than 5MB!");
            await bot.api.sendMessage(-1001747180858, `Error: Hey, @${ msg.from.username }, Did you check the Size of this file?\n\nLike dude are you blind or something?\n\nThe limit is not more than 5MB, if it is more than this I wont allow your shitty Huge file dude! Now Fuck off!`);
            return;
        }
        try {
            const fileNameRegexp = /[A-Z][a-z].*_[0-9]+.*[A-Za-z]+/;

            let wall = await Walls.findOne({ file_name: msg.document?.file_name.split('.')[0] });

            let category = await Category.findOne({name: msg.document?.file_name.split('.')[0].split('_')[0].replace(/([A-Z])/g, ' $1').trim()});

            if (!wall) {
                if (!msg.document?.file_id) {
                    console.error("File doesn't have an id!");
                    await bot.api.sendMessage(-1001747180858, `Error: Hey, @${ msg.from.username }, No ID for file could be fetched, can not save to database.\n\nIt seems like you suck at uploading wallpapers, which is weird because it should be easy to do.`);
                    return;
                }

                if (msg.document?.file_name.match(fileNameRegexp) == null) {
                    console.error("Invalid File name");
                    await bot.api.sendMessage(-1001747180858, `Error: Hey, @${ msg.from.username }, Your shitty file name ${msg.document?.file_name.bold()}, is invalid, it should be like SomeName_12345.ext.\n\nIt's no rocket science, I don't know if your parents taught you simple ABCD, but like c'mon, you really suck at this`, { parse_mode: "HTML" });
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

                    await bot.api.sendMessage(-1001747180858, `**New category** - ${ newCategory.name } created and added to the database.\n\n**Wallpaper** - ${ newWall.file_name } added to database.\n\n**Object id** - ${ newWall._id } (for reference).\n\n**Added by** - ${ msg.from.username }.`);
                    return;
                } else {
                    const newWall = await Walls.create({
                        file_name: msg.document?.file_name.split('.')[0],
                        file_id: msg.document?.file_id,
                        mime_type: msg.document?.mime_type,
                        category: category._id,
                        addedBy: msg.from.username
                    });

                    await Category.findByIdAndUpdate(category._id, { $push: { walls: newWall } });

                    await bot.api.sendMessage(-1001747180858, `**Wallpaper** - ${ newWall.file_name } added to database.\n\n**Category** - ${ category.name }.\n\nObject ID - ${ newWall._id } (for reference).\n\n**Added by** - ${ msg.from.username }.`);
                    return;
                }
            } else {
                await bot.api.sendMessage(-1001747180858, `Error: Hey, @${ msg.from.username }, a wallpaper with the same name - ${wall.file_name} whose database document Object ID is ${wall._id} (for reference), is already added to the database.\n\nPlease have some common sense, don't be an idiot and change the name or make sure it's not already added in the Database.`);
                return;
            }
        } catch (error) {
            console.error(error.message);
            ctx.reply(`Error: Hey, @${ msg.from.username }, could not save to Database.\n\nYou've become the greatest and the worst person to do this job, that's saying something!`);
            return;
        }
    }
});

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
});

module.exports = TgBot = bot;