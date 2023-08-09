const { InlineKeyboard } = require("grammy");
const ChatIDs = require("../models/ChatIDS");
const Uploader = require("../models/Uploader");

module.exports = async (ctx, updateMessage, flag) => {
    if (flag) {
        const uploader = await Uploader.find({ userID: ctx.callbackQuery.from.id });

        if (
            ctx.callbackQuery.from.id == 975024565 ||
            ctx.callbackQuery.from.id == 934949695 ||
            ctx.callbackQuery.from.id == 1889905927 ||
            ctx.callbackQuery.from.id == 127070302
        ) {
            if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
                const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];

                const inlineKeyboard = new InlineKeyboard()
                .text('Wall Categories', 'edit-payload')
                .row()
                .text('Update your Profile (With your Telegram Data)', `UUpl_${ctx.callbackQuery.from.id}`)
                .row()
                .text('Edit your Profile (Username, image privacy, etc.)', `EUpl_${ctx.callbackQuery.from.id}`)
                .row()
                .text('Your Wallpapers', `WUpl_${ctx.callbackQuery.from.id}`)
                .row()
                .text('Reset password', `RUpl_${ctx.callbackQuery.from.id}`)
                .row()
                .text('Edit Uploaders', 'edit-user-payload')
                .row()
                .text('Generate Invitations', 'generate-invitations')
                .row()
                .text('Your Generated Invitations', 'generated-invitations')
                .row()
                .text('Exit', 'exit-payload');
    
                const message = await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id,
                    `Welcome to the United Walls Menu. Below are settings to manipulate the Wallpapers added in the Database. So, @${ctx.callbackQuery.from.username} what you want to do?`,
                    { message_thread_id: messageToUpdate.message.message_thread_id, reply_markup: inlineKeyboard }
                );

                return;
            }
        } else if (uploader.length > 0) {
            if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
                const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];

                const inlineKeyboard = new InlineKeyboard()
                .text('Update your Profile (With your Telegram Data)', `UUpl_${ctx.callbackQuery.from.id}`)
                .row()
                .text('Edit your Profile (Username, image privacy, etc.)', `EUpl_${ctx.callbackQuery.from.id}`)
                .row()
                .text('Your Wallpapers', `WUpl_${ctx.callbackQuery.from.id}`)
                .row()
                .text('Reset password', `RUpl_${ctx.callbackQuery.from.id}`)
                .row()
                .text('Exit', 'exit-payload');

                const message = await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id,
                    `Welcome to the United Walls Menu. Below are settings to manipulate the Wallpapers added in the Database. So, @${ctx.callbackQuery.from.username} what you want to do?`,
                    { message_thread_id: messageToUpdate.message.message_thread_id, reply_markup: inlineKeyboard }
                );

                return;
            }
        }
    } else {
        const uploader = await Uploader.find({ userID: ctx.message.from.id });

        let chatId = ctx.message.chat.id;
        let uploaderExists = await Uploader.find({ userID: ctx.message.from.id });
        let chatIdExists = await ChatIDs.find({ user: uploaderExists });

        if (ctx.message.chat.id == ctx.message.from.id) {
            if (uploaderExists.length > 0) {
                if (chatIdExists.length > 0) {
                    await ChatIDs.findOneAndUpdate({ user: uploaderExists[0] }, { chatId: chatId });
                } else {
                    await ChatIDs.create({
                        chatID: chatId,
                        user: uploaderExists[0]
                    })
                }
            }
        }
        if (
            ctx.message.from.id == 975024565 ||
            ctx.message.from.id == 934949695 ||
            ctx.message.from.id == 1889905927 ||
            ctx.message.from.id == 127070302
        ) {
            const inlineKeyboard = new InlineKeyboard()
                .text('Wall Categories', 'edit-payload')
                .row()
                .text('Update your Profile (With your Telegram Data', `UUpl_${ctx.message.from.id}`)
                .row()
                .text('Edit your Profile (Username, image privacy, etc.)', `EUpl_${ctx.message.from.id}`)
                .row()
                .text('Your Wallpapers', `WUpl_${ctx.message.from.id}`)
                .row()
                .text('Reset password', `RUpl_${ctx.message.from.id}`)
                .row()
                .text('Edit Uploaders', 'edit-user-payload')
                .row()
                .text('Generate Invitations', 'generate-invitations')
                .row()
                .text('Your Generated Invitations', 'generated-invitations')
                .row()
                .text('Exit', 'exit-payload');
    
            const message = await ctx.reply(
                `Welcome to the United Walls Menu. Below are settings to manipulate the Wallpapers added in the Database. So, @${ctx.message.from.username} what you want to do?`,
                { message_thread_id: ctx.message.message_thread_id, reply_markup: inlineKeyboard }
            );
    
            return message;
        } else if (uploader.length > 0) {
            const inlineKeyboard = new InlineKeyboard()
                .text('Update your Profile (With your Telegram Data)', `UUpl_${ctx.message.from.id}`)
                .row()
                .text('Edit your Profile (Username, image privacy, etc.)', `EUpl_${ctx.message.from.id}`)
                .row()
                .text('Your Wallpapers', `WUpl_${ctx.message.from.id}`)
                .row()
                .text('Reset password', `RUpl_${ctx.message.from.id}`)
                .row()
                .text('Exit', 'exit-payload');

            const message = await ctx.reply(`Welcome to the United Walls Menu. Below are settings to manipulate the Wallpapers added in the Database. So, @${ctx.message.from.username} what you want to do?`,{ reply_markup: inlineKeyboard }
            );

            return message;
        }
    }
}