require('dotenv').config();
import passport from 'passport';
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const configLoginWithGoogle = (app) => {

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },
        async function (accessToken, refreshToken, profile, cb) {
            console.log("check profile: ", profile);
            // const typeAcc = "GOOGLE";
            // let data = {
            //     userName: profile.displayName,
            //     email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
            //     googleId: profile.id
            // }
            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //     return cb(err, user);
            // });
        }))
    app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/api/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function (req, res) {
            console.log("check req.user: ", req.user);
            //res.redirect("http://localhost:3000/");
        });
}
module.exports = {
    configLoginWithGoogle
}