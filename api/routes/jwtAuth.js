const router = require('express').Router();
const pool = require('../database/db');
const bcrypt = require('bcrypt');
const jwtGenerator = require('../utils/jwtGenerator');
const validInfo = require('../middleware/validinfo');
const authorization = require('../middleware/authorization');

// registering

router.post('/register', validInfo, async (req, res) => {
    try {
        // req body
        const { name, email, password } = req.body;

        // check user exist
        const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);

        if (user.rows.length !== 0) {
            return res.status(401).json('User already exist');
        }

        // bcrypt password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);


        // add new user to database
        const newUser = await pool.query('INSERT INTO users (user_name, user_email, user_password) VALUES($1, $2, $3) RETURNING *',
            [name, email, bcryptPassword]
        );

        // res.json(newUser.rows[0]);

        // generate jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
})

// login route

router.post('/login', validInfo, async (req, res) => {
    try {
        // req body
        const { email, password } = req.body;

        // check user exist
        const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json('Password or Email is incorrect');
        }

        // check incoming password  
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).json('Password or Email is incorrect');
        }

        // console.log(validPassword);

        // give jwt token
        const token = jwtGenerator(user.rows[0].user_id);

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
})

router.get('/is-verify', authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
})


module.exports = router;