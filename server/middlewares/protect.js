import passport from 'passport';

export const protect = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user, info) => { 
        if(error || !user){
            return res.status(401).json({message: "Login required", error: error?.message})
        }
        
        // save the user in the req object
        req.user = user?._id;
        return next(); 
    })(req, res, next);
}