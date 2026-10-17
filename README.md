# TravelMate 🌍 – Explore. Plan. Experience.

> **A Complete Full-Stack Smart Tourist Information & Travel Planning Platform**  
> Designed for travelers exploring India's premier destinations (Hyderabad, Goa, Mumbai, and Jaipur). Built as an interview-ready, production-grade academic project.

---

## 📌 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Key Features](#key-features)
4. [System Architecture](#system-architecture)
5. [Database Schema (MySQL)](#database-schema-mysql)
6. [REST API Documentation](#rest-api-documentation)
7. [Local Setup & Running Guide](#local-setup--running-guide)
8. [Software Engineering & Interview Highlights](#software-engineering--interview-highlights)

---

## 🌟 1. Project Overview

**TravelMate** is a full-stack web application that solves the fragmented travel planning experience. Instead of switching between disparate apps for sightseeing information, budget stays, street food recommendations, local shopping bazaars, packing checklists, and currency conversion, TravelMate unifies everything into one seamless, responsive platform.

### Core Value Proposition:
- **Verified Discovery**: Real-world curated destinations for Hyderabad, Goa, Mumbai, and Jaipur with verified entry fees, operating hours, best times to visit, and insider travel tips.
- **Budget-First Accommodations**: Backpacker hostels, authentic homestays, and budget hotels categorized with transparent indicative rates and amenities.
- **Street Food & Culinary Heritage**: City signature dishes (Hyderabadi Biryani & Haleem, Mumbai Pav Bhaji & Vada Pav, Goan Fish Curry, Jaipur Pyaaz Kachori) with diet filters (Pure Veg / Non-Veg).
- **Day-by-Day Itinerary Planner**: Interactive day timelines with drag/order sequence, budget allocation tracking, and personal activity notes.
- **Travel Utilities**: Real-time currency converter, trip expense calculator, weather forecasts, regional travel phrasebook (Hindi, Telugu, Marathi, Konkani), and database-persisted packing checklist.

---

## 💻 2. Technology Stack

### Frontend
- **Framework**: React 19 with Vite 6
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (configured with automated JWT Bearer interceptor)
- **Icons**: Lucide React
- **Design System**: Modern CSS3 responsive design with Light Slate background (`#f8fafc`), Deep Navy headings (`#0f172a`), and Teal/Emerald accents (`#0f766e`, `#0d9488`).
- **Responsive Layout**: Fluid grids and drawer navigation for Mobile, Tablet, and Desktop.

### Backend
- **Language**: Java 17 (LTS) / Java 21+
- **Framework**: Spring Boot 3.5.x
- **Build Tool**: Apache Maven
- **Security**: Spring Security 6 with stateless JWT (JSON Web Token) authentication
- **Password Encryption**: BCrypt hashing
- **Data Persistence**: Spring Data JPA / Hibernate (Dialect: MySQL)
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Size`, `@Email`)

### Database
- **Engine**: MySQL 9.7 / MySQL 8.x
- **Database Name**: `travelmate`
- **Port**: `3306`
- **Seeding**: Automated, idempotent `CommandLineRunner` that populates rich seed records on initial boot without creating duplicates on restarts.

---

## 🚀 3. Key Features

| Module | Features Included |
| :--- | :--- |
| **Homepage** | Hero search bar with destination & category filters, city cards, popular attractions, budget stays preview, local food showcase, top markets, 4-pillar feature grid, and CTA banner. |
| **Explore Destinations** | Search by keyword, filter by category (*Historical, Beaches, Nature, Adventure, Religious, Cultural*), entry fee filter, sort by rating/name/fee, pagination/load more. |
| **Destination Details** | High-res photography, complete description, visiting hours, ticket prices, best visiting months, insider tips, Google Maps directions, Add to Trip button, and Favorite toggle. |
| **Budget Stays** | Search by property or city, filter by accommodation type (*Hostel, Hotel, Homestay, Guesthouse*), price per night filter, amenities list, external booking provider search. |
| **Local Food & Dining** | Signature city dishes, street food vs iconic restaurants, diet indicator (*Pure Veg, Non-Veg, Both*), indicative price range, must-try dishes, Google Maps navigation. |
| **Markets & Shopping** | Local bazaars, handicrafts, clothing, jewelry/souvenirs, price level tags (*Budget, Moderate, Premium*), operating hours, famous specialties. |
| **Day-by-Day Trip Planner** | User-private trips with start/end date validation, Day 1 to Day N tabs, activity timeline with start/end time, estimated cost, custom notes, budget allocation progress bar. |
| **Favorites & Saved Places** | Instant optimistic UI heart toggle across cards, tabbed view (*All, Places, Stays, Food, Markets*), persistent database storage per user. |
| **Travel Tools** | Currency Converter (benchmark rates with timestamp), Trip Budget Calculator (daily & per-traveler breakdown), Packing Checklist (DB-persisted with category filtering), Weather Forecast, Regional Phrasebook, Safety & Emergency Guide (112, 1091, 108). |
| **Authentication & Security** | JWT-based authentication, BCrypt password encryption, protected user routes, current user profile endpoint (`/api/auth/me`). |

---

## 🏛️ 4. System Architecture

```text
[ React 19 Frontend (Port 5173) ]
           │
           │ HTTP / REST with Axios (Bearer JWT)
           ▼
[ Spring Boot 3 Backend (Port 8080) ]
  ├── Security Filter Chain (JwtFilter -> UsernamePasswordAuthenticationFilter)
  ├── REST Controllers (/api/auth, /api/places, /api/trips, /api/favorites, etc.)
  ├── Service & Security Helper (AuthHelper)
  ├── Spring Data JPA Repositories
  └── Automated DataSeeder (Runs idempotently on boot)
           │
           │ JDBC (HikariCP)
           ▼
[ MySQL Database (Port 3306: travelmate) ]
  ├── users, cities, places, stays, food_places, markets
  └── trips, itinerary_items, favorites, packing_items
```

---

## 🗄️ 5. Database Schema (MySQL)

- **`users`**: `id`, `name`, `email` (UNIQUE), `password` (BCrypt), `role`, `created_at`
- **`cities`**: `id`, `name`, `state`, `country`, `description`, `image_url`, `latitude`, `longitude`
- **`places`**: `id`, `city_id` (FK), `name`, `description`, `category`, `entry_fee`, `opening_time`, `closing_time`, `best_time_to_visit`, `travel_tips`, `estimated_duration`, `address`, `rating`, `review_count`, `image_url`, `is_popular`, `is_trending`
- **`stays`**: `id`, `city_id` (FK), `name`, `description`, `type`, `price_per_night`, `address`, `rating`, `review_count`, `image_url`, `amenities`, `booking_url`, `is_budget_friendly`
- **`food_places`**: `id`, `city_id` (FK), `name`, `description`, `food_type`, `category`, `price_range`, `indicative_price`, `must_try_dish`, `address`, `opening_hours`, `rating`, `review_count`, `image_url`
- **`markets`**: `id`, `city_id` (FK), `name`, `description`, `category`, `price_level`, `famous_for`, `address`, `opening_time`, `closing_time`, `rating`, `review_count`, `image_url`, `map_url`
- **`trips`**: `id`, `user_id` (FK), `trip_name`, `destination`, `start_date`, `end_date`, `budget`, `notes`, `created_at`
- **`itinerary_items`**: `id`, `trip_id` (FK), `place_id`, `reference_id`, `item_type`, `title`, `location`, `day_number`, `start_time`, `end_time`, `estimated_cost`, `notes`, `sequence_no`
- **`favorites`**: `id`, `user_id` (FK), `item_type`, `item_id`, `title`, `subtitle`, `image_url`, `rating`, `price_info`, `city_name`, `created_at` *(UNIQUE constraint on `user_id + item_type + item_id`)*
- **`packing_items`**: `id`, `user_id` (FK), `category`, `item_text`, `is_checked`, `is_custom`, `created_at`

---

## 📡 6. REST API Documentation

Base URL: `http://localhost:8080/api`

### Public Endpoints:
- `GET /api/health` — Backend health status
- `GET /api/cities` — List all tourist destination cities
- `GET /api/places` — List places with filters (`search`, `cityId`, `category`, `maxBudget`, `sort`)
- `GET /api/places/{id}` — Destination details
- `GET /api/places/popular` — Popular tourist attractions
- `GET /api/places/trending` — Trending attractions
- `GET /api/stays` — Stays directory with filters (`cityId`, `type`, `minPrice`, `maxPrice`, `search`, `sort`)
- `GET /api/stays/{id}` — Stay details
- `GET /api/food` — Food spots with filters (`cityId`, `foodType`, `category`, `search`, `sort`)
- `GET /api/food/{id}` — Food spot details
- `GET /api/markets` — Markets with filters (`cityId`, `category`, `priceLevel`, `search`, `sort`)
- `GET /api/tools/weather?city={city}` — Weather forecast for destination
- `GET /api/tools/currency?from={from}&to={to}&amount={amount}` — Currency conversion
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token

### Authenticated User Endpoints (Requires `Authorization: Bearer <token>`):
- `GET /api/auth/me` — Current user profile with activity stats
- `GET /api/trips` — Get logged-in user's trips
- `POST /api/trips` — Create a new trip (validated dates & budget)
- `GET /api/trips/{id}` — Get trip details with itinerary items (user-scoped)
- `PUT /api/trips/{id}` — Update trip
- `DELETE /api/trips/{id}` — Delete trip
- `POST /api/trips/{tripId}/itinerary` — Add activity to trip day
- `PUT /api/trips/{tripId}/itinerary/{itemId}` — Update activity
- `DELETE /api/trips/{tripId}/itinerary/{itemId}` — Remove activity
- `GET /api/favorites` — Get user's saved favorites
- `GET /api/favorites/ids` — Quick lookup of saved item IDs for UI hearts
- `POST /api/favorites` — Save item to favorites
- `POST /api/favorites/toggle` — Instant toggle save/unsave
- `DELETE /api/favorites/{id}` — Remove favorite
- `GET /api/packing` — Get user's checklist (auto-seeds 20 defaults if empty)
- `POST /api/packing` — Add custom checklist item
- `PUT /api/packing/{id}` — Toggle checked/unchecked
- `DELETE /api/packing/{id}` — Delete custom item
- `POST /api/packing/reset` — Reset checklist to travel essentials

---

## 🛠️ 7. Local Setup & Running Guide

### Prerequisites:
1. **Java 17+** (`java -version`)
2. **Maven 3.8+** (`mvn -v`)
3. **Node.js 18+ and npm** (`node -v`, `npm -v`)
4. **MySQL Server** (Service running on port 3306)

### Step 1: MySQL Database Setup
Open PowerShell or your terminal and verify MySQL is running:
```powershell
# Create the database if it doesn't exist
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS travelmate;"
```
*Note: Credentials can be customized via environment variables (`DB_USER`, `DB_PASSWORD`, `DB_URL`) or in `backend/src/main/resources/application.properties`.*

### Step 2: Run the Spring Boot Backend
```powershell
cd backend
mvn spring-boot:run
```
The backend will compile, start Tomcat on port `8080`, and the automated `DataSeeder` will populate verified destinations for Hyderabad, Goa, Mumbai, and Jaipur.

Health check: [http://localhost:8080/api/health](http://localhost:8080/api/health)

### Step 3: Run the React + Vite Frontend
In a second terminal window:
```powershell
cd frontend
npm install
npm run dev
```
Open your browser at [http://localhost:5173](http://localhost:5173).

---

## 💡 8. Software Engineering & Interview Highlights

When presenting this project in software placement interviews or college viva evaluations, emphasize these technical design decisions:

1. **Stateless Authentication Architecture**:
   - Uses JWT tokens signed with a server secret key.
   - Spring Security does not create HTTP sessions (`SessionCreationPolicy.STATELESS`), allowing the backend to be horizontally scalable across multiple server instances without session replication.
2. **User Data Isolation & Ownership Validation**:
   - Private trips and favorites are scoped strictly by authenticated user ID (`findByIdAndUserId`). Attempting to view or delete another user's trip returns an HTTP 404/403, preventing Insecure Direct Object Reference (IDOR) vulnerabilities.
3. **Optimistic UI Updates in React**:
   - Favorite heart toggling updates local React state immediately for instantaneous user feedback, while simultaneously making the backend API request. If the network call fails, the state automatically rolls back.
4. **Database Relational Integrity**:
   - JPA entity relationships (`@ManyToOne`, `@OneToMany` with `orphanRemoval = true` and `CascadeType.ALL`) ensure that deleting a trip cleanly cascades to its itinerary items without leaving orphaned records.
5. **Idempotent Data Seeding**:
   - `DataSeeder` utilizes query checks (`existsByNameIgnoreCase`, `count() > 0`) before inserting records, ensuring seamless application restarts without duplicating seed rows.
6. **Robust Input Validation**:
   - Bean Validation on the backend (`@DecimalMin`, `@NotBlank`, date sequence checks) coupled with HTML5 and JavaScript validation on the frontend guarantees clean data integrity.

---

### Developed By
**Computer Science & Engineering Student**  
Academic Capstone Project · Academic Year 2025–2026
