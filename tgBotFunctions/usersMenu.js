const Uploader = require("../models/Uploader")

const usersMenuMethod = async (ctx) => {
    const allUploaders = await Uploader.find().sort({ username: 1 });

    let editKeyboard = { inline_keyboard: [] };
	let uploadersMapped = [];

    await Promise.all(
		allUploaders.map((uploader) => {
			uploadersMapped.push({
				text: uploader.username,
				callback_data: `Upl_${uploader.userID}`,
			});
		})
	);

    let array = [];

    for (let i = 0; i < uploadersMapped.length; i++) {
		let mappedUploaders = uploadersMapped[i];
		array.push(mappedUploaders);

		if ((i + 1) % 2 == 0) {
			editKeyboard.inline_keyboard.push(array);
			array = [];
		}

		if (i == uploadersMapped.length - 1 && uploadersMapped.length % 2 != 0) {
			editKeyboard.inline_keyboard.push([mappedUploaders]);
		}
	}

    editKeyboard.inline_keyboard.push([
		{
			text: 'Go back',
			callback_data: 'go-back-from-edit-payload',
		},
	]);

	editKeyboard.inline_keyboard.push([
		{ text: 'Exit', callback_data: 'exit-payload' },
	]);

	await ctx.reply(`Choose a User to edit -`, {
		reply_markup: editKeyboard,
	});
}

module.exports = usersMenuMethod;