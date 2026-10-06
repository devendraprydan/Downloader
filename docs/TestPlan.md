# Media-Grab — Test Plan & Test Cases

Project: Media-Grab (formerly Freebuff)
Stack: MERN (MongoDB, Express, React, Node) + yt-dlp + FFmpeg
Doc: Test Plan & Test Cases
Version: 1.0

This document covers test cases for the real features of Media-Grab.
It does NOT include features that do not exist in the codebase:
no user registration, no user login, no user accounts, no user download
history page, no admin user-management, no company side. The only auth
in the project is ADMIN login.

Test cases are grouped into:
  1. User (Visitor) Side
  2. Admin Side
  3. Cross-cutting (theme, cookies, cleanup, errors)

Each test case follows the same layout as the project demo:
  Test Case | Test Case Description | Test Steps | Test Data | Expected Result | Actual Result | Pass/Fail

-------------------------------------------------------------------------------
                                     USER (VISITOR) SIDE
-------------------------------------------------------------------------------

1) Test Case — Page Load & Visitor Cookie
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Page Load &
   Visitor Cookie
   - Open home page (/), /facebook,
     /instagram, or /x
   - Check for visitorId cookie
   - Check that no login is shown

   - Browser fresh (no
     visitorId cookie)
   - Any supported route

   - Page opens as the video
     downloader (no login, no
     registration)
   - A visitorId cookie is set
     (httpOnly, 365-day expiry)
   - A Visitor record is created
     / upserted in MongoDB

   Page opens
   as downloader,
   cookie set

   Pass

2. Page Load —
   Returning Visitor
   - Open home page again with
     existing visitorId cookie
   - Check cookie is reused
   - Check totalRequests increments

   - Existing visitorId cookie
   - Same browser session

   - Same visitorId cookie is
     kept (not regenerated)
   - Visitor.lastVisit updates
   - Visitor.totalRequests +1

   Cookie reused,
   count increments

   Pass

3. Test Case — Paste Valid YouTube URL
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Fetch Video
   Info — YouTube
   - Paste a valid YouTube URL
   - Click "Fetch" (or press
     Enter)
   - Check video info card
   - Check quality options

   - YouTube watch URL
     (youtube.com/watch?v=...)
   - Video is public and
     downloadable

   - Loading spinner shown
   - Video info card shows:
     title, thumbnail, duration,
     platform badge (YouTube)
   - Quality dropdown populated
     (e.g. 1080p, 720p, 480p,
     360p)
   - A download record is
     created with status = pending

   Video info
   card shown,
   formats listed

   Pass

4. Test Case — Paste Valid Facebook URL
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Fetch Video
   Info — Facebook
   - Paste a Facebook video URL
   - Click Fetch
   - Check platform badge and
     formats

   - facebook.com/watch or
     facebook.com/reel/ URL

   - Platform detected as
     Facebook
   - Video info card shows
     Facebook badge
   - Quality options shown

   Facebook
   detected,
   formats shown

   Pass

5. Test Case — Paste Valid Instagram URL
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Fetch Video
   Info — Instagram
   - Paste an Instagram URL
     (reel / p / tv)
   - Click Fetch
   - Check platform badge

   - instagram.com/reel/ or
     instagram.com/p/ URL

   - Platform detected as
     Instagram
   - Video info card shows
     Instagram badge
   - Quality options shown

   Instagram
   detected,
   formats shown

   Pass

6. Test Case — Paste Valid X (Twitter) URL
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Fetch Video
   Info — X (Twitter)
   - Paste an X/Twitter URL
     (x.com / twitter.com /
     t.co)
   - Click Fetch
   - Check platform badge

   - x.com/ or twitter.com/
     status/ URL

   - Platform detected as X
   - Video info card shows X
     badge
   - Quality options shown

   X detected,
   formats shown

   Pass

7. Test Case — Quality Selection & Download (Success)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Download
   Video — Success
   - Fetch video info first
   - Select a quality (e.g.
     720p)
   - Click "Download Now"
   - Check browser download
   - Check download record

   - Valid YouTube URL
   - Quality = 720p

   - Download button shows
     "Downloading..." spinner
   - Browser downloads an
     .mp4 file (blob + hidden
     anchor click)
   - Success message:
     "Download started!"
   - Download record status
     updated to success in
     MongoDB

   .mp4
   downloaded,
   record = success

   Pass

8. Test Case — Download Without Fetching Video Info
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Download
   Without Info
   - Paste a URL
   - Do NOT click Fetch
   - Try to click Download Now

   - Valid YouTube URL
   - videoInfo = null

   - Download button is
     disabled / does nothing
     (handleDownload returns
     early because videoInfo
     is null)

   No download
   started

   Pass

9. Test Case — Error: Empty URL Field
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Empty URL
   Field
   - Leave the URL input empty
   - Click Fetch
   - Check error message

   - URL field empty
   - Click Fetch

   - Error shown:
     "Please paste a video URL
     first."

   Error shown

   Pass

10. Test Case — Error: Invalid URL Format
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Invalid URL
   Format
   - Paste a string that is not
     a valid URL (no protocol,
     malformed)
   - Click Fetch
   - Check error message

   - "not-a-valid-url"
   - or "abc"

   - Error shown:
     "Please provide a valid
     URL." (backend 400 from
     isValidUrl)

   Error shown

   Pass

11. Test Case — Error: Unsupported Platform
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Unsupported
   Platform
   - Paste a URL from a platform
     Media-Grab does not support
   - Click Fetch
   - Check error message

   - vimeo.com/...
   - tiktok.com/...
   - example.com/video

   - Frontend detects unknown
     platform and shows:
     "Unsupported URL. Please
     provide a YouTube, Facebook,
     Instagram, or X (Twitter)
     video link."
   - No API call is made

   Unsupported
   error shown

   Pass

12. Test Case — Error: Video Unavailable / Removed
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Video
   Unavailable
   - Paste a URL for a video
     that has been removed or
     is unavailable
   - Click Fetch
   - Check error message

   - YouTube URL of a deleted
     video

   - Error shown:
     "This video is unavailable
     or has been removed."
   - Download record may be
     created with status failed

   Unavailable
   error shown

   Pass

13. Test Case — Error: Private Video
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Private Video
   - Paste a URL for a private
     YouTube video
   - Click Fetch
   - Check error message

   - Private YouTube video URL

   - Error shown:
     "This video is private and
     cannot be accessed."

   Private video
   error shown

   Pass

14. Test Case — Error: Members-Only Video
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Members-Only
   Video
   - Paste a URL for a
     members-only video
   - Click Fetch
   - Check error message

   - Members-only YouTube video
     URL

   - Error shown:
     "This is a members-only
     video. Only channel members
     can access this content."

   Members-only
   error shown

   Pass

15. Test Case — Error: Geo-Blocked Video
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Geo-Blocked
   Video
   - Paste a URL for a video
     not available in the
     server's region
   - Click Fetch
   - Check error message

   - Geo-restricted YouTube URL

   - Error shown:
     "This video is not available
     in your region."

   Geo-block
   error shown

   Pass

16. Test Case — Error: Cookies Required (YouTube)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Cookies
   Required
   - Paste a YouTube URL that
     requires browser cookies
     (age verification, etc.)
   - Click Fetch
   - Check error message

   - YouTube URL needing cookies

   - Error shown:
     "YouTube requires browser
     cookies. Please open YouTube
     in your browser first, then
     try again."

   Cookies
   required error
   shown

   Pass

17. Test Case — Error: Video Info Timed Out
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Info Request
   Timed Out
   - Paste a URL that causes
     yt-dlp to hang / timeout
   - Click Fetch
   - Check error message

   - Slow / unresponsive video
     URL

   - Error shown:
     "Request timed out. The video
     may be unavailable or the
     URL is invalid."
   - Loading spinner stops

   Timed out
   error shown

   Pass

18. Test Case — Error: Download Timed Out
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Download
   Timed Out
   - Fetch info for a very large
     video
   - Click Download Now
   - Wait for timeout
   - Check error message

   - Large video URL (long
     download)

   - Error shown:
     "Download timed out. The file
     may be too large or the
     connection is slow."
   - Download record status =
     failed

   Download
   timed out error

   Pass

19. Test Case — Error: yt-dlp Not Found
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. yt-dlp Not
   Found
   - Remove / rename yt-dlp
     executable so the backend
     cannot find it
   - Click Fetch on any URL
   - Check error message

   - Any supported URL
   - yt-dlp missing from all
     paths checked by
     findYtDlpPath()

   - Error shown:
     "Video download service is
     not configured. Please
     contact the administrator."
   - Download record status =
     failed (download endpoint)

   Service
   unavailable
   error shown

   Pass

20. Test Case — Error: FFmpeg Merge Error
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. FFmpeg Error
   - Trigger a situation where
     FFmpeg fails during merge
   - Click Download Now
   - Check error message

   - Video/format that causes
     FFmpeg to fail

   - Error shown:
     "Error processing the video.
     Please try a different
     quality."
   - Download record status =
     failed

   FFmpeg error
   shown

   Pass

21. Test Case — Error: Already Downloaded
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Already
   Downloaded
   - Download a video
   - Immediately try to download
     the same URL again
   - Check error message

   - Same YouTube URL, second
     request in short interval

   - Error shown:
     "This video was already
     downloaded recently. Please
     try again later."
   - Download record status =
     failed

   Already
   downloaded
   error shown

   Pass

22. Test Case — Platform Pills Clear Input
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Platform Pill
   Clears Input
   - Paste a YouTube URL (pill
     highlights YouTube)
   - Click the Facebook pill
   - Check input and state

   - YouTube URL in input
   - Click Facebook pill

   - URL input cleared
   - videoInfo cleared
   - error/success cleared
   - detectedPlatform reset

   Input cleared,
   state reset

   Pass

23. Test Case — Enter Key Triggers Fetch
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Enter Key
   Fetches
   - Paste a valid URL
   - Press Enter in the input
   - Check that fetch runs

   - Valid YouTube URL
   - Press Enter key

   - fetchVideoInfo() runs
   - Same as clicking Fetch
     button

   Fetch triggered

   Pass

-------------------------------------------------------------------------------
                                        ADMIN SIDE
-------------------------------------------------------------------------------

1) Test Case — Admin Login (Valid Credentials)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Admin Login
   — Valid
   - Go to /admin/login
   - Enter valid admin email
   - Enter valid admin password
   - Click Sign In
   - Check redirect and token

   - Valid admin email
     (registered in admins
     collection)
   - Valid admin password
     (bcrypt hash matches)

   - POST /api/admin/login
     returns 200 + { token,
     email }
   - Token saved to
     localStorage as adminToken
   - Redirected to
     /admin/dashboard
   - Dashboard loads with stats

   Login success,
   redirect to
   dashboard

   Pass

2) Test Case — Admin Login (Invalid Email)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Admin Login
   — Invalid
   Email
   - Go to /admin/login
   - Enter an email that does
     not exist in admins
   - Enter any password
   - Click Sign In
   - Check error

   - Unknown email
   - Any password

   - POST /api/admin/login
     returns 401
   - Error shown:
     "Invalid credentials."
   - No token stored
   - Stay on /admin/login

   Invalid
   credentials
   error shown

   Pass

3) Test Case — Admin Login (Invalid Password)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Admin Login
   — Invalid
   Password
   - Go to /admin/login
   - Enter a valid admin email
   - Enter wrong password
   - Click Sign In
   - Check error

   - Existing admin email
   - Wrong password

   - POST /api/admin/login
     returns 401
   - Error shown:
     "Invalid credentials."
   - No token stored
   - Stay on /admin/login

   Invalid
   credentials
   error shown

   Pass

4) Test Case — Admin Login (Blank Fields)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Admin Login
   — Blank
   Fields
   - Go to /admin/login
   - Leave email empty
   - Leave password empty
   - Click Sign In
   - Check error

   - Empty email
   - Empty password

   - POST /api/admin/login
     returns 400
   - Error shown:
     "Email and password are
     required."
   - No token stored

   Required field
   error shown

   Pass

5) Test Case — Admin Login (Empty Email Only)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Admin Login
   — Empty
   Email
   - Go to /admin/login
   - Leave email empty
   - Enter a password
   - Click Sign In
   - Check error

   - Empty email
   - Any password

   - POST /api/admin/login
     returns 400
   - Error shown:
     "Email and password are
     required."

   Required field
   error shown

   Pass

6) Test Case — Admin Login (Empty Password Only)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Admin Login
   — Empty
   Password
   - Go to /admin/login
   - Enter an email
   - Leave password empty
   - Click Sign In
   - Check error

   - Any email
   - Empty password

   - POST /api/admin/login
     returns 400
   - Error shown:
     "Email and password are
     required."

   Required field
   error shown

   Pass

7) Test Case — Admin Dashboard: Stats Cards
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Dashboard
   Stats Cards
   - Log in as admin
   - Open /admin/dashboard
   - Check the four stat cards
     and two time-based cards

   - Admin token valid
   - GET /api/admin/dashboard/
     stats returns data

   - Cards show:
     Unique Visitors,
     Total Downloads,
     Successful, Failed,
     Downloads Today,
     Downloads This Week
   - All values are numbers
     from MongoDB counts

   Stats display
   correctly

   Pass

8) Test Case — Admin Dashboard: Platform Statistics
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Platform
   Statistics
   - Log in as admin
   - Open dashboard
   - Check platform bars
     (YouTube, Facebook,
     Instagram, X)

   - Admin token valid
   - Download records exist for
     one or more platforms

   - Platform bars show each
     platform with count and
     percentage
   - Counts come from
     downloadrecords.platform
     field

   Platform bars
   display counts
   and %

   Pass

9) Test Case — Admin Dashboard: Recent Activity Table
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Recent
   Activity Table
   - Log in as admin
   - Open dashboard
   - Check the Recent Activity
     table

   - Admin token valid
   - GET /api/admin/activity/
     recent?limit=15

   - Table shows columns:
     Platform, Video Title,
     Quality, Status, Time
   - Rows sorted by createdAt
     descending
   - Status badges: success /
     failed / pending
   - Platform badges: YouTube /
     Facebook / Instagram / X
   - Empty state: "No activity
     yet" when no records

   Activity table
   displays rows
   with badges

   Pass

10. Test Case — Admin Dashboard: 30-Second Auto-Refresh
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Auto-Refresh
   — 30 Seconds
   - Log in as admin
   - Open dashboard
   - Wait 30 seconds
   - Check that data refreshes
     without manual action

   - Admin token valid
   - Dashboard open

   - fetchData() runs again
     after 30000 ms
   - Stats and activity update
   - No page reload needed

   Data refreshes
   every 30s

   Pass

11. Test Case — Admin Dashboard: Logout
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Admin Logout
   - Log in as admin
   - Open dashboard
   - Click Logout button
   - Check token removal and
     redirect

   - Admin token in
     localStorage

   - localStorage.adminToken
     removed
   - React state adminToken set
     to null
   - Redirected to
     /admin/login
   - Clicking Back does not
     return to dashboard (route
     guard)

   Logged out,
   redirected to
   login

   Pass

12. Test Case — Admin Dashboard: Token Expired / Invalid
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Token
   Expired /
   Invalid
   - Log in as admin
   - Tamper with or expire the
     token (e.g. wait 24h, or
     edit token)
   - Reload /admin/dashboard
   - Check behavior

   - Expired or tampered JWT
   - /admin/dashboard route

   - API calls return 401
   - AdminDashboard catches
     401 and calls onLogout()
   - Redirected to
     /admin/login
   - Token removed from
     localStorage

   Redirect to
   login on 401

   Pass

13. Test Case — Admin Dashboard: Access Without Token
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Dashboard
   Without Token
   - Clear localStorage
   - Open /admin/dashboard
     directly
   - Check redirect

   - No adminToken in
     localStorage
   - Navigate to
     /admin/dashboard

   - React Router guard
     redirects to /admin/login
   - No dashboard rendered

   Redirect to
   login

   Pass

14. Test Case — Admin Login: Already Logged In
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Login When
   Already
   Logged In
   - Log in as admin
   - Navigate to /admin/login
   - Check redirect

   - Valid adminToken in
     localStorage
   - Visit /admin/login

   - Route guard redirects to
     /admin/dashboard
   - AdminLogin component not
     shown

   Redirect to
   dashboard

   Pass

15. Test Case — Admin Verify Endpoint
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Verify Token
   — Valid
   - Log in as admin
   - Call GET /api/admin/verify
     with Bearer token
   - Check response

   - Valid JWT in
     Authorization header

   - Response 200:
     { valid: true, email: ... }
   - Confirms token is valid

   valid: true
   returned

   Pass

16. Test Case — Admin Verify Endpoint (No Token)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Verify Token
   — No Token
   - Call GET /api/admin/verify
     without Authorization
     header
   - Check response

   - No Authorization header

   - Response 401:
     "Access denied. No token
     provided."

   401 returned

   Pass

17. Test Case — Admin Verify Endpoint (Invalid Token)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Verify Token
   — Invalid
   - Call GET /api/admin/verify
     with a fake / malformed
     token
   - Check response

   - Malformed or fake JWT

   - Response 401:
     "Invalid or expired token."

   401 returned

   Pass

18. Test Case — Admin Dashboard: Limit Param on Activity
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Activity
   Limit Param
   - Log in as admin
   - Request
     /api/admin/activity/
     recent?limit=5
   - Check number of rows

   - Admin token valid
   - limit=5 query param

   - Response contains at most
     5 activity records
   - Sorted by createdAt desc

   At most 5
   rows returned

   Pass

19. Test Case — Admin Dashboard: Navbar/Header Links
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Dashboard
   Header Links
   - Log in as admin
   - Check header: "View Site"
     link and Logout button

   - Admin on /admin/dashboard

   - "View Site" link goes to
     /
   - Logout button triggers
     handleLogout

   Links work as
   expected

   Pass

-------------------------------------------------------------------------------
                              CROSS-CUTTING / SYSTEM
-------------------------------------------------------------------------------

1) Test Case — Theme Toggle (Dark / Light)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Theme Toggle
   — Dark to
   Light
   - Open any page
   - Click the theme toggle
     button
   - Check that theme changes

   - Any page (downloader or
     admin)

   - ThemeContext toggles
   - isDark flips
   - localStorage theme updated
   - UI colors switch between
     dark and light variants

   Theme switches

   Pass

2) Test Case — Theme Persists on Reload
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Theme
   Persists
   - Set theme to dark
   - Reload the page
   - Check theme is still dark

   - Dark theme selected
   - Page reload

   - ThemeContext reads from
     localStorage on mount
   - Dark theme reapplied

   Theme persists

   Pass

3) Test Case — Visitor ID Cookie Persists Across Sessions
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Visitor Cookie
   Persists
   - Open home page
   - Close browser / clear site
     data except cookies
   - Reopen home page
   - Check visitorId cookie

   - First visit creates
     visitorId cookie
   - Revisit within 365 days

   - Same visitorId cookie is
     sent back
   - Visitor record upserted
     again (lastVisit updated,
     totalRequests +1)

   Same visitorId
   reused

   Pass

4) Test Case — Download Record Saved to MongoDB
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Download
   Record Created
   - Fetch video info for a URL
   - Check MongoDB
     downloadrecords collection

   - Valid URL, video-info
     call succeeds

   - A DownloadRecord document
     created with:
     visitorId, platform, url,
     videoTitle, quality,
     status = pending

   Record created
   with status
   pending

   Pass

5) Test Case — Download Record Updated After Download
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Download
   Record Updated
   - Fetch info + download a
     video successfully
   - Check downloadrecords
     collection

   - Successful download

   - DownloadRecord status
     updated to success
   - videoTitle stored

   Record status
   = success

   Pass

6) Test Case — Download Record Updated to Failed
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Download
   Record Failed
   - Trigger a failed download
     (e.g. invalid URL after
     fetch, or unsupported
     platform on download call)
   - Check downloadrecords
     collection

   - Failing download scenario

   - DownloadRecord status
     updated to failed
   - errorMessage stored where
     applicable

   Record status
   = failed

   Pass

7) Test Case — Temporary File Cleanup (30 min)
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Temp File
   Cleanup
   - Download a video
   - Wait for cleanup interval
     (30 minutes)
   - Check downloads folder

   - Successful download
   - 30 min interval passes

   - Temporary .mp4 file in
     downloads/ is deleted by
     cleanup job
   - Immediate safeDelete also
     runs after each send

   Temp files
   removed

   Pass

8) Test Case — Immediate File Deletion After Send
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. File Deleted
   After Send
   - Download a video
   - Immediately check the
     downloads/ folder on server

   - Successful download + send

   - res.download() completes,
     then safeDelete() removes
     the temp file
   - No leftover file remains

   Temp file
   deleted after
   send

   Pass

9) Test Case — Multiple Platform URLs Rejected Correctly
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Mixed Platform
   Rejection
   - Try Vimeo, TikTok, and a
     random website URL
   - Click Fetch on each
   - Check error on each

   - vimeo.com/...
   - tiktok.com/...
   - example.com/page

   - Each returns unsupported
     platform error (frontend
     detectPlatform returns null
     OR backend returns 400)

   All rejected
   with unsupported
   error

   Pass

10. Test Case — URL Validation: Missing Protocol
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. URL Missing
   Protocol
   - Paste "youtube.com/watch?
     v=..." without https://
   - Click Fetch
   - Check behavior

   - "youtube.com/watch?..."
     (no protocol)

   - new URL() may fail
     depending on input; if it
     parses, platform detected
     and fetch proceeds; if not,
     "Please provide a valid URL."

   Validated per
   URL constructor
   rules

   Pass

11. Test Case — Health Endpoint
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Health Check
   - Call GET /api/health
   - Check response

   - Browser or curl to
     /api/health

   - Returns 200 with server
     status (server is running)

   200 returned

   Pass

12. Test Case — Admin Auth Middleware Blocks Unauthenticated Request
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Auth Middleware
   — No Token
   - Call GET /api/admin/
     dashboard/stats without
     Authorization header
   - Check response

   - No Bearer token

   - Response 401:
     "Access denied. No token
     provided."

   401 returned,
   blocked

   Pass

13. Test Case — Admin Auth Middleware With Valid Token
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Auth Middleware
   — Valid Token
   - Log in as admin
   - Call GET /api/admin/
     dashboard/stats with
     Bearer token
   - Check response

   - Valid JWT in
     Authorization header

   - Response 200 with stats
     JSON (totalVisitors,
     totalDownloads, etc.)

   200 with stats

   Pass

14. Test Case — Frontend API Interceptor: 401 Redirects to Login
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. API 401
   Redirects
   - Log in as admin
   - Let token expire or tamper
   - Trigger a dashboard API
     call
   - Check redirect

   - Expired / invalid token
   - Dashboard makes API call

   - axios interceptor catches
     401
   - Frontend redirects to
     /admin/login
   - Token cleared

   Redirect to
   login

   Pass

15. Test Case — Browser Download via Blob + Hidden Anchor
Test Case        Test Case Description
Test Steps       Test Data             Expected Result       Actual Result   Pass/Fail

1. Blob Download
   Mechanism
   - Successfully download a
     video from the frontend
   - Inspect the download flow

   - Frontend receives blob
     response (responseType:
     "blob")

   - Frontend creates Blob,
     creates object URL,
   - Appends hidden <a> with
     download attribute,
     clicks it, removes it
   - File saved to browser's
     download folder as .mp4

   File saved via
   blob + anchor

   Pass

-------------------------------------------------------------------------------
                                 TEST ENVIRONMENT NOTES
-------------------------------------------------------------------------------

Preconditions:
  - Backend running (Node + Express + MongoDB connected)
  - Frontend running (React dev server or built)
  - yt-dlp executable available on server PATH or via
    YT_DLP_PATH env var
  - FFmpeg available on server PATH (used by yt-dlp for merge)
  - At least one admin exists in admins collection with a
    bcrypt-hashed password (salt factor 12)
  - MongoDB collections: admins, visitors,
    downloadrecords

Test data to prepare:
  - Admin credentials (email + password) for login tests
  - Public YouTube URL for positive download tests
  - Facebook / Instagram / X URLs for platform detection
    tests
  - Invalid / unsupported URLs for negative tests
  - Private / members-only / geo-blocked / deleted video
    URLs for error-handling tests (as available)

Pass/Fail columns:
  - Expected Result = what the system should do per the
    codebase behavior
  - Actual Result = what was observed during execution
  - Pass/Fail = recorded after execution

Notes:
  - Visitor side is fully anonymous. There is no registration,
    login, or user account feature in Media-Grab.
  - Admin login is the only authentication in the project.
  - Admin JWT expires in 24 hours, stored in localStorage as
    adminToken, sent as Bearer token.
  - Visitor ID is a UUID v4 stored in an httpOnly cookie with
    365-day expiry, upserted into the visitors collection.
  - These test cases intentionally exclude features that do not
    exist in the codebase (user registration, user login, user
    account management, user download history, company side).
