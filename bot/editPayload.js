module.exports = async (ctx, updateMessage) => {
    if (
		ctx.callbackQuery.from.id == 975024565 ||
		ctx.callbackQuery.from.id == 934949695 ||
		ctx.callbackQuery.from.id == 1889905927 ||
		ctx.callbackQuery.from.id == 127070302
	) {
        if (updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id).length > 0) {
            const messageToUpdate = updateMessage.filter(msg => msg.userId === ctx.callbackQuery.from.id)[0];
            const allCategories = await Category.find().sort({ name: 1 });

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

            await ctx.api.editMessageText(messageToUpdate.message.chatId, messageToUpdate.message.id, "Choose a Category to edit a Wallpaper from -", { reply_markup: editKeyboard, message_thread_id: messageToUpdate.message.message_thread_id });
        }
    }
}