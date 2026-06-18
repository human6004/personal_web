import { neon } from "@neondatabase/serverless";
import { loadLocalEnv } from "./load-env.mjs";

loadLocalEnv();

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error("DATABASE_URL is required. Add it to .env.local or your shell.");
  process.exit(1);
}

const sql = neon(databaseUrl);

const statements = [
  `create extension if not exists pgcrypto`,
  `create table if not exists profiles (
    id text primary key default 'main',
    name text not null,
    title text not null,
    description text not null,
    tagline text not null,
    english_tagline text default '',
    socials jsonb not null,
    home jsonb not null,
    about jsonb not null,
    updated_at timestamptz default now()
  )`,
  `create table if not exists posts (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    description text not null,
    content text not null,
    date date not null,
    category text not null,
    tags text[] default '{}',
    cover text not null,
    draft boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`,
  `create table if not exists projects (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    summary text not null,
    content text not null,
    year text not null,
    role text not null,
    stack text[] default '{}',
    tags text[] default '{}',
    status text not null,
    cover text not null,
    repo_url text default '',
    demo_url text default '',
    case_study_url text default '',
    external_url text default '',
    highlights text[] default '{}',
    featured boolean default false,
    draft boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
  )`,
  `create index if not exists posts_public_date_idx on posts (draft, date desc)`,
  `create index if not exists projects_public_year_idx on projects (draft, year desc)`,
  `create index if not exists projects_featured_idx on projects (featured, draft)`
];

for (const statement of statements) {
  await sql.query(statement);
}

console.log("Neon schema is ready.");
