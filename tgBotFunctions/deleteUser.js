const Uploader = require("../models/Uploader");
const Walls = require("../models/Walls");

const deleteUserMethod = async (ctx, userId) => {
    const uploader = await Uploader.findOneAndDelete({userID: userId});

    await Promise.all(uploader.walls.forEach(async (wall) => {
        await Walls.findByIdAndDelete(wall);
    }));
    
    await ctx.reply(`Uploader - ${uploader.username} deleted successfully.`);
}

module.exports = deleteUserMethod;