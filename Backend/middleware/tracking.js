const { v4: uuidv4 } = require('uuid');
const Visitor = require('../models/Visitor');

/**
 * Middleware to track anonymous visitors.
 * Generates a unique visitor ID and stores it in a cookie.
 * Updates visitor record in MongoDB.
 */
async function trackingMiddleware(req, res, next) {
  try {
    // Get or create visitor ID from cookie
    let visitorId = req.cookies?.visitorId;

    if (!visitorId) {
      visitorId = uuidv4();
      // Set cookie that expires in 1 year
      res.cookie('visitorId', visitorId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax'
      });
    }

    req.visitorId = visitorId;

    // Update visitor record in MongoDB (fire and forget)
    Visitor.findOneAndUpdate(
      { visitorId },
      {
        $setOnInsert: { visitorId, firstVisit: new Date() },
        $set: { lastVisit: new Date() },
        $inc: { totalRequests: 1 }
      },
      { upsert: true, returnDocument: 'after' }
    ).catch(err => {
      console.error('Visitor tracking error:', err.message);
    });

    next();
  } catch (error) {
    // Don't block the request on tracking errors
    req.visitorId = req.cookies?.visitorId || 'unknown';
    next();
  }
}

module.exports = trackingMiddleware;
