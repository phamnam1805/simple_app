# Simple App - NestJS Learning Project

A simple NestJS application built for learning CI/CD with GitHub Actions and Kubernetes deployment practices.

## Overview

This repository contains simple NestJS APIs designed for:
- **Learning CI/CD** with GitHub Actions
- **Kubernetes practice** material for [Miko project](https://github.com/phamnam1805/miko)

## Features

- **User Management**: Basic CRUD operations for users
- **Authentication**: JWT-based auth with login/register
- **Video Upload**: File upload and streaming functionality
- **RESTful APIs**: Standard HTTP endpoints
- **Docker Support**: Multi-stage build for production

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
# Start development server
npm run start:dev

# Run tests
npm run test

# Build for production
npm run build
```

### Docker
```bash
# Build image
docker build -t simple-app .

# Run container
docker run -p 3000:3000 simple-app
```

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Videos
- `POST /videos/upload` - Upload video file
- `GET /videos` - Get all videos
- `GET /videos/:id/stream` - Stream video
- `GET /videos/:id/download` - Download video

## Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Upload**: Multer
- **Testing**: Jest
- **Docker**: Multi-stage build

## Learning Purpose

This project serves as a practical example for:
- Setting up CI/CD pipelines with GitHub Actions
- Containerizing Node.js applications
- Deploying to Kubernetes clusters
- Building RESTful APIs with NestJS
- Implementing authentication and file handling

## Related Projects

- [Miko](https://github.com/phamnam1805/miko) - Kubernetes learning repository that uses this app as deployment material

## License

MIT
