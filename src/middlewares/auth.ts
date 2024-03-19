import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import {UserDocument}  from '../models/User';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'Speed'
};

passport.use(new JwtStrategy(jwtOptions, (jwtPayload: UserDocument, done) => {
  return done(null, jwtPayload);
}));

export const authenticateUser = passport.authenticate('jwt', { session: false });

export const authorizeAdmin = (req: any, res: any, next: any) => {
  const user = req.user as UserDocument;

  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  next();
};
