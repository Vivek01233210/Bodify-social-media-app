import passport from "passport";
// const User = require("../models/User/User");
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt";
import { ExtractJwt as ExtractJWT } from "passport-jwt";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/user.js";

// Configure passport local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // username || email
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: "Invalid username or password" });
        }
        //verify the password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid username or password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

//JWT-Options
const options = {
  jwtFromRequest: ExtractJWT.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies["token"];
        return token;
      }
    },
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

//JWT
passport.use(
  new JWTStrategy(options, async (userDecoded, done) => {
    try {
      const user = await User.findById(userDecoded.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

// GOOGLE OAUTH
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: "http://localhost:5000/api/v1/user/auth/google/callback",
      callbackURL: `${process.env.BONDIFY_API_URL}/user/auth/google/callback`,
    },
    async (accessToken, refreshtoken, profile, done) => {
      try {
        //check if user found
        let user = await User.findOne({
          googleId: profile.id,
        });

        //destructure properties from the profile
        const { id, displayName, _json: { picture } } = profile;

        //check if email exists( many times google doesn't provide user email for security reasons)
        let email = "";
        if (Array.isArray(profile?.emails) && profile?.emails?.length > 0) {
          email = profile.emails[0].value;
        }else{
          email = null;
        }

        //check if user not found
        if (!user) {
          user = await User.create({
            username: displayName,
            googleId: id,
            profilePicture: picture,
            authMethod: "google",
            email: email,
          });
        }
        done(null, user);

      } catch (error) {
        done(error, null);
      }
    }
  )
);


export default passport;