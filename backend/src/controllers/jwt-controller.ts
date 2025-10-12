import jwt, { JwtPayload } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Errors } from "../models/errorsModel";
import { Messages } from "../models/messages";

dotenv.config();

const JWT_secret = process.env.JWT_SECRET || "default_secret"; //*this function retrieves the JWT secret from environment variables

const issueToken = (payload: object): string => {
  // console.log("the secret key is:", JWT_secret);
  //*this fuction expects a payload which is the data included in payload in the header
  return jwt.sign(payload, JWT_secret!, { expiresIn: "1h" });
};
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  // console.log("Authenticating JWT...");

  // Read token from cookies
  const token = req.cookies?.token; // assumes the cookie name is "token"

  if (!token) {
    // No token at all
    // console.log("No token found in cookies");
    return res.status(Errors.NOT_LOGGED_IN.status).json({
      error: Errors.NOT_LOGGED_IN.message,
      code: Errors.NOT_LOGGED_IN.code,
    });
  }

  // Token exists, but verify it
  jwt.verify(
    token,
    JWT_secret,
    (
      err: jwt.VerifyErrors | null,
      decoded: string | JwtPayload | undefined
    ) => {
      if (err) {
        // Token invalid or expired
        // console.log("Token invalid or expired");
        return res.status(Errors.INVALID_OR_EXPIRED_TOKEN.status).json({
          error: Errors.INVALID_OR_EXPIRED_TOKEN.message,
          code: Errors.INVALID_OR_EXPIRED_TOKEN.code,
        });
      }

      // Token valid, attach decoded payload
      // console.log("Decoded JWT user:", decoded);
      (req as any).user = decoded;
      if (req.path === "/authuser") {
        return res.json({
          success: true,
          message: "User authenticated and logged in",
          isLoggedIn: true,
          user: decoded,
        });
      }

      // ✅ Otherwise, let next middleware/route handle it
      next();
    }
  );
};

//! if we go for the piggyback  solution for checking auth status
//! so we need to update the state manually in each api call that requires auth
//this is a non block jwt verification middleware
//it verifies the token and attaches the user to the request object
//if the token is invalid or expired, it still calls next() but without attaching the user
//the route handler can then check if req.user exists to determine if the user is authenticated
// const CheckAuth = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies?.token;
//   if (!token) {
//     return res.status(Errors.NOT_LOGGED_IN.status).json({
//       error: Errors.NOT_LOGGED_IN.message,
//       code: Errors.NOT_LOGGED_IN.code,
//     });
//   }
//   jwt.verify(
//     token,
//     JWT_secret,
//     (
//       err: jwt.VerifyErrors | null,
//       decoded: string | JwtPayload | undefined
//     ) => {
//       if (err) {
//         (req as any).user.isLoggedIn = false;
//         return res.status(Errors.INVALID_OR_EXPIRED_TOKEN.status).json({
//           error: Errors.INVALID_OR_EXPIRED_TOKEN.message,
//           code: Errors.INVALID_OR_EXPIRED_TOKEN.code,
//         });
//       }
//       (req as any).user = decoded;
//       (req as any).user.isLoggedIn = true;
//       next();
//     }
//   );
// };
const authenticateresetJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Authenticating Secret JWT...");

  // Read token from cookies
  const token = req.cookies?.resetToken;

  if (!token) {
    // console.log("No token found in cookies");
    return res.status(Errors.NOT_LOGGED_IN.status).json({
      error: Errors.NOT_LOGGED_IN.message,
      code: Errors.NOT_LOGGED_IN.code,
    });
  }
  jwt.verify(
    token,
    JWT_secret,
    (
      err: jwt.VerifyErrors | null,
      decoded: string | JwtPayload | undefined
    ) => {
      if (err) {
        // console.log("Token invalid or expired");
        return res.status(Errors.INVALID_OR_EXPIRED_TOKEN.status).json({
          error: Errors.INVALID_OR_EXPIRED_TOKEN.message,
          code: Errors.INVALID_OR_EXPIRED_TOKEN.code,
        });
      }

      // Token valid, attach decoded payload
      // console.log("Decoded JWT user:", decoded);

      // Restriction: check email in token vs email in request
      const tokenEmail =
        typeof decoded === "object" && decoded !== null
          ? (decoded as JwtPayload).email
          : undefined;
      const reqEmail = req.body?.email || req.query?.email || req.params?.email;

      if (!tokenEmail || !reqEmail || tokenEmail !== reqEmail) {
        // console.log("Email mismatch or missing");
        return res.status(403).json({
          error: "Email in token does not match email in request.",
          code: "EMAIL_MISMATCH",
        });
      }

      (req as any).user = decoded;
      next();
    }
  );
};
const authenticateAdminJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.AdminToken;

  if (!token) {
    return res.status(Errors.NOT_AUTH.status).json({
      error: Errors.NOT_AUTH.message,
      code: Errors.NOT_AUTH.code,
    });
  }

  jwt.verify(
    token,
    JWT_secret,
    (
      err: jwt.VerifyErrors | null,
      decoded: string | JwtPayload | undefined
    ) => {
      if (err) {
        return res.status(Errors.INVALID_OR_EXPIRED_TOKEN.status).json({
          error: Errors.INVALID_OR_EXPIRED_TOKEN.message,
          code: Errors.INVALID_OR_EXPIRED_TOKEN.code,
        });
      }

      // Attach user to request
      (req as any).user = decoded;

      // ✅ Special case: if this is the check-auth endpoint, return response here
      if (req.path === "/admin/check-admin-auth") {
        return res.json({
          success: true,
          message: "Admin authenticated",
          user: decoded,
        });
      }

      // ✅ Otherwise, let next middleware/route handle it
      next();
    }
  );
};

export default {
  //exports as objects
  issueToken,
  authenticateJWT,
  authenticateresetJWT,
  authenticateAdminJWT,
};

/**
 * !! the auth-user
 * 1 name changed to check-admin-auth
 * the issue was that this middleware isnt returning any response if the token is valid
 * it returns the response only if the token is invalid or missing
 * so the frontend is left hanging without a response
 * 2 added a special case to return a response if the path is /admin/check-auth
 * 3 tested and it works
 */
