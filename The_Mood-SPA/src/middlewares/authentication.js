import jwt from 'jsonwebtoken';

/**
 * Authentication for logged in users
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next 
 */
export default function authorization(req, res, next) {
  const token = req.headers.token;

  if (!token) {
      return res.status(401).json({
          success: false,
          message: 'Unauthenticated user',
      });
  }

    jwt.verify(token, process.env.API_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }

        req.user = { id: decoded.id, username: decoded.username }; 
        res.locals.username = decoded.username; 
        next();
    });
}