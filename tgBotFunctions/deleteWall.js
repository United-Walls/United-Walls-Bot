const Category = require('../models/Category');
const Walls = require('../models/Walls');
const fs = require('fs');

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
	fs.rm(`/home/paraskcd/United-Walls-Bot/storage/wallpapers/${category.name.replace(/\s/g, '')}/${wall.file_name}.${wall.mime_type == "image/jpeg" ? "jpg" : "png"}`, { recursive: true }, (err) => {
		if(err){
			// File deletion failed
			console.error(err.message);
			return;
		}
		console.log(`${wall.file_name}.${wall.mime_type == "image/jpeg" ? "jpg" : "png"} Full Res deleted successfuly`);
	});
	fs.rm(`/home/paraskcd/United-Walls-Bot/storage/wallpapers/${category.name.replace(/\s/g, '')}/thumbnails/${wall.file_name}.${wall.mime_type == "image/jpeg" ? "jpg" : "png"}`, { recursive: true }, (err) => {
		if(err){
			// File deletion failed
			console.error(err.message);
			return;
		}
		console.log(`${wall.file_name}.${wall.mime_type == "image/jpeg" ? "jpg" : "png"} Thumbnail deleted successfuly`);
	});
	return wall.file_name;
};

module.exports = deleteWall;
