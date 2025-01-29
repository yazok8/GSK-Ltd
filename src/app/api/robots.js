// pages/api/robots.js
export default function GET(req, res) {
  // Plain text for /robots.txt
  const robotsTxt = `
  User-agent: *
  Allow: /
  
  Sitemap: https://www.gsk-international.com/sitemap.xml
  `;

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(robotsTxt.trim());
}
