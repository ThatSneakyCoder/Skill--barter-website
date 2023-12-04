var express = require('express');
var router = express.Router();
const { checkNotAuthenticated } = require('../../api/authMiddleware');
const {pool} = require("../../dbConfig");


router.get("/", checkNotAuthenticated, function(req, res) {

    const user = req.user;
    const id = user.id;

    pool.query(`SELECT u.id ,u.name, u.user_desc, s.skill
                FROM users u
                LEFT JOIN skill s
                ON u.id = s.user_id 
                WHERE id <> $1`, [id], (error, results) => {

        if (error) throw error;

        const rows = results.rows;
        let rowValues = [];

        rows.forEach(function (row) {
            rowValues.push({
                id: row.id,
                name: row.name,
                user_desc: row.user_desc,
                skill: row.skill,
            });
        });

        res.render('dashboard', { user, rowValues });
    });
});

router.post("/skill", (req, res) => {
    const user_id = req.user.id;
    const skill = req.body.skill;
    const user_desc = req.body.user_desc;

    // if skill is not empty then it needs to be put in the database

    let errors = [];

    if (!skill || !user_desc) {
        errors.push({
            message: "Please enter all fields"
        });
        res.render(`dashboard`, { errors });
    }

    pool.query(
        `INSERT INTO skill (user_id, skill) VALUES ($1, $2)`,
        [user_id, skill], (error, results) => {
            if (error) throw error;

            pool.query(`UPDATE users SET user_desc = $1 WHERE id = $2`, [user_desc, user_id], (error, results) => {
                if (error) throw error;
            });

            req.flash('success_msg', "Your skill has been added");
            res.redirect(`/users/${user_id}/dashboard`);
        }
    );
});

module.exports = router;