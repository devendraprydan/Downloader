# Media-Grab — Test Plan Summary Table

Project: Media-Grab (formerly Freebuff)
Doc: Test Case Summary
Full doc: [docs/TestPlan.md](docs/TestPlan.md)

## 1. User (Visitor) Side — 23 test cases

| # | Test Case | Type | Test Data | Expected Result |
|---|---|---|---|---|
| 1 | Page Load & Visitor Cookie | Positive | Fresh browser, any supported route (/, /facebook, /instagram, /x) | Downloader page opens, no login; visitorId cookie set (httpOnly, 365-day); Visitor record created/upserted in MongoDB |
| 2 | Returning Visitor | Positive | Existing visitorId cookie | Same visitorId reused; lastVisit updated; totalRequests +1 |
| 3 | Fetch Video Info — YouTube | Positive | youtube.com/watch?v=... (public) | Loading spinner; video info card with title/thumbnail/duration/YouTube badge; quality dropdown populated; record created status=pending |
| 4 | Fetch Video Info — Facebook | Positive | facebook.com/watch or /reel/ URL | Platform detected as Facebook; Facebook badge; formats shown |
| 5 | Fetch Video Info — Instagram | Positive | instagram.com/reel/ or /p/ URL | Platform detected as Instagram; Instagram badge; formats shown |
| 6 | Fetch Video Info — X (Twitter) | Positive | x.com/ or twitter.com/ or t.co URL | Platform detected as X; X badge; formats shown |
| 7 | Quality Selection & Download — Success | Positive | Valid YouTube URL, quality=720p | Download button shows "Downloading..."; browser downloads .mp4 via blob+hidden anchor; "Download started!" message; record status=success |
| 8 | Download Without Fetching Video Info | Negative | Valid URL, videoInfo=null, click Download Now | handleDownload returns early; no download started |
| 9 | Empty URL Field | Negative (blank) | URL field empty, click Fetch | Error: "Please paste a video URL first." |
| 10 | Invalid URL Format | Negative | "not-a-valid-url" or "abc" | Error: "Please provide a valid URL." (backend 400 from isValidUrl) |
| 11 | Unsupported Platform | Negative | vimeo.com, tiktok.com, example.com/video | Frontend shows unsupported URL error; no API call made |
| 12 | Video Unavailable / Removed | Negative | Deleted YouTube video URL | Error: "This video is unavailable or has been removed." |
| 13 | Private Video | Negative | Private YouTube video URL | Error: "This video is private and cannot be accessed." |
| 14 | Members-Only Video | Negative | Members-only YouTube video URL | Error: "This is a members-only video. Only channel members can access this content." |
| 15 | Geo-Blocked Video | Negative | Geo-restricted YouTube URL | Error: "This video is not available in your region." |
| 16 | Cookies Required (YouTube) | Negative | YouTube URL needing cookies/age verification | Error: "YouTube requires browser cookies. Please open YouTube in your browser first, then try again." |
| 17 | Video Info Timed Out | Negative | Slow/unresponsive video URL | Error: "Request timed out. The video may be unavailable or the URL is invalid."; spinner stops |
| 18 | Download Timed Out | Negative | Large video URL, long download | Error: "Download timed out. The file may be too large or the connection is slow."; record status=failed |
| 19 | yt-dlp Not Found | Negative | Any URL, yt-dlp missing from all paths | Error: "Video download service is not configured. Please contact the administrator."; record status=failed (download endpoint) |
| 20 | FFmpeg Merge Error | Negative | Video/format causing FFmpeg failure | Error: "Error processing the video. Please try a different quality."; record status=failed |
| 21 | Already Downloaded | Negative | Same YouTube URL, second request quickly | Error: "This video was already downloaded recently. Please try again later."; record status=failed |
| 22 | Platform Pills Clear Input | Positive (UI) | YouTube URL in input, click Facebook pill | URL input cleared; videoInfo cleared; error/success cleared; detectedPlatform reset |
| 23 | Enter Key Triggers Fetch | Positive (UI) | Valid YouTube URL, press Enter | fetchVideoInfo() runs; same as clicking Fetch button |

## 2. Admin Side — 19 test cases

| # | Test Case | Type | Test Data | Expected Result |
|---|---|---|---|---|
| 1 | Admin Login — Valid | Positive | Valid admin email + valid bcrypt password | POST /api/admin/login returns 200 + {token, email}; token saved to localStorage as adminToken; redirect to /admin/dashboard; dashboard loads with stats |
| 2 | Admin Login — Invalid Email | Negative | Unknown email + any password | 401; error "Invalid credentials."; no token; stay on /admin/login |
| 3 | Admin Login — Invalid Password | Negative | Existing admin email + wrong password | 401; error "Invalid credentials."; no token; stay on /admin/login |
| 4 | Admin Login — Blank Fields | Negative (blank) | Empty email + empty password | 400; error "Email and password are required."; no token |
| 5 | Admin Login — Empty Email Only | Negative (blank) | Empty email + any password | 400; error "Email and password are required." |
| 6 | Admin Login — Empty Password Only | Negative (blank) | Any email + empty password | 400; error "Email and password are required." |
| 7 | Dashboard Stats Cards | Positive | Valid admin token, GET /api/admin/dashboard/stats | Six cards show: Unique Visitors, Total Downloads, Successful, Failed, Downloads Today, Downloads This Week; all numbers from MongoDB counts |
| 8 | Platform Statistics | Positive | Valid token, download records exist | Platform bars show YouTube/Facebook/Instagram/X with count and percentage; counts from downloadrecords.platform |
| 9 | Recent Activity Table | Positive | Valid token, GET /api/admin/activity/recent?limit=15 | Table columns: Platform, Video Title, Quality, Status, Time; rows sorted createdAt desc; status+platform badges; empty state "No activity yet" |
| 10 | Auto-Refresh 30 Seconds | Positive | Valid token, dashboard open | fetchData() runs again after 30000 ms; stats+activity update; no page reload |
| 11 | Admin Logout | Positive | Valid token, click Logout | localStorage.adminToken removed; React state set null; redirect to /admin/login; Back button blocked by route guard |
| 12 | Token Expired / Invalid | Negative | Expired/tampered JWT, reload dashboard | API returns 401; AdminDashboard catches 401, calls onLogout(); redirect to /admin/login; token removed |
| 13 | Dashboard Without Token | Negative | No adminToken, navigate to /admin/dashboard | React Router guard redirects to /admin/login; no dashboard rendered |
| 14 | Login When Already Logged In | Positive (guard) | Valid token, visit /admin/login | Route guard redirects to /admin/dashboard; AdminLogin not shown |
| 15 | Verify Token — Valid | Positive | Valid JWT in Authorization header, GET /api/admin/verify | 200: {valid: true, email: ...} |
| 16 | Verify Token — No Token | Negative | No Authorization header, GET /api/admin/verify | 401: "Access denied. No token provided." |
| 17 | Verify Token — Invalid | Negative | Malformed/fake JWT, GET /api/admin/verify | 401: "Invalid or expired token." |
| 18 | Activity Limit Param | Positive | Valid token, limit=5 query param | At most 5 activity records returned; sorted createdAt desc |
| 19 | Dashboard Header Links | Positive | Admin on /admin/dashboard | "View Site" link goes to /; Logout button triggers handleLogout |

## 3. Cross-cutting / System — 15 test cases

| # | Test Case | Type | Test Data | Expected Result |
|---|---|---|---|---|
| 1 | Theme Toggle — Dark to Light | Positive | Click theme toggle on any page | ThemeContext toggles; isDark flips; localStorage updated; dark/light UI variants switch |
| 2 | Theme Persists on Reload | Positive | Set dark theme, reload page | ThemeContext reads localStorage on mount; dark theme reapplied |
| 3 | Visitor Cookie Persists Across Sessions | Positive | First visit creates cookie, reopen within 365 days | Same visitorId cookie sent back; Visitor record upserted again (lastVisit updated, totalRequests +1) |
| 4 | Download Record Created | Positive | Valid URL, video-info call succeeds | DownloadRecord created: visitorId, platform, url, videoTitle, quality, status=pending |
| 5 | Download Record Updated to Success | Positive | Successful download | DownloadRecord status=success; videoTitle stored |
| 6 | Download Record Updated to Failed | Negative | Failing download scenario | DownloadRecord status=failed; errorMessage stored where applicable |
| 7 | Temp File Cleanup 30 min | Positive | Download video, wait 30 min | Cleanup job deletes old .mp4 from downloads/; immediate safeDelete also runs after each send |
| 8 | File Deleted After Send | Positive | Successful download + send | res.download() completes, then safeDelete() removes temp file; no leftover file |
| 9 | Multiple Platform URLs Rejected | Negative | vimeo.com, tiktok.com, example.com/page | Each rejected with unsupported platform error (frontend detectPlatform null OR backend 400) |
| 10 | URL Missing Protocol | Edge | "youtube.com/watch?..." without https:// | new URL() may parse or fail; if parses, platform detected and fetch proceeds; if not, "Please provide a valid URL." |
| 11 | Health Endpoint | Positive | GET /api/health | 200 with server status |
| 12 | Auth Middleware — No Token | Negative | GET /api/admin/dashboard/stats without Authorization header | 401: "Access denied. No token provided." |
| 13 | Auth Middleware — Valid Token | Positive | GET /api/admin/dashboard/stats with valid Bearer token | 200 with stats JSON (totalVisitors, totalDownloads, etc.) |
| 14 | API 401 Redirects to Login | Negative | Expired/invalid token, dashboard API call | axios interceptor catches 401; frontend redirects to /admin/login; token cleared |
| 15 | Blob Download Mechanism | Positive | Successful video download from frontend | Frontend receives blob (responseType: "blob"); creates Blob + object URL; hidden <a> with download attr clicked; file saved as .mp4 |

## Preconditions

| Item | Detail |
|---|---|
| Backend | Node + Express + MongoDB connected, running |
| Frontend | React dev server or built, running |
| yt-dlp | Executable on server PATH or via YT_DLP_PATH env var |
| FFmpeg | On server PATH (used by yt-dlp for merge) |
| Admin | At least one admin in admins collection, bcrypt hash, salt factor 12 |
| MongoDB collections | admins, visitors, downloadrecords |

## Notes

- Visitor side is fully anonymous. No registration, login, user accounts, or user download history exist in Media-Grab.
- Admin login is the only authentication in the project.
- Admin JWT = 24h expiry, localStorage key `adminToken`, sent as Bearer token, validated by `adminAuth` middleware.
- Visitor ID = UUID v4, httpOnly cookie, 365-day expiry, upserted into visitors collection.
- Features deliberately excluded from test cases (do not exist in codebase): user registration, user login, user account management, user download history page, admin user-management, company side.
- "Actual Result" and "Pass/Fail" columns are filled at execution time; the full doc pre-fills Pass as placeholder.
