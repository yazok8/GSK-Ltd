import express from "express";
import next from "next";
import helmet from "helmet";
import csrf from "csurf";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Basic security headers
  server.use(
    helmet({
      contentSecurityPolicy: false, // Disable helmet's default CSP
    })
  );

  // Custom CSP configuration that works with Next.js
  server.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      dev
        ? // Development CSP
          `
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval' trusted.cdn.com;
          style-src 'self' 'unsafe-inline';
          img-src 'self' data: blob: https:;
          font-src 'self' data:;
          connect-src 'self' ws: wss:;
          frame-src 'self';
          base-uri 'self';
          form-action 'self';
          `
            .replace(/\s{2,}/g, ' ')
            .trim()
        : // Production CSP (more restrictive)
          `
          default-src 'self';
          script-src 'self' 'unsafe-inline' trusted.cdn.com;
          style-src 'self' 'unsafe-inline';
          img-src 'self' data: blob:;
          font-src 'self' data:;
          connect-src 'self';
          frame-src 'self';
          base-uri 'self';
          form-action 'self';
          `
            .replace(/\s{2,}/g, ' ')
            .trim()
    );
    next();
  });

  // Rate limiting configuration
  if (process.env.NODE_ENV === 'production') {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: "Too many requests from this IP, please try again after 15 minutes"
    });
    server.use(limiter);
    console.log('Rate limiting enabled for production');
  } else {
    console.log('Rate limiting disabled for development');
  }

  // Cookie parser and CSRF protection
  server.use(cookieParser());
  const csrfProtection = csrf({ cookie: true });

  server.post("*", csrfProtection, (req, res, next) => {
    next();
  });

  server.get("*", (req, res, next) => {
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
    next();
  });

  // Handle all other routes with Next.js
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  // Error handling
  server.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
      res.status(403).json({ message: "Invalid CSRF Token" });
    } else {
      next(err);
    }
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});