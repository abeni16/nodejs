var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require("./models/user");
var JwtStrategy = require("passport-jwt").Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;
var jwt = require("jsonwebtoken");
var FacebookTokenStrategy = require("passport-facebook-token");

var config = require("./config");

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
  return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
opts.secretOrKey = config.secretKey;
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("jwt payload: " + jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = (req, res, next) => {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, config.secretKey, (err, decoded) => {
      if (err) {
        var err = new Error("You are not authenticated!");
        err.status = 401;
        return next(err);
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    var err = new Error("No token provided!");
    err.status = 403;
    return next(err);
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    var err = new Error("You are not authorized to perform this operation!");
    err.status = 403;
    return next(err);
  }
};
exports.facebookPassport = passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookId: profile.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!err && user !== null) {
          return done(null, user);
        } else {
          user = new User({ usernaem: profile.displayName });
          user.facebookId = profile.id;
          user.firstname = profile.name.giveName;
          user.lastname = profile.name.familyName;
          user.save((err, user) => {
            if (err) {
              return done(err, false);
            } else {
              return done(null, user);
            }
          });
        }
      });
    }
  )
);
