# Frontend Coding Challenge – StackBlitz (Next.js)

## Overview
This exercise evaluates how you design, implement, and reason about a small but realistic frontend application using **React and Next.js (App Router)**.

The focus is on:
- API integration via Next.js route handlers
- Component design and state management
- Error handling and loading states
- Accessibility (keyboard + screen reader basics)
- Code clarity and trade‑offs

**Timebox:** ~2 hours  
You do not need to finish everything perfectly. Prioritize correctness, structure, and clarity.

---

## Tech Stack
- React 18
- Next.js 14 (App Router)
- TypeScript
- StackBlitz (browser‑based IDE)

No external UI libraries are required.

---

## Functional Requirements

### 1. Search GitHub User
- Provide an input to search by GitHub username
- On submit:
  - Fetch user details
  - Fetch repositories for the user
- Handle:
  - Loading state
  - User not found
  - Network / API errors

### 2. API Integration (Required)
**Do NOT call GitHub APIs directly from the browser.**

Use the provided Next.js API routes:
- `GET /api/github/user?username={username}`
- `GET /api/github/repos?username={username}&page={n}&sort={updated|stars}`

These server routes internally call:
- `https://api.github.com/users/{username}`
- `https://api.github.com/users/{username}/repos`

Why this matters:
- Keeps API tokens server‑side
- Enables consistent error handling
- Mirrors real‑world Next.js architecture

---

### 3. User Profile Display
Show at minimum:
- Avatar
- Name (fallback to username)
- Followers / Following
- Link to GitHub profile

Handle missing fields gracefully.

---

### 4. Repository List
For each repository display:
- Name
- Description (fallback if missing)
- Stars
- Forks
- Open issues
- Size
- Last updated date
- Link to GitHub repo

Additional requirements:
- Pagination (“Load more”, 20 per page)
- Sorting toggle:
  - Most recently updated
  - Most starred

---

### 5. Repository Details Page
Route:/repo/[owner]/[repo]

On this page:
- Fetch repo details
- Display core metadata and stats
- Provide link back to GitHub

A basic implementation is sufficient.

---

## Accessibility (Required)
At minimum:
- All interactive elements reachable via keyboard
- Proper `<label>` usage for form fields
- Status messages announced using `aria-live`
- Focus moves to results after a successful search
- Images include meaningful `alt` text
- A “Skip to content” link is present and functional

You do **not** need full WCAG compliance—focus on fundamentals.

---

## Code Expectations
- Clear component boundaries
- Reasonable state management
- No unnecessary complexity
- Comments where intent may not be obvious
- Avoid copy‑paste patterns

---

## Optional Enhancements (Only if Time Permits)
Choose **one or two** at most:
- Skeleton loaders
- Client‑side caching of last search
- Improved error UX (empty states, retry)
- Small refactor for reuse or readability

These are **not required**.

---

## How to Work in StackBlitz
1. Open the provided StackBlitz project
2. Fork it
3. Implement the requirements
4. Ensure the app runs in the preview pane

No GitHub account is required.

---

## Submission
Please share:
1. Your **StackBlitz project URL**
2. A short note (3–5 bullets) covering:
   - What you completed
   - Trade‑offs you made
   - What you would improve with more time

---

## Evaluation Criteria
We will look at:
- Correct use of Next.js API routes
- Data flow and state handling
- Error and loading behavior
- Accessibility basics
- Code readability and structure
- Thoughtfulness in trade‑offs

We value **clarity and reasoning** over polish.

Good luck, and thank you for your time.
