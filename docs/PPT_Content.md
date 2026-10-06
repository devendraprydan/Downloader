# Media-Grab – Multi-Platform Video Download Management System
## Corrected PPT Content (based on actual implementation)

> **How to use:** Each section = one PPT slide. All content and diagrams are plain text — paste each
> code block straight into a PowerPoint text box. Font must be **monospace** (Consolas or Courier New)
> and line spacing must be **Exactly 1.0** so the `|` columns stay aligned.
>
> **Project:** Media-Grab — MERN Stack (React + Node.js/Express + MongoDB) with yt-dlp + FFmpeg
> for multi-platform video downloading.

---

## 1. MODULE DESCRIPTION

### a. Admin Module
Provides secure administrative control for monitoring visitors, download records, and platform analytics
through a JWT-protected dashboard.

**Key Features:**
- Admin Login with JWT-based Secure Authentication (24-hour session)
- Dashboard with Live Statistics (auto-refreshes every 30 seconds)
- View Total Visitors & Total Request Counts
- View Download Records (Recent Activity with status)
- View Analytics Reports (daily / weekly downloads, success vs. failure)
- Platform-wise Analytics (YouTube, Facebook, Instagram, X)

### b. User (Guest / Visitor) Module
Allows any visitor to download videos from multiple platforms **without registration or login**.
Each visitor is anonymously identified using a secure cookie-based ID for record keeping.

**Key Features:**
- No Registration / Login Required — Completely Anonymous Access
- Automatic Visitor Tracking (cookie-based unique ID, 1-year expiry)
- Enter and Validate Video URL
- Automatic Platform Detection (YouTube / Facebook / Instagram / X)
- Fetch Video Details (title, thumbnail, duration, available qualities)
- Select Quality (1080p / 720p / 480p / 360p) and Download Video as MP4

> Note: Media-Grab deliberately has **no user accounts** for visitors — this is a privacy selling point.
> Download records are stored **for admin analytics only**, not shown to the user. The only login in the
> system is the **Admin** login. The definition text's references to user registration, user login, and
> user download history do not match this implementation.

---

## 2. SYSTEM FLOW DIAGRAMS

### 2.1 USER FLOWCHART

| # | Step | Description |
|---|------|-------------|
| 1 | Start | Application launch |
| 2 | Open Media-Grab Website | Visitor ID assigned via cookie automatically |
| 3 | Enter Video URL | Paste supported video URL |
| 4 | Valid & Supported URL? | Decision: YouTube / Facebook / Instagram / X |
| 5 | View Error Message | Shown when URL is invalid or unsupported |
| 6 | Detect Platform | Auto-detect source platform from URL |
| 7 | Fetch Video Details | Title, thumbnail, duration via yt-dlp |
| 8 | Select Quality | 1080p / 720p / 480p / 360p |
| 9 | Download Video as MP4 | Convert & deliver via FFmpeg |
| 10 | Save Download Record | To MongoDB (visitor ID, platform, status) |
| 11 | End | Download complete |

**Corrected User Flowchart (plain-text — paste into slide text box):**

```
  +-------+
  | Start |
  +-------+
       |
       v
  +-----------------------------------------------+
  | Open Media-Grab Website                       |
  | (Visitor ID assigned via cookie)              |
  +-----------------------------------------------+
       |
       v
  +---------------+
  | Enter Video URL |
  +---------------+
       |
       v
       +---------------------------+
       | Valid & Supported URL?   |
       +-----------+-------------+
           No     |     Yes
             +---|     |
             |   |     v
             |   +--------------------------+
             |   | Detect Platform          |
             |   | YouTube / FB / Insta / X |
             |   +--------------------------+
             |           |
             |           v
             |   +-----------------------------------+
             |   | Fetch Video Details via yt-dlp    |
             |   | Title, Thumbnail, Duration        |
             |   +-----------------------------------+
             |           |
             |           v
             |   +--------------------------+
             |   | Select Quality           |
             |   | 1080p / 720p / 480p/360p |
             |   +--------------------------+
             |           |
             |           v
             |   +---------------------+
             |   | Download Video as MP4 |
             |   +---------------------+
             |           |
             |           v
             |   +-------------------------------------------+
             |   | Save Download Record to MongoDB           |
             |   | (visitor ID, platform, status: pending)   |
             |   +-------------------------------------------+
             |           |
             |           v
             |   +-------+
             |   |  End  |
             |   +-------+
             |            ^
             +------------|
                         (loop back)

       +---------------+
       | View Error    |
       | Message       |
       +---------------+
             ^                    (appears when URL is invalid
             |                     or unsupported — shown at
             +---------------------> step 3, 5, 8)
```

---

### 2.2 ADMIN FLOWCHART

| # | Step | Description |
|---|------|-------------|
| 1 | Start | Admin access begins |
| 2 | Admin Login Page | Email + password entry |
| 3 | Credentials Verified? | Decision: JWT issued if valid |
| 4 | View Error Message | Shown on failed login |
| 5 | Admin Dashboard | JWT session — 24h validity |
| 6 | View Dashboard Statistics | Visitors, downloads, success/failed, today/week |
| 7 | Platform-wise Analytics | YouTube / Facebook / Instagram / X |
| 8 | View Recent Download Records | Auto-refresh every 30 sec |
| 9 | Logout | Token removed, redirect to login |
| 10 | End | Session terminated |

**Corrected Admin Flowchart (plain-text — paste into slide text box):**

```
  +-------+
  | Start |
  +-------+
       |
       v
  +-------------------------------+
  | Admin Login Page              |
  | (email + password)            |
  +-------------------------------+
       |
       v
       +---------------------------+
       | Credentials Verified?    |
       +-----------+-------------+
           No     |     Yes
             +---|     |
             |   |     v
             |   +-------------------------------------------+
             |   | Admin Dashboard                           |
             |   | JWT Session — 24h Validity                 |
             |   +-------------------------------------------+
             |           |
             |           v
             |   +-------------------------------------------+
             |   | View Dashboard Statistics                 |
             |   | Visitors, Downloads, Success/Failed       |
             |   | Today / This Week                         |
             |   +-------------------------------------------+
             |           |
             |           v
             |   +-------------------------------------------+
             |   | Platform-wise Analytics                   |
             |   | YouTube / Facebook / Instagram / X        |
             |   +-------------------------------------------+
             |           |
             |           v
             |   +-------------------------------------------+
             |   | View Recent Download Records              |
             |   | Auto-refresh every 30 sec                 |
             |   +-------------------------------------------+
             |           |
             |           v
             |   +-------------------------------+
             |   | Logout                         |
             |   +-------------------------------+
             |           |
             |           v
             |   +-------+
             |   |  End  |
             |   +-------+
             |            ^
             +------------|
                         (loop back)

       +---------------+
       | View Error    |
       | Message       |
       +---------------+
             ^                    (shown when login fails
             +---------------------> loops back to login)
```

---

## 3. PROJECT PROFILE

### A. About Media-Grab

Media-Grab is a MERN Stack (MongoDB, Express.js, React.js, Node.js) web application that enables
users to download videos from multiple supported social media platforms through a single,
user-friendly interface.

The system validates the video URL, retrieves video information, provides quality options, and manages
download records using a secure database. It also includes a secure admin dashboard for monitoring
system activities and platform usage.

Media-Grab is a simple, secure, and user-friendly web application designed to manage and download videos
from supported social media platforms using a single interface. Users can paste a supported video URL,
view video details such as title, thumbnail, duration, and available quality options, and download the
selected video. The application automatically identifies the platform from the provided URL and retrieves
the required video information before initiating the download process.

The system includes an Admin Dashboard, where administrators can monitor download activities, view
platform-wise statistics, and oversee overall system usage.

By integrating React.js, Node.js, Express.js, MongoDB, yt-dlp, and FFmpeg, the project demonstrates
modern full-stack web development, secure authentication, database management, RESTful APIs, and
multimedia processing.

Instead of relying on separate tools for different platforms, Media-Grab provides a centralized and
organized solution with a consistent user experience.

### B. Existing System
- Separate tools/websites required for different platforms.
- Platform-specific download solutions with different steps for each site.
- Basic downloading without any usage monitoring or records.
- No centralized dashboard for administration.
- No analytics — owners cannot know visitor counts or download trends.

### C. Problem Areas of the Existing System
- No unified platform — users must switch between multiple tools.
- No download records maintained for analysis.
- No admin monitoring or analytics dashboard.
- Inconsistent user experience across platforms.
- Many tools force account creation, risking user privacy.

### D. Proposed System (Media-Grab)
- **Single web platform** to download videos from YouTube, Facebook, Instagram & X.
- **No sign-up or login required** for visitors — anonymous, private usage.
- Automatic platform detection and **quality selection** (up to 1080p) with MP4 output via FFmpeg.
- **Secure JWT-based Admin Login** and centralized dashboard.
- **Download records & visitor analytics** — daily/weekly counts, success/failure rates, platform-wise breakdown.
- Automatic cleanup of temporary server files and a responsive dark/light themed UI.

> Note: Media-Grab's visitor module is intentionally anonymous. The "user account" and "download history for
> users" features sometimes listed in project descriptions are not part of this implementation — the only
> authentication is the Admin login, and download records are for admin analytics only.

---

## 4. UML DIAGRAMS

### a. Use Case Diagram — TWO SEPARATE SLIDES (plain-text, paste into slide text box)

> Font must be monospace (Consolas / Courier New), line spacing Exactly 1.0.

#### SLIDE: ADMIN USECASE

```
+================================================================+
|                          ADMIN USECASE                         |
+================================================================+

   O
  /|\   ---->  ( Login )
   |                  |--- <<include>> ---> Validate Credentials (bcrypt)
   |                  |--- <<include>> ---> Generate JWT Token (24h)
   |                  '--- <<Exclude>> ---> Invalid Credentials Error
   |
   |   ---->  ( View Dashboard Statistics )
   |                  |--- <<include>> ---> Total Visitors Count
   |                  |--- <<include>> ---> Downloads Today / This Week
   |                  '--- <<include>> ---> Success vs Failed Counts
   |
   |   ---->  ( View Platform-wise Analytics )
   |                  |--- <<include>> ---> YouTube Count
   |                  |--- <<include>> ---> Facebook Count
   |                  |--- <<include>> ---> Instagram Count
   |                  '--- <<include>> ---> X (Twitter) Count
   |
   |   ---->  ( View Recent Download Records )
   |                  |--- <<include>> ---> View Status (Pending/Success/Failed)
   |                  '--- <<include>> ---> Auto-refresh (30 sec)
   |
   '--- ---->  ( Logout )

  Admin
```

#### SLIDE: USER USECASE (Guest — no Sign up / Login)

```
+================================================================+
|                           USER USECASE                         |
+================================================================+

   O
  /|\   ---->  ( Visit Website )
   |                  '--- <<include>> ---> Assign Visitor ID (Cookie)
   |
   |   ---->  ( Enter Video URL )
   |                  |--- <<include>> ---> Validate URL
   |                  '--- <<Exclude>> ---> Unsupported URL Error
   |
   |   ---->  ( Detect Platform )
   |                  '--- <<include>> ---> YouTube / FB / Instagram / X
   |
   |   ---->  ( View Video Details )
   |                  '--- <<include>> ---> Show Title, Thumbnail, Duration
   |
   |   ---->  ( Select Quality )
   |                  '--- <<include>> ---> 1080p / 720p / 480p / 360p
   |
   |   ---->  ( Download Video )
   |                  |--- <<include>> ---> Save MP4 to Device
   |                  '--- <<Exclude>> ---> Download Failed Error

  User
```

---

### b. Class Diagram (plain-text — paste into slide text box)

```
+------------------------------------------------------------------+
|                           CLASS DIAGRAM                           |
+------------------------------------------------------------------+

  +-------------------+        +-------------------+
  |     Admin         |        |    Visitor        |
  +-------------------+        +-------------------+
  | - email: String   |        | - visitorId:Str   |
  | - password:Str(bc)|        | - firstVisit:Date |
  | - createdAt:Date  |        | - lastVisit:Date  |
  | + comparePassword |        | - totalRequests:N |
  | + generateJWT()   |        | - platforms:[]Str |
  +-------------------+        | + trackVisit()    |
          |                   +-------------------+
          |                            |
          | 1                        * |
          |------------------------->  |  makes
          |                            |
          |                            v
          |                   +-------------------+
          |                   |  DownloadRecord   |
          |                   +-------------------+
          |                   | - visitorId:Str   |
          |                   | - platform:Str    |
          |                   | - url:Str         |
          |                   | - videoTitle:Str  |
          |                   | - format:Str      |
          |                   | - quality:Str     |
          |                   | - status:Str      |
          |                   | - errorMessage:Str|
          |                   | - createdAt:Date  |
          |                   | + updateStatus()  |
          |                   +-------------------+
          |                            ^
          |                            |
          +-------------------------+  |
          | 1                      *   |
          |------------------------>   |  monitors
          |                            |
          |                            |
          v                            |
  +-------------------+               |
  |  AdminAuthService |               |
  +-------------------+               |
  | - JWT_SECRET      |               |
  | + verifyToken()   |               |
  | + adminAuth()     |               |
  +-------------------+               |
          |                           |
          |------------------------->  |  authenticates
          |                           |
          v                           |
  +-------------------+               |
  | DownloaderService |               |
  +-------------------+               |
  | + detectPlatform()|               |
  | + isValidUrl()    |               |
  | + getVideoInfo()  |               |
  | + downloadVideo() |               |
  | + cleanupOldFiles |               |
  +-------------------+               |
          |                           |
          |------------------------>  |  creates/updates
          |                           |
          |------------------------>  |  identified by cookie
```

---

### c. Sequence Diagram — Video Download (plain-text — paste straight into a slide text box)

> Font must be monospace (Consolas / Courier New), line spacing Exactly 1.0.

```
User           Frontend           Backend           MongoDB           yt-dlp
 |                 |                 |                 |                 |
 |-- Enter URL --->|                 |                 |                 |
 |-- Click Fetch ->|                 |                 |                 |
 |                 |-- Send URL ---->|                 |                 |
 |                 |                 |-- Get Details --|---------------->|
 |                 |                 |<- Video Info ---|---------------- |
 |                 |                 |                 |                 |
 |                 |                 |-- Save Record ->|                 |
 |                 |                 |                 | (pending)       |
 |                 |Details + Quality|                 |                 |
 |                 |<----------------|                 |                 |
 |  Show Details   |                 |                 |                 |
 |<----------------|                 |                 |                 |
 |                 |                 |                 |                 |
 | Select Quality  |                 |                 |                 |
 |---------------->|                 |                 |                 |
 | Click Download  |                 |                 |                 |
 |---------------->|                 |                 |                 |
 |                 |Download Request |                 |                 |
 |                 |---------------->|                 |                 |
 |                 |                 |-- Download Video|---------------->|
 |                 |                 |<- MP4 File -----|---------------- |
 |                 |                 |  Update Status  |                 |
 |                 |                 |---------------->|                 |
 |                 |                 |                 | (final status)  |
 |                 |<- Stream MP4 -- |                 |                 |
 |<- File Saved -- |                 |                 |                 |
```

---

### c (cont.). Sequence Diagram — Admin Login & Analytics (plain-text — paste into slide)

```
Admin          Dashboard          Backend           MongoDB
 |                 |                 |                 |
 |-- Enter Email ->|                 |                 |
 | Enter Password  |                 |                 |
 |---------------->|                 |                 |
 |-- Click Login ->|                 |                 |
 |                 |-- POST /login ->|                 |
 |                 |                 |-- Find Admin -->|
 |                 |                 |  Admin Record   |
 |                 |                 |<----------------|
 |                 |                 | (bcrypt hash)   |
 |                 |                 | (compare pwd,   |
 |                 |                 | sign JWT 24h)   |
 |                 |<- JWT Token --- |                 |
 |                 |                 |                 |
 |                 |-- GET /stats -->|                 |
 |                 |                 | (verify JWT)    |
 |                 |                 | Aggregate Stats |
 |                 |                 |---------------->|
 |                 |                 |Stats + Activity |
 |                 |                 |<----------------|
 |                 | Dashboard Data  |                 |
 |                 |<----------------|                 |
 | Show Analytics  |                 |                 |
 |<----------------|                 |                 |
 |                 | (refresh: 30s)  |                 |
```

---

### d. Activity Diagram — USER (Video Download) (plain-text — paste into slide text box)

```
  o                                      (start)
  |
  v
  +-----------------------------------------------+
  | Open Media-Grab Website                       |
  +-----------------------------------------------+
       |
       v
  +------------------+
  | Enter Video URL  |
  +------------------+
       |
       v
       +---------------------------+
       | URL Valid?                |
       +-----------+-------------+
           No     |     Yes
             +---|     |
             |   |     v
             |   +---------------------------+
             |   | Platform Supported?       |
             |   +-----------+-------------+
             |       No     |     Yes
             |         +---|     |
             |         |   |     v
             |         |   +-------------------------------------+
             |         |   | Fetch Video Details via yt-dlp      |
             |         |   | (Title, Thumbnail, Duration)         |
             |         |   +-------------------------------------+
             |         |           |
             |         |           v
             |         |   +-----------------------------+
             |         |   | Details Found?              |
             |         |   +-----------+---------------+
             |         |       No     |     Yes
             |         |         +---|     |
             |         |         |   |     v
             |         |         |   +------------------------------+
             |         |         |   | Display Title and Thumbnail  |
             |         |         |   +------------------------------+
             |         |         |           |
             |         |         |           v
             |         |         |   +---------------------------+
             |         |         |   | Select Quality           |
             |         |         |   | 1080p / 720p / 480p / 360p |
             |         |         |   +---------------------------+
             |         |         |           |
             |         |         |           v
             |         |         |   +------------------------------+
             |         |         |   | Download Video as MP4       |
             |         |         |   +------------------------------+
             |         |         |           |
             |         |         |           v
             |         |         |   +-----------------------------+
             |         |         |   | Download Successful?        |
             |         |         |   +-----------+---------------+
             |         |         |       No     |     Yes
             |         |         |         +---|     |
             |         |         |         |   |     v
             |         |         |         |   +------------------------------+
             |         |         |         |   | Update Record as Success    |
             |         |         |         |   +------------------------------+
             |         |         |         |           |
             |         |         |         |           v
             |         |         |         |   +------------------------------------+
             |         |         |         |   | Deliver MP4 File to User          |
             |         |         |         |   +------------------------------------+
             |         |         |         |           |
             |         |         |         |           v
             |         |         |         |   x                            (end)
             |         |         |         |     |
             |         +---------+---------+     |
             |         |               (both paths|
             |         |                converge  v
             |         |   +------------------------------+
             |         |   | Update Record as Failed      |
             |         |   +------------------------------+
             |         |           |
             |         |           v
             |         |   +------------------------------+
             |         |   | Show Error Message           |
             |         |   +------------------------------+
             |         |           |
             |         |           v
             |         +---------------------------+
             |                     |
             |                     v  (loop back to Enter URL)
             |   +------------------+
             +-->| Show Error       |
                 | Message          |
                 +------------------+
                      ^                (appears when URL
                      |                 is invalid or
                      +-----------------> unsupported)
```

---

### d (cont.). Activity Diagram — ADMIN (Login & Dashboard) (plain-text — paste into slide text box)

```
  o                                      (start)
  |
  v
  +-------------------------------+
  | Admin Login Page              |
  | (email + password)            |
  +-------------------------------+
       |
       v
       +---------------------------+
       | Credentials Verified?    |
       +-----------+-------------+
           No     |     Yes
             +---|     |
             |   |     v
             |   +-------------------------------------------+
             |   | Admin Dashboard                           |
             |   | JWT Session — 24h Validity                 |
             |   +-------------------------------------------+
             |           |
             |           v
             |   +-------------------------------------------+
             |   | View Dashboard Statistics                 |
             |   | Visitors, Downloads, Success/Failed       |
             |   | Today / This Week                         |
             |   +-------------------------------------------+
             |           |
             |           v
             |   +-------------------------------------------+
             |   | Platform-wise Analytics                   |
             |   | YouTube / Facebook / Instagram / X        |
             |   +-------------------------------------------+
             |           |
             |           v
             |   +-------------------------------------------+
             |   | View Recent Download Records              |
             |   | Auto-refresh every 30 sec                 |
             |   +-------------------------------------------+
             |           |
             |           v
             |   +-------------------------------+
             |   | Logout                         |
             |   +-------------------------------+
             |           |
             |           v
             |   x                            (end)
             |     |
             +-----+

       +---------------+
       | View Error    |
       | Message       |
       +---------------+
             ^                    (shown when login fails
             +---------------------> loops back to login)
```

---

## 5. DATA DICTIONARY

> Database: **MongoDB** (NoSQL). Constraints are enforced by **Mongoose schemas**.
> `visitorId` in DownloadRecord is a **logical reference** to Visitor (MongoDB does not enforce foreign keys).

### Table 1: `admins`  (PK: _id)

```
+================================================================+
|                        TABLE: ADMINS                          |
+================================================================+
| Table Name:     ADMINS                                         |
| Primary key:    _id                                            |
| Foreign key:    (none)                                         |
+-----------------------------------------------------------------+
| ATTRIBUTE  | CONSTRAINT          | DATATYPE | SIZE | DESCRIPTION|
|------------+---------------------+----------+------+------------|
| _id        | Primary Key         | ObjectId | 12 B | Unique admin identifier (auto-generated) |
| email      | Required, Unique    | String   | 254  | Admin login email (lowercase, trimmed) |
| password   | Required, Min 6     | String   | 60   | bcrypt-hashed password (salt 12) |
| createdAt  | Default: now        | Date     | 8 B  | Account creation timestamp |
+-----------------------------------------------------------------+
```

### Table 2: `visitors`  (PK: _id, UK: visitorId)

```
+================================================================+
|                       TABLE: VISITORS                         |
+================================================================+
| Table Name:     VISITORS                                       |
| Primary key:    _id                                            |
| Foreign key:    (none — visitorId is Unique Key)              |
+-----------------------------------------------------------------+
| ATTRIBUTE    | CONSTRAINT          | DATATYPE | SIZE | DESCRIPTION|
|--------------+---------------------+----------+------+------------|
| _id          | Primary Key         | ObjectId | 12 B | Unique document identifier |
| visitorId    | Unique Key, Indexed | String   | 36   | UUID stored in httpOnly cookie (1-year expiry) |
| firstVisit   | Default: now        | Date     | 8 B  | Timestamp of visitor's first request |
| lastVisit    | Auto-update on req  | Date     | 8 B  | Timestamp of most recent request |
| totalRequests| Default: 1, Incr.   | Number   | 8 B  | Total API requests made by this visitor |
| platforms    | Enum array          | String[] | Var  | Platforms accessed (YouTube/Facebook/Instagram/X) |
+-----------------------------------------------------------------+
```

### Table 3: `downloadrecords`  (PK: _id, FK: visitorId → visitors.visitorId)

```
+================================================================+
|                     TABLE: DOWNLOADRECORDS                    |
+================================================================+
| Table Name:     DOWNLOADRECORDS                               |
| Primary key:    _id                                            |
| Foreign key:    visitorId  -->  VISITORS.visitorId (logical)  |
+-----------------------------------------------------------------+
| ATTRIBUTE    | CONSTRAINT                       | DATATYPE | SIZE | DESCRIPTION|
|--------------+----------------------------------+----------+------+------------|
| _id          | Primary Key                      | ObjectId | 12 B | Unique record identifier |
| visitorId    | Foreign Key (logical), Indexed   | String   | 36   | Anonymous visitor who requested download |
| platform     | Required, Enum, Indexed          | String   | 10   | Source platform (YouTube/FB/Instagram/X) |
| url          | Required                         | String   | 2048 | Original video URL entered by user |
| videoTitle   | Default: 'Unknown'               | String   | 300  | Title of the downloaded video |
| format       | Default: 'mp4'                   | String   | 5    | Output file format |
| quality      | Default: 'best'                  | String   | 6    | Selected resolution (1080p/720p/480p/360p) |
| status       | Required, Enum, Default: pending | String   | 7    | Current state (pending/success/failed) |
| errorMessage | Default: null                    | String   | 500  | Failure reason if status = failed |
| createdAt    | Default: now, Indexed            | Date     | 8 B  | Timestamp of download request |
+-----------------------------------------------------------------+
```

---

*Generated from actual codebase: `Backend/` (Express + MongoDB + yt-dlp + FFmpeg) and `frontend/` (React).*

---

**3 paste rules for every slide:**
1. Font → **Consolas** or **Courier New** (monospace — keeps the `|` columns aligned)
2. Line spacing → **Exactly 1.0** (not "Single" or "Multiple")
3. Turn off **AutoFit** (Right-click text box → Format Shape → Text options → do not shrink/overflow)

---

## 6. POSSIBLE QUESTIONS & ANSWERS (for viva / presentation Q&A)

Keep this page — do NOT paste into the slide. Use it to prepare answers.
All answers are based on the actual codebase.

### A. GENERAL / ABOUT THE PROJECT

**Q1: What is Media-Grab?**
A: A MERN Stack web application (React + Node.js/Express + MongoDB) that lets anyone download
videos from YouTube, Facebook, Instagram, and X (Twitter) through one interface, without signing up.
It uses yt-dlp for fetching video info and downloading, and FFmpeg for merging formats into MP4.

**Q2: What does MERN stand for?**
A: MongoDB, Express.js, React.js, Node.js — the four technologies used in this project.

**Q3: Which platforms are supported?**
A: YouTube, Facebook, Instagram, and X (Twitter). The platform is detected automatically from the URL
by the `detectPlatform()` function in `Backend/utils/platformDetector.js`.

**Q4: Do users need to sign up or log in?**
A: No. Visitors use the site anonymously. A unique visitor ID is assigned via an httpOnly cookie
(uuid v4, 1-year expiry). This is a privacy feature — no personal data is collected from the visitor.

**Q5: Is there any user authentication at all?**
A: Only for the Admin. Admins log in with email + password (bcrypt-hashed). Visitors have no login.
Admin sessions use a JWT token valid for 24 hours.

**Q6: What is the difference between this project and the old definition text?**
A: The old definition text mentioned user registration, user login, user download history, and admin
managing users. Those features do NOT exist in the actual code. The real app is anonymous for visitors,
and the admin only monitors downloads/stats — there is no user management.

---

### B. SYSTEM FLOW / ARCHITECTURE

**Q7: Explain the user download flow step by step.**
A: 1) Visitor opens site → cookie assigns visitorId. 2) Pastes a video URL. 3) Frontend calls
`GET /api/video-info?url=...`. 4) Backend validates URL, detects platform, runs yt-dlp to fetch
title/thumbnail/duration/formats. 5) A DownloadRecord is saved to MongoDB with status "pending".
6) Frontend shows details + quality options. 7) User picks quality, clicks Download.
8) Frontend calls `GET /api/video-download?url=...&quality=...`. 9) Backend downloads via yt-dlp,
merges with FFmpeg into MP4, updates record to "success", sends the file to the browser.
10) File is cleaned up from the server after download.

**Q8: What happens when the URL is invalid or unsupported?**
A: `/api/video-info` returns a 400 error with a user-friendly message. The frontend shows the error
in a red box. Specific messages exist for: invalid URL format, unsupported platform, video unavailable,
private video, members-only, geo-blocked, and YouTube requiring cookies.

**Q9: How is the platform detected?**
A: The backend `detectPlatform(url)` checks URL patterns. YouTube: youtube.com/watch, shorts, youtu.be,
embed, music.youtube.com. Facebook: facebook.com/watch, reel, video, fb.watch. Instagram: instagram.com/
reel, reels, p, tv. X: x.com, twitter.com, t.co. Returns the platform name or null.

**Q10: How does the admin dashboard get its data?**
A: Frontend calls `GET /api/admin/dashboard/stats` (JWT-protected) every 30 seconds. Backend aggregates
from MongoDB: totalVisitors (Visitor.countDocuments), totalDownloads, successful/failed counts,
downloadsToday (today's date range), downloadsThisWeek (this week's range), and per-platform counts
(YouTube/Facebook/Instagram/X). Also calls `GET /api/admin/activity/recent?limit=15` for the recent
activity table.

**Q11: What is the auto-refresh interval on the admin dashboard?**
A: 30 seconds (30000 ms). Implemented via `setInterval(fetchData, 30000)` in AdminDashboard.js.

**Q12: How are temporary download files cleaned up?**
A: The server creates the `downloads/` folder on startup. A `setInterval` runs every 30 minutes and
deletes any file older than 30 minutes from that folder. After each download is sent to the browser,
`safeDelete()` removes the file immediately.

---

### C. AUTHENTICATION & SECURITY

**Q13: How does admin login work?**
A: Admin submits email + password to `POST /api/admin/login`. Backend finds the admin by email
(lowercase, trimmed), compares the password using bcrypt (salt 12), and if valid, signs a JWT
containing `{ id, email }` with `JWT_SECRET`, expiring in 24 hours. The token is stored in the browser's
localStorage and sent in the Authorization header as `Bearer <token>` for all subsequent admin requests.

**Q14: What happens on a failed login?**
A: If email not found or password mismatch, the backend returns 401 with "Invalid credentials."
The frontend shows this message in a red error box. The login form stays open.

**Q15: How is the JWT token validated on protected routes?**
A: The `adminAuth` middleware in `Backend/middleware/auth.js` checks the Authorization header for a
Bearer token. It calls `jwt.verify(token, JWT_SECRET)`. If valid, `req.admin` is set and the request
proceeds. If missing, malformed, or expired, it returns 401 "Access denied" or "Invalid or expired token."

**Q16: Where is the JWT secret stored?**
A: In the environment variable `JWT_SECRET`, with a fallback `'fallback-secret-change-me'` in
`Backend/middleware/auth.js`. The `.env` file holds the real secret.

**Q17: How secure is the admin password storage?**
A: Passwords are hashed with bcrypt using salt 12 before being saved to MongoDB (in the `pre('save')`
hook of the Admin model). The plain-text password is never stored. The `comparePassword()` method
compares a candidate password against the stored hash.

**Q18: How are visitor identities tracked without login?**
A: The `trackingMiddleware` in `Backend/middleware/tracking.js` runs on every `/api` request. If no
`visitorId` cookie exists, it generates a UUID v4, sets it as an httpOnly, sameSite=lax cookie with
365-day expiry, and upserts a Visitor record in MongoDB. This happens silently on the first request.

**Q19: Is the visitor data visible to the admin?**
A: The admin sees aggregate counts (total visitors) and download records tagged with visitorId, but
does NOT see a list of visitors or their personal information — there is no such feature. Visitor records
exist for analytics, not for user management.

---

### D. DATABASE / DATA MODELS

**Q20: What database is used?**
A: MongoDB, accessed via Mongoose ODM. Connection is configured in `Backend/config/db.js` using
`process.env.MONGODB_URI`.

**Q21: How many collections (tables) are there?**
A: Three: `admins`, `visitors`, and `downloadrecords`.

**Q22: What is the primary key of each collection?**
A: All three use MongoDB's auto-generated `_id` (ObjectId, 12 bytes) as primary key.

**Q23: What is the relationship between Visitor and DownloadRecord?**
A: Logical one-to-many. One Visitor (identified by `visitorId`) can have many DownloadRecords.
The `visitorId` field in DownloadRecord is a logical foreign key — MongoDB does not enforce foreign
key constraints, but the field is indexed for efficient queries.

**Q24: What are the fields in the downloadrecords collection?**
A: `_id`, `visitorId`, `platform` (enum: YouTube/Facebook/Instagram/X), `url`, `videoTitle`,
`format` (default mp4), `quality`, `status` (enum: pending/success/failed, default pending),
`errorMessage`, `createdAt`. All documented in the data dictionary section.

**Q25: What status values can a download record have?**
A: Three: `pending` (default, when request starts), `success` (download completed and file sent),
`failed` (error occurred, with errorMessage filled in).

**Q26: How is the visitorId generated?**
A: UUID v4 via the `uuid` npm package (`const { v4: uuidv4 } = require('uuid')`). Generated once
per visitor and stored in a cookie so it persists across requests.

**Q27: Does MongoDB enforce the foreign key from DownloadRecord to Visitor?**
A: No. MongoDB does not enforce foreign key constraints. The `visitorId` in DownloadRecord is a logical
reference — it's indexed for query performance, but a record can exist even if there is no matching
Visitor document.

---

### E. API / BACKEND

**Q28: What are the backend API endpoints?**
A: 
- `POST /api/admin/login` — admin login, returns JWT token
- `GET /api/admin/dashboard/stats` — protected, returns aggregate stats
- `GET /api/admin/activity/recent?limit=N` — protected, returns recent download records
- `GET /api/admin/verify` — protected, checks if token is valid
- `GET /api/video-info?url=...` — public, returns video metadata + available formats
- `GET /api/video-download?url=...&quality=...` — public, downloads and returns MP4 file
- `GET /api/health` — public, health check

**Q29: Which HTTP methods are used?**
A: GET for all data-fetching and download endpoints, POST only for admin login.

**Q30: How does the frontend communicate with the backend?**
A: Via axios. The `api.js` utility creates an axios instance with `baseURL` (default
http://localhost:5000) and `withCredentials: true` so cookies are sent. An interceptor attaches the
admin JWT token from localStorage to requests when present, and handles 401 by clearing the token and
redirecting to `/admin/login`.

**Q31: What is the frontend routing structure?**
A: React Router. Public routes: `/` (Downloader), `/facebook`, `/instagram`, `/x` (all render the
Downloader page). Admin routes: `/admin/login` (AdminLogin), `/admin/dashboard` (AdminDashboard).
If an admin token exists in localStorage, `/admin/login` redirects to `/admin/dashboard`, and vice versa
for unauthorised access.

**Q32: How does the download actually get to the user's device?**
A: The backend calls `res.download(downloadedFile, filename)` which sends the MP4 as a file download.
The frontend receives it as a blob, creates an object URL, and triggers a download via a hidden anchor
element with the `download` attribute set to the safe filename.

**Q33: What is yt-dlp and why is it used?**
A: yt-dlp is an open-source command-line tool for downloading videos from YouTube and many other sites.
It's used here for two things: 1) `--dump-json` to fetch video metadata (title, thumbnail, duration,
available formats) without downloading. 2) Downloading the actual video with format selection and
merging to MP4 via FFmpeg.

**Q34: How does the backend find the yt-dlp executable?**
A: `findYtDlpPath()` in `Backend/utils/ytDlp.js` checks: 1) `YT_DLP_PATH` env var, 2) a list of
common paths (yt-dlp in PATH, /usr/local/bin, Windows AppData Python Scripts folders), 3) falls back
to running `where`/`which yt-dlp`. Returns the path or null.

**Q35: What happens if yt-dlp is not installed?**
A: Both `/video-info` and `/video-download` return a 500 error: "Video download service is not
configured. Please contact the administrator." The download record is also updated to "failed" with
errorMessage "yt-dlp not found" on the download endpoint.

**Q36: What fallback logic exists for yt-dlp failures?**
A: `getVideoInfo` and `downloadVideo` both try first with `--extractor-args
"youtube:player_client=web_creator,android"` (to bypass YouTube bot detection). If that fails with a
player_client/extractor error, they retry without those args. This is a two-attempt fallback.

**Q37: What quality options are shown to the user?**
A: The backend extracts real available heights from yt-dlp's format list, then merges in standard
options (1080p, 720p, 480p, 360p) so the user always has choices even if yt-dlp didn't report all
of them. If no formats are found at all, it defaults to 720p, 480p, 360p.

**Q38: How is FFmpeg used?**
A: FFmpeg is invoked by yt-dlp internally during the merge step. The backend passes
`--merge-output-format mp4` to yt-dlp, and yt-dlp uses FFmpeg to merge the best video + best audio
into a single MP4 file. FFmpeg itself is not called directly by the Node.js code.

---

### F. FRONTEND / UI

**Q39: What frontend framework is used?**
A: React.js with functional components and hooks (useState, useEffect, useCallback, useRef).

**Q40: What styling approach is used?**
A: Tailwind CSS (utility classes) for layout and styling, with custom CSS in App.css/index.css for
background effects (glassmorphism, mesh gradients, orbs).

**Q41: Does the UI support dark/light mode?**
A: Yes. `ThemeContext.js` provides a ThemeProvider with `isDark` state, persisted in localStorage.
The toggle is available on both the downloader page and the admin pages. Tailwind's dark mode is
handled via the `dark` class on the HTML root element.

**Q42: What components exist in the frontend?**
A: App.js (main app + routing), Downloader.js (main download page), AdminLogin.js, AdminDashboard.js,
Navbar.js, Footer.js, ThemeContext.js, api.js. That's the full component tree.

**Q43: How does the downloader page detect the platform from the URL?**
A: The frontend has its own `detectPlatform(url)` function in Downloader.js that checks the URL string
for youtube.com, facebook.com, instagram.com, x.com/twitter.com/t.co. This is for UI purposes only
(showing the platform badge). The backend does the authoritative detection.

**Q44: What happens when the user clicks a platform pill (YouTube/Facebook/etc.)?**
A: It clears the URL, video info, error, and success state, and focuses the input field — essentially
a reset so the user can paste a new URL for that platform.

**Q45: How is the video duration displayed?**
A: The backend returns `duration` in seconds from yt-dlp. The frontend's `formatDuration()` converts
it to H:MM:SS or M:SS and shows it as a badge on the thumbnail.

**Q46: What is shown in the admin dashboard's Recent Activity table?**
A: The 15 most recent download records (default limit, configurable via `?limit=N`), sorted by
createdAt descending. Each row shows: Platform (badge), Video Title (truncated to 200px), Quality,
Status (badge: pending/success/failed), and Time (locale string).

---

### G. PROJECT SCOPE / FEATURES THAT DO NOT EXIST

**Q47: Can users view their own download history?**
A: No. There is no user account system for visitors, so there is no download history page for users.
Download records are stored in the database for admin analytics only.

**Q48: Can the admin manage users (add/remove/block)?**
A: No. There is no user management feature. The admin cannot see a list of visitors, cannot add or
remove users, and cannot block anyone. The only admin actions are viewing stats, platform analytics,
and recent activity, plus logging out.

**Q49: Is there a user registration or sign-up page?**
A: No. The only login page is `/admin/login`. Visitors never register.

**Q50: Is there a logout for visitors?**
A: No. Visitors don't have a session to log out from. They can clear their browser cookies if they
want to reset their visitor ID.

**Q51: Does the app support 4K downloads?**
A: The frontend copy mentions "up to 4K" as a feature highlight, but the backend only provides quality
options based on what yt-dlp reports (typically up to 1080p for most videos). If a video has a higher
resolution available, yt-dlp will report it and it will appear in the quality dropdown. But there is
no guarantee of 4K support for all videos.

**Q52: Does the app store any personal data about visitors?**
A: No personal data. Only a UUID visitorId (random, not tied to identity), the platforms they accessed,
and aggregate request counts. No name, email, IP address, or device info is stored in the Visitor model.

---

### H. LIMITATIONS / IMPROVEMENTS

**Q53: What are the limitations of this system?**
A: 1) Only 4 platforms supported. 2) No user accounts or download history for visitors. 3) No user
management for admins. 4) yt-dlp must be installed separately on the server. 5) Some YouTube videos
may be blocked (private, members-only, geo-restricted, age-gated) and cannot be downloaded.
6) Temporary files are stored on the server for up to 30 minutes, requiring disk space.
7) No rate limiting — a malicious user could spam requests.

**Q54: What would you add in a future version?**
A: Possible improvements: user accounts with download history, admin user management, rate limiting,
video preview before download, more platform support, cloud storage instead of local temp files,
email notifications for admin, export stats to CSV/PDF, captcha on the downloader to prevent abuse,
and a progress bar during download.

**Q55: Why use MongoDB instead of SQL?**
A: MongoDB is flexible for this use case — the documents have varying fields (e.g. platforms array),
no complex joins are needed, and the schema can evolve easily. Mongoose provides schema validation
and a clean API. The logical reference between Visitor and DownloadRecord is simple enough that
foreign key enforcement is not critical.

**Q56: Why JWT instead of session-based auth?**
A: JWT is stateless — the server does not need to store session data. The token contains the admin's
id and email, signed with a secret. This scales better and is simple to implement with the
Authorization header. The 24-hour expiry provides a reasonable session length.

**Q57: Why bcrypt with salt 12?**
A: bcrypt is designed for password hashing — it's slow by design (to resist brute force), includes a
salt to prevent rainbow table attacks, and salt 12 provides a good balance between security and
login speed for this project.


## 7. FUTURE ENHANCEMENT (one slide — plain text, paste into slide text box)

Font → Consolas or Courier New (monospace). Line spacing → Exactly 1.0. Turn off AutoFit.

```
+============================================================================+
|                       FUTURE ENHANCEMENT                                  |
+============================================================================+

  1. USER ACCOUNTS & DOWNLOAD HISTORY
     - Add visitor sign-up / login (email or Google OAuth).
     - Personal download history page per user.
     - Save favorites / watched list.

  2. ADMIN USER MANAGEMENT
     - Admin can view, add, edit, disable visitor/user accounts.
     - Role-based access (super admin, staff admin).
     - Admin activity log (who logged in, what they viewed).

  3. MORE PLATFORMS
     - Add Vimeo, TikTok, Twitter/X long-form, Dailymotion, Twitch clips.
     - Per-platform quality/format quirks documented.

  4. RATE LIMITING & ABUSE PREVENTION
     - Limit downloads per visitor per hour.
     - CAPTCHA on the downloader for suspicious traffic.
     - IP-based throttling and bot detection.

  5. CLOUD STORAGE INSTEAD OF LOCAL TEMP FILES
     - Stream / store downloads on cloud (S3, Cloudinary, Backblaze).
     - Avoid local disk usage and 30-min cleanup dependency.
     - Allow longer / resumable downloads for large files.

  6. VIDEO PREVIEW BEFORE DOWNLOAD
     - Show a short in-browser preview (first few seconds).
     - Thumbnail hover / play button on the info card.

  7. DOWNLOAD PROGRESS & RESUME
     - Show a progress bar during download.
     - Support resume for interrupted large downloads.

  8. ADMIN EXPORT & NOTIFICATIONS
     - Export stats / activity to CSV or PDF.
     - Email digest to admin (daily/weekly summary).
     - Low-disk-space alert for the server.

  9. UI / UX IMPROVEMENTS
     - Drag-and-drop URL paste.
     - Bulk URL list (download multiple videos).
     - Better mobile layout and smaller-screen quality picker.
     - Onboarding tooltip for first-time visitors.

  10. RELIABILITY & MAINTENANCE
      - yt-dlp auto-update check on server startup.
      - Health check endpoint plus uptime monitoring.
      - Structured logging (Winston / Pino) instead of console.error.
      - Docker Compose setup for backend + MongoDB + yt-dlp/FFmpeg.

  SCOPE NOTE: These are ideas for a future version. Media-Grab's current scope is
  anonymous multi-platform video download + a JWT-protected admin analytics dashboard.
  User accounts, user download history, and admin user-management do NOT exist today.
```


*Generated from actual codebase: `Backend/` (Express + MongoDB + yt-dlp + FFmpeg) and `frontend/` (React).*

