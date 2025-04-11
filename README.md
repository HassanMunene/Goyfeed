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

## System Design
```mermaid
graph LR
    A[Client: React, Typescript, Tailwindcss] --> B[API Gateway: Express]
    B --> C[User Service]
    B --> D[Post Service]
    B --> E[Notification Service]
    style A fill:#61dafb,stroke:#333
    style B fill:#90c53f,stroke:#333
    style C fill:#ff6b6b,stroke:#333
    style D fill:#ffd166,stroke:#333
    style E fill:#a64ac9,stroke:#333