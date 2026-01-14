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
        // 1. Check if user exists by Google ID
        let user = await UserModel.findOne({ googleId: profile.id });

        if (user) {
          console.log("🔍 Found existing Google user:", {
            userId: user._id.toString(),
            name: user.name,
            email: user.email
          });
          return done(null, user);
        }

        // 2. If not found by Google ID, check by Email (to link accounts)
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (email) {
          user = await UserModel.findOne({ email });
          if (user) {
            console.log("🔗 Linking Google account to existing email user:", email);
            user.googleId = profile.id;
            if (!user.name) user.name = profile.displayName;
            if (!user.avatar) user.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : undefined;
            await user.save();
            return done(null, user);
          }
        }

        // 3. Create new user if not found
        console.log("🔍 Creating new Google user:", {
          googleId: profile.id,
          name: profile.displayName,
          email: email
        });

        user = await UserModel.create({
          googleId: profile.id,
          name: profile.displayName,
          username: email, // Set username as email for consistency
          email: email,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
          plan: "free",
          credits: 20,
        });

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export { passport };

