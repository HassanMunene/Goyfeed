# GoyFeed - Modern Social Media Platform

![GoyFeed Screenshot](https://github.com/user-attachments/assets/670f06f8-a59d-4861-af2f-29abb1a51640)

A full-stack social media application with real-time features, built with cutting-edge technologies.

---

## Key Features

### Core Functionality
**JWT Authentication** (Secure signup/login with token refresh)  
**Rich Post Creation** (Text, images, and embedded media)  
**Social Graph** (Follow/unfollow with privacy controls)  
**Real-time Engagement** (Likes)  
**Optimistic UI Updates** (Instant feedback on interactions)  
 
# GoyFeed Architecture Overview

## 🌐 Tech Stack

### **Frontend**
<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

### **Backend**
<p align="left">
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/GraphQL-E10098?logo=graphql&logoColor=white" alt="GraphQL">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white" alt="Prisma">
</p>

## 🏗 System Architecture

## System Design
```mermaid
graph LR
    A[React Frontend] -->|GraphQL| B[Express Gateway]
    B -->|Prisma Client| C[(PostgreSQL)]
    style A fill:#4CAF50,stroke:#333,stroke-width:2px
    style B fill:#4CAF50,stroke:#333,stroke-width:2px
    style C fill:#FFC107,stroke:#333,stroke-width:2px


# GoyFeed - Complete Setup Guide

## Prerequisites

Before setting up **GoyFeed**, ensure you have the following installed:

- **Node.js** v18+
- **PostgreSQL** 15+
- **npm**
- **Git**

---

## 1. Frontend Setup (React + TypeScript + Tailwind)

### Clone & Install

Clone the repository and install dependencies:

```bash
git clone https://github.com/HassanMunene/Goyfeed
cd Goyfeed/frontend
npm install


## After installing packages on the frontend now it time to configure the environment variable for frontend. What we need is the endpoint for the backend communicate with it.

### so create a file named .env in the frontend.

```bash
./frontend/.env

VITE_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

After that start the frontend server for it to run:


```bash
npm run dev
```


## 2. Backend Setup (Express + GraphQl + Postgress)

### Clone & Install

Clone the repository and install dependencies:

```bash
cd Goyfeed/backend
npm install
```

## After installing packages on the backend now it time to configure the environment variable for backend.

### so create a file named .env in the backend.

```bash
./backend/.env

DATABASE_URL="postgresql://<username>:<password@localhost:5432/<db_name>?schema=public"
APP_SECRET=<your secret key>
PORT=4000
```

## After that Initialize Database
Run the Prisma migration command to set up the database schema:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

After that start the bakend server for it to run:


```bash
npm run dev
```