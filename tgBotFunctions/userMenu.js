const Uploader = require("../models/Uploader");

const userMenuMethod = async (ctx, userId) => {
    const uploader = await Uploader.findOne({ userID: parseInt(userId) });

    let editKeyboard = {
        inline_keyboard: [
            [{ text: 'Update user (With updated Data from Telegram)', callback_data: `UUpl_${userId}`}],
            [{ text: 'Edit user (username, image privacy, etc.)', callback_data: `EUpl_${userId}`}],
            [{ text: 'Delete user (From Database)', callback_data: `DUpl_${userId}`}],
            [{ text: 'Edit User\'s Walls (Edit User\'s uploaded Walls)', callback_data: `WUpl_${userId}`}],
            [{ text: 'Go back', callback_data: `edit-user-payload` }],
            [{ text: 'Exit', callback_data: 'exit-payload' }],
        ],
    };

    await ctx.reply(`What would you like to do with Uploader - ${uploader.username} -`, {
		reply_markup: editKeyboard,
	});
}

module.exports = userMenuMethod