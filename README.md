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
