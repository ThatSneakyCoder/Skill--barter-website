var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require('../../dbConfig');
const { checkAuthenticated} = require('../../api/authMiddleware');

/* GET home page. */
router.get('/', checkAuthenticated, function(req, res) {
        res.render('signup');
});

router.post('/', async (req, res) => {
    let { name, email, password, password2 } = req.body;

    // console.log({
    //     name,
    //     email,
    //     password,
    //     password2
    // });

    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({
            message: "Please enter all fields"
        });
    }

    if (password.length < 6) {
        errors.push({
            message: "Password should be at least 6 characters"
        });
    }

    if (password !== password2) {
        errors.push({
            message: "Passwords do not match"
        });
    }

    if (errors.length > 0) {
        res.render("signup", { errors });
    }

    // Now we'll check in the database if the user already exists

    let hashedPassword = await bcrypt.hash(password, 10);
    // console.log(hashedPassword);

    // after hashing, we would want to query our database.

    pool.query(
        `SELECT * FROM users
        WHERE email = $1`, [email], (error, results) => {
            if (error) throw error;
            // console.log(results.rows);

            if (results.rows.length > 0) {
                errors.push({
                    message: "User already exists"
                });
                res.render("signup", { errors });
            } else {
                // this means there is no user in the database and, we can register the user in the database

                pool.query(
                    `INSERT INTO users (name, email, password)
                  VALUES ($1, $2, $3)
                  RETURNING id, password`, [name, email, hashedPassword], (error, results) => {
                        if (error) throw error;

                        // console.log(results)
                        // console.log(results.rows); -> returns list of rows
                        // console.log(results.rows[0]); -> returns the first row object which contains all the first row details
                        // console.log(results.rows[0].id); // returns the id column value from the first row of the output of the statement
                        req.flash(`success_msg`, "You are now registered. Please login");
                        res.redirect('/users/login');
                    }
                );
            }
        }
    );

});

module.exports = router;