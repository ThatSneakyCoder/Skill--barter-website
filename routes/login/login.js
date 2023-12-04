var express = require('express');
var router = express.Router();
const passport = require('passport');
const { checkAuthenticated } = require('../../api/authMiddleware');

/* GET home page. */
router.get("/", checkAuthenticated, function(req, res, next) {
    res.render('login');
});

router.post("/", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            // Authentication failed
            return res.redirect('/users/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Redirect to the dynamic route
            return res.redirect(`/users/${user.id}/dashboard`);
        });
    })(req, res, next);
});

module.exports = router;