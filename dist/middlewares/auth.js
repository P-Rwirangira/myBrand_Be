"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticateUser = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Speed'
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (jwtPayload, done) => {
    return done(null, jwtPayload);
}));
exports.authenticateUser = passport_1.default.authenticate('jwt', { session: false });
const authorizeAdmin = (req, res, next) => {
    const user = req.user;
    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
