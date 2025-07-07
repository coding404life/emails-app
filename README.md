# Next.js + Fastify Email App

![image](https://github.com/user-attachments/assets/4d3eef82-b437-416e-a8e0-fb18a7add253)
![image](https://github.com/user-attachments/assets/6e116b95-cbe5-488e-9605-ccfc84e380ee)

## Features

- **Email List Sidebar**: View all saved emails in a sidebar (Apple Mail style)
- **Search**: Filter emails by To, CC, BCC, Subject, or Body (case-insensitive, debounced)
- **Email Preview**: Click an email to preview its details on the right
- **Compose Email**: Floating button opens a modal to compose a new email (fields: To, CC, BCC, Subject, Body)
- **Save Only**: Emails are saved to the database (no actual sending)
- **Material UI**: Clean, modern interface using Material UI v5
- **Monorepo**: Frontend (Next.js) and Backend (Fastify + SQLite) in one repo

---

## Getting Started

### 1. Clone the Repository
```bash
git clone <repo-url>
cd test-NextJS-Node-Fastify
```

### 2. Setup the Backend
```bash
cd backend
# Install dependencies
yarn install
# Run database migrations
yarn migrate
# Start the backend server (http://localhost:3001)
yarn dev
```

### 3. Setup the Frontend
Open a new terminal tab/window:
```bash
cd frontend
# Install dependencies
yarn install
# Start the frontend (http://localhost:3000)
yarn dev
```

---

## Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- The sidebar shows all emails. Use the search bar to filter.
- Click the **+** button (bottom right) to compose a new email.
- Fill in To, CC, BCC, Subject, and Body. Click **Send** to save.
- Click any email in the sidebar to preview its details.

---

## Tech Stack
- **Frontend**: Next.js, React, Material UI v5
- **Backend**: Fastify, Knex, SQLite

---

## Notes
- No real emails are sent; all emails are stored in the SQLite database.
- For development only. Do not use in production without further security and validation.

---

## Troubleshooting
- If you see CORS errors, make sure the backend is running and CORS is enabled for `http://localhost:3000`.
- If you see database errors, ensure migrations have run and the backend is restarted.

---

## License
MIT
