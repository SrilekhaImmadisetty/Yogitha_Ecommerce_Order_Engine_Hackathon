# 🛒 E-Commerce Order Engine (CLI-Based Backend System)

A backend-focused simulation of an e-commerce order processing system built using **Node.js**, designed to demonstrate real-world backend engineering concepts such as **inventory management, concurrency control, event-driven architecture, and fault tolerance**.

---

## 🚀 Overview

This project simulates the core backend logic of an e-commerce platform, including:

* Product and inventory management
* Cart and stock reservation
* Order placement with concurrency control
* Payment processing (event-driven)
* Failure handling and rollback
* Logging, fraud detection, and reservation expiry

The system is implemented as a **CLI-based application** with an in-memory datastore, focusing on **system design principles over UI**.

---

## 🧠 Key Features

### 🔹 Inventory Management

* Tracks `totalStock`, `reservedStock`, and `availableStock`
* Prevents overselling using reservation logic

### 🔹 Cart System

* Supports multiple users
* Dynamically reserves and releases stock

### 🔹 Concurrency Control

* Uses a locking mechanism to avoid race conditions

### 🔹 Order Processing

* Atomic order placement with rollback support
* State machine for order lifecycle:

  ```
  CREATED → PENDING_PAYMENT → PAID / FAILED
  ```

### 🔹 Event-Driven Architecture

* Decoupled services using an internal Event Bus
* Example flow:

  ```
  ORDER_CREATED → PAYMENT_SERVICE → PAYMENT_SUCCESS / FAILED → ORDER_SERVICE
  ```

### 🔹 Idempotency

* Prevents duplicate order creation using idempotency keys

### 🔹 Failure Injection

* Simulates real-world failures in payment and order processing

### 🔹 Reservation Expiry

* Automatically releases reserved stock after a timeout

### 🔹 Logging System

* Timestamped logs for audit and debugging

### 🔹 Fraud Detection

* Detects suspicious behavior (e.g., too many orders in a short time)

---

## 🏗️ Project Structure

```
ecommerce-engine/
│
├── index.js
│
├── data/
│   └── store.js
│
├── models/
│   ├── product.js
│   ├── cart.js
│   └── order.js
│
├── services/
│   ├── productService.js
│   ├── cartService.js
│   ├── orderService.js
│   ├── paymentService.js
│   ├── inventoryService.js
│   ├── fraudService.js
│
├── core/
│   ├── eventBus.js
│   ├── lockManager.js
│   ├── transactionManager.js
│   ├── stateMachine.js
│   ├── idempotencyManager.js
│   ├── failureInjector.js
│
├── schedulers/
│   └── expiryScheduler.js
│
├── utils/
│   └── logger.js
│
├── events/
│   └── eventTypes.js
```

---

## ⚙️ How to Run

### 1. Clone the repository

```bash
git clone <your-repo-link>
cd ecommerce-engine
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the application

```bash
node index.js
```

---

## 🧪 Example Flow

```bash
# Add product
# Add to cart
# Place order

node index.js
```

### Sample Output

```
[2026-...] Processing payment for order_1
[2026-...] Order order_1 marked as PAID

Order Success: { ... }

All Orders: [ ... ]
```

---

## 🧩 Concepts Demonstrated

* System Design Fundamentals
* Event-Driven Architecture
* Concurrency Handling
* Transaction Rollback
* Idempotency
* Fault Injection & Testing
* Observability (Logging)

---

## 🔮 Future Improvements

* Add REST API using Express.js
* Integrate database (MongoDB / PostgreSQL)
* Add frontend (React)
* Convert into microservices architecture

---

## 📌 Author

**Yogitha**
Computer Science Student | Backend Enthusiast

---

## ⭐ Why This Project Matters

This project goes beyond basic CRUD applications and demonstrates **real-world backend engineering thinking**, making it a strong addition to a developer portfolio and useful for technical interviews.
