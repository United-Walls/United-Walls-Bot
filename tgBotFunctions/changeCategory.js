const Category = require('../models/Category');
const Walls = require('../models/Walls');

const changeCategory = async (ctx, messageToUpdate, categoryId) => {
	const wall = await Walls.findById(messageToUpdate.extras.wallId).populate('category');
	const previousCategory = await Category.findById(wall.category.id).populate(
		'walls'
	);
	const newCategory = await Category.findById(categoryId).populate('walls');

	const previousCategoryWalls = previousCategory.walls.filter(
		(wall) => wall.id != messageToUpdate.extras.wallId
	);
	await Category.findByIdAndUpdate(wall.category.id, {
		walls: previousCategoryWalls,
	});

	let newCategoryWalls = newCategory.walls;
	newCategoryWalls.push(wall);
	const latestCategory = await Category.findByIdAndUpdate(categoryId, {
		walls: newCategoryWalls,
	});
	await Walls.findByIdAndUpdate(messageToUpdate.extras.wallId, { category: latestCategory });

	await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id,
		'Wallpaper Category changed from - ' +
			previousCategory.name +
			' to - ' +
			latestCategory.name, { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id }
	);
};

module.exports = changeCategory;
