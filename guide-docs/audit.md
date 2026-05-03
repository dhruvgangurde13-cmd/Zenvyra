## Initial User Request & Workspace Detection
**Timestamp**: 2026-04-21T10:30:34Z
**User Input**: "Build \"Zenvyra\" — a full-stack, production-grade e-commerce platform with a premium user experience, clean architecture, and real-world scalability.

This project MUST strictly follow the GUIDE-AI-SDP workflow defined in gemini.md. Do NOT skip or merge phases. Do NOT generate any application code until all DISCOVER phase stages are completed and explicitly approved.

---
You must strictly follow all workflow rules and constraints defined in gemini.md without deviation.

Do NOT generate any code unless explicitly instructed.

Do NOT assume missing details. Ask for clarification when needed.

Stay within scope. Do not over-engineer or introduce unnecessary complexity.

Follow each phase sequentially and wait for user approval before proceeding.
# ⚠️ WORKFLOW EXECUTION (MANDATORY)

You MUST:

* Start with Workspace Detection
* Display the complete welcome message
* Load rule detail files and common rules
* Maintain audit logging throughout
* Ask questions using required structured format
* WAIT for explicit user approval before moving between stages

You MUST NOT:

* Generate code prematurely
* Skip DISCOVER phase
* Merge phases
* Ignore validation or audit requirements

---

# 🎯 PROJECT OVERVIEW

Zenvyra is a modern, premium e-commerce platform designed to feel like a real startup product.

The system should emphasize:

* Clean, modular architecture
* High-quality UI/UX
* Maintainability and scalability
* Real-world deployment readiness

This is a GREENFIELD project.

---

# 🎨 FRONTEND VISION (CRITICAL)

The frontend is a key differentiator and must follow a premium design system.

## Design Style

* Minimal, modern, high-end aesthetic
* Inspired by Apple / Nike / high-quality Dribbble designs
* Light theme (white + soft gray)
* Accent: subtle purple/blue glow

## UI Principles

* Card-based layouts
* Rounded corners and soft shadows
* High whitespace
* Clear typography hierarchy
* Smooth, subtle transitions

---

# 🧠 MASCOT SYSTEM (ZENO)

Zenvyra includes a unique brand mascot:

## Concept

* Name: Zeno
* Form: floating, minimal spirit
* Rounded head, simple face (dot eyes + subtle smile)
* Smooth glowing body (no texture)

## Usage

* Landing page hero
* Loading states
* Empty states
* Order success feedback

## Behavior

* Calm floating idle animation
* Sits on top of a machine
* Subtle reactions:

  * leans forward when product enters
  * small bounce when output appears

---

# 🏠 LANDING PAGE DESIGN (REFERENCE-DRIVEN)

The landing page must follow this structured layout:

## Hero Section

### Layout

* Left:

  * Headline
  * Subtext
  * CTA buttons

* Right:

  * Visual storytelling scene

### Visual Scene

* A clean, minimal “product processing machine”
* Products enter from one side
* A Zenvyra-branded box exits

### Mascot Placement

* Zeno sits on top of the machine
* Legs gently swinging
* Subtle floating/cape motion

---

## Style Guidelines

* Soft gradient background (light purple/blue tones)
* Minimal color palette
* Smooth UI surfaces
* Soft shadows and depth

---

## Product Sections

* Featured products (card grid)
* Categories (card grid)
* Best sellers

Cards must include:

* clean product image
* minimal text
* hover effect

---

## Interaction Guidelines

* Smooth transitions
* Minimal animation
* Avoid excessive motion

IMPORTANT:

* Do NOT copy any reference directly
* Recreate layout and feel with original implementation
* Maintain consistency across all pages

---

# ⚙️ TECH STACK

Frontend:

* Next.js (App Router)
* React
* Tailwind CSS
* ShadCN UI
* Framer Motion

Backend:

* FastAPI
* SQLAlchemy

Database:

* PostgreSQL

Other:

* JWT authentication
* Razorpay (payments)
* Cloudinary/S3 (images)

---

# 🧩 CORE FEATURES

* Authentication (signup/login/logout)
* Product catalog (search, filter, pagination)
* Product detail page
* Shopping cart
* Checkout flow
* Orders and tracking
* Basic admin panel

---

# 🧠 ARCHITECTURE EXPECTATIONS

Backend:

* routes → services → models → schemas → config
* business logic ONLY in service layer

Frontend:

* component-based structure
* reusable UI components
* separation of concerns

---

# 📋 DISCOVER PHASE REQUIREMENTS

You MUST produce before any code:

1. Requirements summary
2. Feature breakdown
3. System architecture
4. Database schema
5. API design
6. Frontend architecture
7. State management strategy
8. Folder structure

All outputs must be:

* structured
* production-level
* clearly readable

---

# 🚀 INITIAL EXECUTION

Start the workflow correctly:

1. Perform Workspace Detection
2. Confirm this is a greenfield project
3. Initialize audit.md and guide-state.md
4. Present completion message

Then STOP and WAIT for my response.

---

# 🎯 FINAL GOAL

Build a polished, production-grade e-commerce platform that:

* Feels like a real startup product
* Has clean architecture
* Has a premium UI
* Includes a memorable mascot (Zeno)
* Is suitable for resume evaluation and demonstration"
**AI Response**: "Displayed the welcome message, completed the workspace detection, identified the project as Greenfield, initialized guide-docs/guide-state.md, and recorded the first audit log."
**Context**: DISCOVER - Workspace Detection

---
## Requirements Analysis User Input
**Timestamp**: 2026-04-21T10:38:00Z
**User Input**: "Proceed to Requirements Analysis.
Keep scope minimal and production-ready.
Do not over-engineer."
**AI Response**: "Created requirement-verification-questions.md to gather needed details before generating the final requirements document."
**Context**: DISCOVER - Requirements Analysis

---
## Requirements Analysis Completion
**Timestamp**: 2026-04-21T16:11:00Z
**User Input**: "Resume session from previous state. Workspace detection was already completed. Project is a greenfield ecommerce system (Zenvyra). Proceed to Requirements Analysis. Constraints: - Keep scope minimal and production-ready - Avoid over-engineering - Focus on core features (auth, products, cart, orders) - Follow workflow strictly and wait for approval at each stage"
**AI Response**: "Generated guide-docs/discover/requirements/requirements.md reflecting the core features and minimal scope, updated guide-state.md, and prompted for user review."
**Context**: DISCOVER - Requirements Analysis

---
## Requirements Analysis - Changes & Workflow Planning Completion
**Timestamp**: 2026-04-21T16:15:00Z
**User Input**: "Request Changes: Keep Admin Panel minimal... Razorpay: Use test mode only... Focus strictly on core flow... Avoid over-engineering... Once updated, proceed to next phase. Do NOT include User Stories stage."
**AI Response**: "Updated requirements.md with strict anti-over-engineering constraints and minimal admin/razorpay integrations. Skipped User Stories. Generated guide-docs/discover/plans/execution-plan.md for the Workflow Planning phase. Updated guide-state.md to reflect stages to execute. Prompted for review."
**Context**: DISCOVER - Workflow Planning

---
## Application Design Completion
**Timestamp**: 2026-04-21T16:20:00Z
**User Input**: "Approve & Continue. Additional constraints: Keep Application Design simple and implementation-focused... Avoid introducing unnecessary abstraction layers... Ensure frontend and backend responsibilities are clearly separated... Maintain consistency... Proceed to Application Design."
**AI Response**: "Generated components.md, component-methods.md, services.md, and component-dependency.md under guide-docs/discover/application-design/. Maintained clear separation boundaries matching Next.js App Router and FastAPI service injection avoiding additional microservices. Recorded completion in guide-state.md and prompted for review."
**Context**: DISCOVER - Application Design

---
## Units Planning Completion
**Timestamp**: 2026-04-21T16:25:00Z
**User Input**: "Approve & Continue. Ensure the following during implementation: - Order lifecycle is clearly defined... - All protected routes require JWT authentication... - Product schema is clearly defined and consistent... - Admin functionality is minimal... - Maintain clean separation... Proceed to Units Planning."
**AI Response**: "Generated guide-docs/discover/plans/unit-of-work-plan.md documenting the functional breakdowns and validating the strict execution constraints. Recorded completion in guide-state.md and prompted for review before generation."
**Context**: DISCOVER - Units Planning

---
## Units Planning - Refined
**Timestamp**: 2026-04-21T16:28:00Z
**User Input**: "Request Changes: Refine the Unit of Work Plan to define actual implementation units instead of document generation tasks... explicitly include Backend Units, Frontend Units, API endpoints, database tables... Avoid document-heavy abstraction and focus on actual buildable units."
**AI Response**: "Overwrote guide-docs/discover/plans/unit-of-work-plan.md to explicitly break down the frontend (F1-F6) and backend (B1-B4) units, mapping API endpoints, tables, and services. Skipped story mappings as requested and prompted for plan review."
**Context**: DISCOVER - Units Planning

---
## Units Generation Completion
**Timestamp**: 2026-04-21T16:30:00Z
**User Input**: "Approve & Continue. Ensure during implementation: - Order status is clearly defined (pending, paid, failed) - Admin routes enforce role-based access - Cart is always scoped to user_id... Proceed to Units Generation."
**AI Response**: "Generated guide-docs/discover/application-design/unit-of-work.md and unit-of-work-dependency.md embedding the strict rules over cart usage, explicit order statuses, explicit admin authorization barriers, and basic repository structuring. Updated checkmarks and guide-state.md. Prompted for phase transition to BUILD."
**Context**: DISCOVER - Units Generation

---
## Functional Design Completion
**Timestamp**: 2026-04-21T16:32:00Z
**User Input**: "Approve & Continue. Ensure during implementation: - Order status uses strict enum... - JWT handling is consistent... - API responses follow a consistent structure... Proceed to BUILD PHASE: Functional Design."
**AI Response**: "Created zenvyra-core-functional-design-plan.md, domain-entities.md (with strict Enum typing and db models), business-rules.md (API/JWT/Cart boundary constraints), and business-logic-model.md mapping the full Razorpay handshake orchestration. Updated guide-state.md to reflect BUILD phase progress."
**Context**: BUILD - Functional Design

---
## Code Planning Completion
**Timestamp**: 2026-04-21T16:38:00Z
**User Input**: "Approve & Continue. Ensure during implementation: Monetary values use precise types (Decimal preferred). API response structure remains consistent... Product stock is reduced after successful order payment. Maintain strict validation... Proceed to Code Planning."
**AI Response**: "Created implementation_plan.md artifact and guide-docs/build/plans/zenvyra-core-code-generation-plan.md breaking the generation down into 12 explicit steps spanning backend configuration, services, order reduction, and Next.js frontend interfaces. Updated guide-state.md to reflect Code Planning completion."
**Context**: BUILD - Code Planning

---
