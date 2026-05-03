# Component Dependencies & Orchestration

```mermaid
flowchart TD
    %% Base Architecture
    subgraph Frontend [Next.js App Router (Client/React Focus)]
        subgraph UI [Presentation Layer]
            L(RootLayout) --> H(Hero Section)
            L --> P(ProductGrid)
            L --> CD(CartDrawer)
            L --> CO(CheckoutFlow)
            L --> A(AdminDashboard)
            
            H -.-> Mascot((Zeno Mascot))
            P -.-> Mascot
        end
        
        subgraph Hooks [State & API Integration]
            UI -.-> auth[useAuth]
            UI -.-> prod[useProducts]
            UI -.-> cart[useCart]
            UI -.-> check[initiatePayment]
        end
    end

    subgraph Backend [FastAPI Server]
        subgraph Routers [HTTP Layer]
            AR(AuthRouter)
            PR(ProductRouter)
            CR(CartRouter)
            OR(OrderRouter)
        end
        
        subgraph Services [Business Logic]
            AS(AuthService)
            PS(ProductService)
            CS(CartService)
            OS(Order & PaymentService)
        end
        
        subgraph DB Layer [Data Models & PostgreSQL]
            DB[(PostgreSQL)]
        end
        
        %% External Integration
        RZ[Razorpay Sandbox/Test]
    end

    %% Network interactions
    auth ---> AR
    prod ---> PR
    cart ---> CR
    check ---> OR

    %% Internal routing to services
    AR ---> AS
    PR ---> PS
    CR ---> CS
    OR ---> OS

    %% Database interaction
    AS ---> DB
    PS ---> DB
    CS ---> DB
    OS ---> DB

    %% External Call
    OS <-->|Test Mode| RZ

    %% Styling
    style Frontend fill:#E3F2FD,stroke:#1E88E5
    style Backend fill:#E8F5E9,stroke:#43A047
    style DB Layer fill:#ECEFF1,stroke:#607D8B
    style Mascot fill:#FFF9C4,stroke:#FBC02D,color:#000
    style RZ fill:#F3E5F5,stroke:#8E24AA
```

## Communication Patterns
- **Frontend -> Backend**: REST API via Fetch/Axios. Auth headers (JWT) passed dynamically for protected requests.
- **Backend Orchestration**: Routers are synchronous validation layers; Services execute data transactions. No complex message queues.
- **Payment Verification**: Synchronous. Frontend confirms payment intent, loads Razorpay script, and submits Success payload back to OrderRouter to confirm completion.
