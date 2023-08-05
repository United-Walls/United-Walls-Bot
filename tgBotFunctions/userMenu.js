const Uploader = require("../models/Uploader");

const userMenuMethod = async (ctx, messageToUpdate, userId) => {
    const uploader = await Uploader.findOne({ userID: parseInt(userId) });

    let editKeyboard = {
        inline_keyboard: [
            [{ text: 'Update user (With updated Data from Telegram)', callback_data: `UUpl_${userId}`}],
            [{ text: 'Edit user (username, image privacy, etc.)', callback_data: `EUpl_${userId}`}],
            [{ text: 'Delete user (From Database)', callback_data: `DUpl_${userId}`}],
            [{ text: 'Reset Password of user', callback_data: `RUpl_${userId}`}],
            [{ text: 'Edit User\'s Walls (Edit User\'s uploaded Walls)', callback_data: `WUpl_${userId}`}],
            [{ text: 'Go back', callback_data: `go-back-from-edit-payload` }],
            [{ text: 'Exit', callback_data: 'exit-payload' }],
        ],
    };

    await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, `What would you like to do with Uploader - ${uploader.username} -`, { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });
}

module.exports = userMenuMethod