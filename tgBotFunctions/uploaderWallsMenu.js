const Uploader = require("../models/Uploader")

const uploaderWallsMenu = async (ctx, userId, page) => {
    let intPage = parseInt(page);
    const numberOfWalls = 16;

    const uploaderWallCount = await Uploader.findOne({userID: userId});

    const totalNumberOfWalls = uploaderWallCount.walls.length;

    const uploader = await Uploader.findOne({userID: userId}).populate({
		path: 'walls',
		options: {
			sort: { createdAt: -1 },
			collation: { locale: 'en_US', numericOrdering: true },
            skip: page * numberOfWalls,
            limit: numberOfWalls
		},
	});

    const walls = uploader.walls;

    let editKeyboard = { inline_keyboard: [] };
	let wallsMapped = [];

    await Promise.all(
		walls.map((wall) => {
			wallsMapped.push({
				text: wall.file_name,
				callback_data: `Wal_${wall.id}`,
			});
		})
	);

    let array = [];

    for (let i = 0; i < wallsMapped.length; i++) {
		let mappedWall = wallsMapped[i];

		if (wallsMapped.length > 2) {
			array.push(mappedWall);

			if ((i + 1) % 2 == 0) {
				editKeyboard.inline_keyboard.push(array);
				array = [];
			}

			if (i == wallsMapped.length - 1 && wallsMapped.length % 2 != 0) {
				editKeyboard.inline_keyboard.push([mappedWall]);
			}
		} else {
			editKeyboard.inline_keyboard.push([mappedWall]);
		}
	}

	let next = intPage + 1;
	let prev = intPage - 1;

    if (intPage === 0) {
        editKeyboard.inline_keyboard.push(
            [{ text: 'Next ->', callback_data: `UpW_${userId}_${next}`}],
            [{ text: 'Go back', callback_data: 'go-back-from-edit-payload'}],
            [{ text: 'Exit', callback_data: 'exit-payload' }]
        );
    } else if ((page * numberOfWalls) + numberOfWalls < totalNumberOfWalls) {
        editKeyboard.inline_keyboard.push(
            [{ text: '<- Previous', callback_data: `UpW_${userId}_${prev}`}, { text: 'Next ->', callback_data: `UpW_${userId}_${next}`}],
            [{ text: 'Go back', callback_data: 'go-back-from-edit-payload'}],
            [{ text: 'Exit', callback_data: 'exit-payload' }]
        );
    } else {
        editKeyboard.inline_keyboard.push(
            [{ text: '<- Previous', callback_data: `UpW_${userId}_${prev}`}],
            [{ text: 'Go back', callback_data: 'go-back-from-edit-payload'}],
            [{ text: 'Exit', callback_data: 'exit-payload' }]
        );
    }

	await ctx.reply(`Choose a Wallpaper to edit -`, {
		reply_markup: editKeyboard,
	});
}

module.exports = uploaderWallsMenu;