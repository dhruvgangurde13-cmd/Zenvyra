# Zenvyra E-Commerce Platform - Requirements Document

## Intent Analysis Summary
- **User Request**: Build "Zenvyra" — a full-stack, production-grade e-commerce platform with a premium user experience, clean architecture, real-world scalability, and minimal scope.
- **Request Type**: New Project (Greenfield)
- **Scope Estimate**: System-wide (Frontend + Backend + Database)
- **Complexity Estimate**: Moderate (Full-stack e-commerce flow with payment integration)

## Overview
Zenvyra is a modern, premium e-commerce platform designed to feel like a real startup product. It emphasizes clean, modular architecture, high-quality UI/UX (inspired by Apple/Nike), and maintainability. A unique brand mascot, "Zeno", will provide a distinguished character to the platform's user experience.

## Functional Requirements

### 1. Authentication
- User Registration (Sign up)
- User Login & Logout (JWT based authentication)
- Basic user session management

### 2. Product Catalog
- Display product listing with pagination
- Product search functionality
- Product filtering capabilities
- Dedicated Product Detail Page (PDP)

### 3. Shopping Cart
- Add products to cart
- Update product quantities
- Remove instances from the cart
- Persistent cart state (or session-based)

### 4. Checkout & Orders (Core Flow)
- Strict focus on Auth → Products → Cart → Checkout → Orders flow
- Simple checkout utilizing Razorpay (Test mode ONLY, skipping complex edge cases)
- Order placement and confirmation
- Order history and tracking viewing

### 5. Administration (Minimal)
- Basic Admin Panel
- Basic product management (Add/Edit/Delete catalog)
- Basic order viewing
- NO advanced analytics or dashboards

## Non-Functional Requirements

### 1. UI/UX Design System (Premium Aesthetic)
- **Theme**: Minimal, modern, high-end light theme (white + soft gray) with subtle purple/blue glowing accents.
- **Layouts**: Card-based layouts, high whitespace, rounded corners, soft shadows.
- **Typography & Interaction**: Clear hierarchy, smooth transitions, and minimal, purpose-driven animations avoiding excessive motion.
- **Landing Page**: Specific hero section with left-aligned copy and a right-aligned visual storytelling scene (product processing machine).

### 2. Mascot Integration (Zeno)
- **Concept**: A minimal, floating spirit with a rounded head, dot eyes, subtle smile, and glowing body.
- **Usage Contexts**: Landing page hero (sitting on the machine, swinging legs), loading states, empty states, and order success feedback.
- **Behavior**: Calm floating idle animation, responsive subtle reactions to nearby elements (e.g., leaning, bouncing).

### 3. Architecture & Code Quality
- **Backend Architecture**: Layered design strictly following `routes -> services -> models -> schemas -> config`. All business logic must reside in the service layer.
- **Frontend Architecture**: Component-based structure with reusable UI elements and clear separation of concerns using the App Router.
- **Strict Anti-Over-engineering**: Must be a cohesive structure. NO unnecessary microservices, NO advanced caching systems, and NO complex role hierarchies.

## Technical Context
- **Frontend**: Next.js (App Router), React, Tailwind CSS, ShadCN UI, Framer Motion
- **Backend**: FastAPI, SQLAlchemy
- **Database**: PostgreSQL
- **Infrastructure Integrations**: JWT, Razorpay (Payments), Cloudinary/S3 (Image hosting)

## Open Questions & Verification
The requirements were explicitly defined by the user to be minimal, scoped to core e-commerce capabilities, and strictly production-ready. No immediate user clarification is needed unless requested prior to the Workflow Planning/User Stories phase.
