const express = require('express');
const Uploader = require('../../models/Uploader');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../../middleware/auth');
const TgBot = require('../../TgBot');
const TwoFA = require('../../models/2FA');

/*
Route -     POST api/creators/auth
Desc -      Login
Access -    Public
*/
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await Uploader.findOne({
            $or: [
                { userID: parseInt(username) },
                { username: username }
            ]
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({
                id: user._id,
                userID: user.userID,
                username: user.username
            },
            process.env.TOKEN_KEY);

            const twoFA = await TwoFA.create({ user: user, bearerToken: token });

            TgBot.api.sendMessage(user.userID, `Login Code: ${twoFA.token}. \n\nDo not give this code to anyone, even if they say they are from United Walls. \n\nThis code can be used to log in to your United Walls Account. We never ask it for anything else. \n\nIf you did not request this code by trying to log in, simply ignore this message.`);

            return res.status(200).json({
                token: "Bearer " + token
            })
        }
        
        return res.status(400).send("Bro forgot his username or password 💀. Funny!")
    } catch (err) {
        console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

// Router -     GET api/creators/auth/2fa
// Desc -       Send 2fa to telegram
// Access -     Private
router.get('/2fa', verifyToken, async (req, res) => {
    try {
        const user = await Uploader.findOne({ userID: req.user.userID});
        const twoFA = await TwoFA.create({ user: user });

        if (user) {
            TgBot.api.sendMessage(user.userID, `Login Code: ${twoFA.token}. \n\nDo not give this code to anyone, even if they say they are from United Walls. \n\nThis code can be used to log in to your United Walls Account. We never ask it for anything else. \n\nIf you did not request this code by trying to log in, simply ignore this message.`);

            return res.status(200).json({
                msg: "Sent another Code"
            });
        } else {
            return res.status(403).send("Ok who the fuck? Bro are you lost? If you got this message, it means you either fucked up something, don't have the necessary stuff I need, aren't authorized, or you just a plain dumbass. Now Fuck OFF!")
        }
    } catch (err) {
        console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

// Router -     POST api/creators/auth/2fa
// Desc -       Send 2fa to server
// Access -     Private
router.post('/2fa', verifyToken, async (req, res) => {
    try {
        const { twoFA } = req.body;

        console.log(req.user)
        const uploader = await Uploader.findById(req.user.id);
        const twofa = await TwoFA.findOne({token: twoFA, user: uploader});

        if (uploader) {
            if (twofa) {
                if (typeof twofa.isExpired() != 'boolean' && twofa.isExpired() !== true) {
                    const twofa = await TwoFA.find({user: uploader});
    
                    for(let i = 0; i < twofa.length; i++) {
                        await TwoFA.findByIdAndDelete(twofa[i].id)
                    }
    
                    return res.status(200).json(req.user);
                } else {
                    const twoFA = await TwoFA.create({ user: uploader });
        
                    TgBot.api.sendMessage(req.user.userID, `Login Code: ${twoFA.token}. \n\nDo not give this code to anyone, even if they say they are from United Walls. \n\nThis code can be used to log in to your United Walls Account. We never ask it for anything else. \n\nIf you did not request this code by trying to log in, simply ignore this message.`);
        
                    return res.status(200).json({
                        msg: "Sent another Code"
                    });
                }
            } else {
                const twoFA = await TwoFA.create({ user: uploader });
    
                TgBot.api.sendMessage(req.user.userID, `Login Code: ${twoFA.token}. Do not give this code to anyone, even if they say they are from United Walls. \n\nThis code can be used to log in to your United Walls Account. We never ask it for anything else. \n\nIf you did not request this code by trying to log in, simply ignore this message.`);
    
                return res.status(200).json({
                    msg: "Sent another Code"
                });
            }
        } else {
            return res.status(403).send("Ok who the fuck? Bro are you lost? If you got this message, it means you either fucked up something, don't have the necessary stuff I need, aren't authorized, or you just a plain dumbass. Now Fuck OFF!");
        }
        
    } catch (err) {
        console.log(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

// Route -      GET api/creators/auth
// Desc -       Get user by token
// Access -     Private
router.get('/', verifyToken, async (req, res) => {
    try {
        let token = req.body.token || req.query.token || req.headers['authorization'] || req.headers['Authorization'];
        token = token.replace(/^Bearer\s+/, "");

        const uploader = await Uploader.findById(req.user.id);
        const twofa = await TwoFA.find({$or: [
            {user: uploader},
            {bearerToken: token}
        ]});

        if (twofa.length > 0) {
            return res.status(401).send("Ok who the fuck? Bro are you lost? If you got this message, it means you either fucked up something, don't have the necessary stuff I need, aren't authorized, or you just a plain dumbass. Now Fuck OFF!");
        } else {
            return res.status(200).json(req.user);
        }

    } catch (err) {
        console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

// Route -      GET api/creators/auth/forgotPassword
// Dec -        Change Password
// Access -     Public
router.post('/forgotPassword', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await Uploader.findOne({
            $or: [
                { userID: parseInt(username) },
                { username: username }
            ]
        });

        if (user) {
            TgBot.api.sendMessage(user.userID, `You are receiving this message, because someone has requested to reset your Password for your United Walls Account. \n\n For Security reasons, we can't reset your password, it needs to be done by you.\n\n Simply enter the command of "/menu" without inverted commas and press Reset Password to reset your password. You will require to register again in order to use your Account in the United Walls Creators App.\n\n If you did not request this, simply ignore this message.`);
        }

        return res.status(200).json({
            msg: "Password reset message sent"
        });
    } catch (err) {
        console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

// Route -      GET api/creators/auth/logout
// Dec -        Logout
// Access -     Public
router.get('/logout', async (req, res) => {
    try {
        let token = req.body.token || req.query.token || req.headers['authorization'] || req.headers['Authorization'];
        token = token.replace(/^Bearer\s+/, "");
        
        const uploader = await Uploader.findById(req.user.id);
        const twofa = await TwoFA.find({$or: [
            {user: uploader},
            {bearerToken: token}
        ]});

        for (let i = 0; i < twofa.length; i++) {
            await TwoFA.findByIdAndDelete(twofa[i].id);
        }

        return res.status(200);
    } catch (err) {
        console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err.message}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
    }
});

module.exports = router;