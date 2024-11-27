# Custom Email Service with Next.js and Supabase

This project is a custom email service similar to Gmail, built using Next.js and Supabase. The app manages users via Supabase, and each user has their own unique email address in the format `username@oxy.so`. The platform allows users to send and receive emails seamlessly, offering a personalized and secure email experience.

## Features

- User authentication and management using NextAuth.js and Supabase
- Email sending and receiving functionality
- User profile page for updating personal information and settings
- Email security and privacy features, including encryption and spam marking

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- Supabase account and project
- PostgreSQL database for Prisma

### Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_KEY=your-supabase-key
DATABASE_URL=your-database-url
```

### Supabase Setup

1. Sign up for a Supabase account and create a new project.
2. Obtain the Supabase URL and API key from the project settings.
3. Create the necessary tables in the Supabase database:

```sql
-- Users table
create table users (
  id serial primary key,
  username text unique not null,
  email text unique not null,
  password text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Inbox table
create table inbox (
  id serial primary key,
  sender text not null,
  subject text not null,
  content text not null,
  received_at timestamp with time zone default now(),
  user_id integer references users(id)
);

-- Sent table
create table sent (
  id serial primary key,
  recipient text not null,
  subject text not null,
  content text not null,
  sent_at timestamp with time zone default now(),
  user_id integer references users(id)
);
```

### Prisma Setup

1. Install Prisma CLI as a development dependency:

```bash
npm install @prisma/cli --save-dev
```

2. Initialize Prisma in the project:

```bash
npx prisma init
```

3. Update the `prisma/schema.prisma` file with the following content:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  emails    Email[]
}

model Email {
  id        Int      @id @default(autoincrement())
  senderId  Int
  recipient String
  subject   String
  content   String
  sentAt    DateTime @default(now())
  receivedAt DateTime?
  user      User     @relation(fields: [senderId], references: [id])
}

model Inbox {
  id        Int      @id @default(autoincrement())
  sender    String
  subject   String
  content   String
  receivedAt DateTime @default(now())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}

model Sent {
  id        Int      @id @default(autoincrement())
  recipient String
  subject   String
  content   String
  sentAt    DateTime @default(now())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
}
```

4. Generate the Prisma client:

```bash
npx prisma generate
```

5. Run the Prisma migrations to create the database tables:

```bash
npx prisma migrate dev --name init
```

### Running the Project

1. Install the dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000` to see the app in action.

## Project Structure

- `src/app/api`: Contains API routes for sending and receiving emails, and user authentication.
- `src/app/profile.tsx`: User profile page for updating personal information and settings.
- `src/app/inbox.tsx`: User interface for displaying received emails.
- `src/app/sent.tsx`: User interface for displaying sent emails.
- `src/app/compose.tsx`: User interface for composing and sending emails.
- `lib/supabaseClient.js`: Initializes and exports the Supabase client.
- `lib/prismaClient.js`: Initializes and exports the Prisma client.
- `prisma/schema.prisma`: Defines the database schema for users, emails, inbox, and sent tables.
- `styles/globals.css`: Global styles for the email app.

## Contributing

Feel free to open issues or submit pull requests for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
