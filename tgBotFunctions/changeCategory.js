const Category = require('../models/Category');
const Walls = require('../models/Walls');

const changeCategory = async (ctx, wallId, categoryId) => {
	const wall = await Walls.findById(wallId).populate('category');
	const previousCategory = await Category.findById(wall.category.id).populate(
		'walls'
	);
	const newCategory = await Category.findById(categoryId).populate('walls');

	const previousCategoryWalls = previousCategory.walls.filter(
		(wall) => wall.id != wallId
	);
	await Category.findByIdAndUpdate(wall.category.id, {
		walls: previousCategoryWalls,
	});

	let newCategoryWalls = newCategory.walls;
	newCategoryWalls.push(wall);
	const latestCategory = await Category.findByIdAndUpdate(categoryId, {
		walls: newCategoryWalls,
	});
	await Walls.findByIdAndUpdate(wallId, { category: latestCategory });

	await ctx.reply(
		'Wallpaper Category changed from - ' +
			previousCategory.name +
			' to - ' +
			latestCategory.name, { message_thread_id: ctx.update.callback_query.message.message_thread_id }
	);
};

module.exports = changeCategory;
