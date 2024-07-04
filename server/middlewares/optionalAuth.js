import passport from 'passport';

export const optionalAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user, info) => {
        if (error || !user) {
            req.user = null;
            return next();
        }

        // save the user in the req object
        req.user = user._id;
        return next();
    })(req, res, next);  // IIFE
};