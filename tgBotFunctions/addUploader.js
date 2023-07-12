const Walls = require("../models/Walls");

const addUploaderMethod = async (ctx, wallId) => {
	const uploaderName = ctx.update.message.text;

	if (uploaderName != undefined) {
		await Walls.findByIdAndUpdate(wallId, { addedBy: uploaderName });
		await ctx.reply('Wall updated with Uploader name - ' + uploaderName);
	}
};

module.exports = addUploaderMethod;
