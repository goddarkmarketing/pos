# Simple POS System

This project is a minimal example of a Point Of Sale (POS) application built with Node.js and a MySQL database. It provides basic endpoints for user management, product management, and recording sales. A very small web interface is included in the `frontend` folder.

## Structure

- `backend` - Node.js Express API server
- `frontend` - Static HTML/CSS/JS pages
- `sql/schema.sql` - SQL script to create the database schema

## Usage

1. Import `sql/schema.sql` into your MySQL server.
2. Configure database credentials using environment variables: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`.
3. In the `backend` folder run `npm install` (requires internet access) and `npm start`.
4. Open `frontend/index.html` in a browser.

This example is intentionally simplified and does not implement authentication or secure password storage. It is provided for demonstration purposes only.
