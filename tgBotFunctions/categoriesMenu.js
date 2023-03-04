const Category = require('../models/Category');

const categoriesMenu = async (ctx) => {
	const allCategories = await Category.find().sort({ file_name: 1 });

	let editKeyboard = { inline_keyboard: [] };
	let categoriesMapped = [];

	await Promise.all(
		allCategories.map((category) => {
			categoriesMapped.push({
				text: category.name,
				callback_data: `Cat_${category.id}`,
			});
		})
	);

	let array = [];

	for (let i = 0; i < categoriesMapped.length; i++) {
		let mappedCategory = categoriesMapped[i];
		array.push(mappedCategory);

		if ((i + 1) % 2 == 0) {
			editKeyboard.inline_keyboard.push(array);
			array = [];
		}

		if (i == categoriesMapped.length - 1 && categoriesMapped.length % 2 != 0) {
			editKeyboard.inline_keyboard.push([mappedCategory]);
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

	await ctx.reply(`Choose a Category to edit a Wallpaper from -`, {
		reply_markup: editKeyboard,
	});
};

module.exports = categoriesMenu;