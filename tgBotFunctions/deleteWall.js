const Category = require('../models/Category');
const Walls = require('../models/Walls');

const deleteWall = async (wallId) => {
	const wall = await Walls.findById(wallId).populate('category');
	const category = await Category.findById(wall.category.id).populate('walls');
	let newCategoryWalls = category.walls.filter((wall) => wall.id != wallId);
	if (newCategoryWalls.length == 0) {
		await Category.findByIdAndDelete(wall.category.id);
	} else {
		await Category.findByIdAndUpdate(wall.category.id, {
			walls: newCategoryWalls,
		});
	}
	await Walls.findByIdAndDelete(wallId);

	return wall.file_name;
};

module.exports = deleteWall;
