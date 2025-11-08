 import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GOOGLE_REDIRECT_URI } from "../config.js";
import { UserModel } from "../models/user.model.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ googleId: profile.id });

        if (!user) {
          console.log("🔍 Creating new Google user:", {
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          });
          user = await UserModel.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            plan: "free",
            credits: 20,
          });
        } else {
          console.log("🔍 Found existing Google user:", {
            userId: user._id.toString(),
            name: user.name,
            email: user.email
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export { passport };
