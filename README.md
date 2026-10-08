# Uzbek Prompts

A full-stack AI prompt library built with Node.js, Express and MongoDB.

## Features

- English interface throughout the website
- Log In and Sign Up
- Dedicated administrator login at `/admin`
- Publish, list, copy and like prompts
- My Prompts account view with delete support
- 18 prompt categories
- Search, type filters and sorting
- Persistent prompt storage in MongoDB
- Responsive modern design

## Run

1. Install dependencies:

```bash
npm install
```

2. Check `.env` and make sure the MongoDB connection and admin credentials are valid.

3. Start the server:

```bash
npm start
```

4. Open:

- Main site: `http://localhost:5000`
- Admin: `http://localhost:5000/admin`

## Important

The admin page now has its own login form. It uses `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env` and automatically creates/upgrades the administrator account on the first successful admin login.

If MongoDB reports an Atlas connection error, make sure the computer's IP address is allowed in MongoDB Atlas Network Access and that the connection string is correct.
