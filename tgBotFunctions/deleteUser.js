const Category = require("../models/Category");
const Uploader = require("../models/Uploader");
const Walls = require("../models/Walls");

const deleteUserMethod = async (ctx, messageToUpdate, userId) => {
    const uploader = await Uploader.findOneAndDelete({userID: userId});

    await Promise.all(uploader.walls.forEach(async (wall) => {
        await Walls.findByIdAndDelete(wall);
        await Category.findByIdAndUpdate(wall.category, {
            $pull: { walls: wall }
        })
    }));
    
    await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, `Uploader - ${uploader.username} deleted successfully.`, { reply_markup: {}, message_thread_id: messageToUpdate.message.message_thread_id });
}

module.exports = deleteUserMethod;