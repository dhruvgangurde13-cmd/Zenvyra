# Requirements Clarification Questions

Please answer the following questions to help clarify the requirements for Zenvyra, keeping the minimal, production-ready scope in mind.

## Question 1
For user authentication (JWT), which login methods should be supported?

A) Email and Password only
B) Email and Password + Google OAuth
C) Magic Links (Passwordless)
X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 2
How should the Admin Panel be structured?

A) Integrated within the Next.js frontend under an `/admin` route (role-based access)
B) A completely separate, lightweight frontend application
C) Re-use FastAPI's auto-generated Swagger UI / Admin integration for now
X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 3
Regarding the shopping cart and checkout, should we support guest checkout?

A) Yes, users can checkout without creating an account
B) No, users must be logged in to complete a purchase
X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 4
For the "Product catalog," what level of filtering is required initially?

A) Basic (by category and price range)
B) Advanced (category, price, tags, sorting by popularity/newest)
C) Minimal (just category grouping and text search)
X) Other (please describe after [Answer]: tag below)

[Answer]:
