const resetPassword = async (ctx, userId) => {
    const uploader = await Uploader.findOneAndUpdate({ userID: userId }, { password: null });
    
    await ctx.reply(`Uploader - ${uploader.username}'s password reset successfully.`);
}

module.exports = resetPassword;