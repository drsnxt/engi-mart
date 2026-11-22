# ENGI-MART

**AI-Powered Engineering Component Discovery & Local Price Optimization**

> An Industry 4.0 project — a smart platform for engineering students that connects
> local suppliers, digital inventory, price intelligence and AI-driven recommendations.

---

## Table of Contents

1. [The Problem](#1-the-problem)
2. [Our Solution](#2-our-solution)
3. [Core Features](#3-core-features)
4. [Example User Journey](#4-example-user-journey)
5. [AI Assistant](#5-ai-assistant)
6. [Smart Price & Shop Optimization](#6-smart-price--shop-optimization)
7. [Why Industry 4.0?](#7-why-industry-40)
8. [System Architecture](#8-system-architecture)
9. [Technology Stack](#9-technology-stack)
10. [Data Flow](#10-data-flow)
11. [What Makes It Different?](#11-what-makes-it-different)
12. [Challenges & Engineering Solutions](#12-challenges--engineering-solutions)
13. [Future Scope](#13-future-scope)
14. [Expected Impact](#14-expected-impact)
15. [Conclusion](#15-conclusion)

---

## Overview

| Item | Detail |
| --- | --- |
| **Project name** | ENGI-MART |
| **Theme** | Industry 4.0 |
| **Tagline** | AI-Powered Engineering Component Discovery & Local Price Optimization |
| **Audience** | Engineering students, local component suppliers, colleges |
| **Form** | Web platform (student app + shop-owner dashboard + AI layer) |
| **Core idea** | Search, compare and optimize the purchase of engineering components from nearby shops |

ENGI-MART is a smart Industry 4.0 platform for engineering students. It brings
together **AI**, **digital inventory**, **price intelligence**, **local suppliers**
and **smart recommendations** in a single place, so that buying components for a
project becomes a guided, optimized decision instead of a hunt across multiple shops.

---

## 1. The Problem

Engineering students face a **fragmented purchasing process** when buying parts for
their projects.

- **Multiple shops, multiple trips.** Finding Arduino boards, ESP32 modules, sensors,
  ICs, wires and other project materials often requires visiting several shops in
  different locations.
- **Unpredictable prices and availability.** Prices and stock levels vary from one
  local supplier to another, and there is no single place to compare them.
- **Specification confusion.** Students may not know which model, specification or
  substitute is appropriate for their project.
- **Online marketplaces fall short.** Listings online may not reflect *nearby* stock,
  *local* prices or *immediate* availability.
- **The result:** wasted time, unnecessary travel, wrong components and a higher
  overall project cost.

**In short:** the information needed to make a good purchasing decision is scattered,
outdated or simply unavailable to the student at the moment of purchase.

---

## 2. Our Solution

**One platform connecting engineering students, local suppliers and AI.**

| Capability | What it does |
| --- | --- |
| **Search** | Find components, stationery, tools and project materials. |
| **Compare** | Compare price, distance, availability and specifications side by side. |
| **AI Advisor** | Ask natural-language questions about models, brands and substitutes. |
| **Project Builder** | Enter a project idea and receive a component list (BOM). |
| **Smart Purchase** | Find a practical combination of nearby shops with a low total cost. |

The platform does not just answer "where can I buy this?" — it answers
"what exactly should I buy, from which shops, and why is that the best option?"

---

## 3. Core Features

Built specifically for engineering purchases.

- **Engineering-focused catalog.** Arduino, ESP32, Raspberry Pi, sensors, ICs,
  transistors, displays, motors, tools, stationery and more — organized around how
  engineering students actually shop, not around generic e-commerce categories.
- **Nearby shop discovery.** Uses location and map services to show suppliers around
  the student's campus or current location.
- **Flexible sorting.** Sort results by lowest price, nearest shop, availability or
  combined value.
- **AI product advisor.** Answers questions about specifications, compares brands and
  models, and suggests substitutes when an item is unavailable or over budget.
- **Shop-owner dashboard.** Allows local suppliers to update their stock and prices,
  keeping the catalog current.
- **Crowd-verified data.** Student feedback and bill-based price verification help
  improve the quality and trustworthiness of local price data.

---

## 4. Example User Journey

**From project idea to optimized shopping plan.**

1. **Project:** *Smart Plant Watering*
2. **AI generates BOM** — the system breaks the idea into required components
   (microcontroller, soil moisture sensor, water pump, relay, tubing, power supply, etc.).
3. **Checks nearby shops** — availability and distance are pulled from local supplier data.
4. **Compares price + stock** — each component is matched against real listings.
5. **Suggests alternatives** — compatible substitutes are proposed where an item is
   missing, costly or poorly rated.
6. **Final purchase plan** — the student receives a concrete list of shops, items,
   quantities, total cost and alternatives.

The journey converts a vague idea ("I want to build a plant watering system") into an
actionable, cost-aware shopping plan in a few steps.

---

## 5. AI Assistant

**A conversational engineering purchasing advisor.**

> **Example query:** "I need a Wi-Fi microcontroller for an IoT project under ₹500."

The assistant responds by:

- **Analyzing requirements** — Wi-Fi, GPIO count, power needs, compatibility, budget
  and availability.
- **Explaining trade-offs** — instead of blindly declaring one product "best," it
  explains what the student gains and gives up with each option.
- **Suggesting alternatives** — compatible options when a requested item is
  unavailable, discontinued or outside the budget.
- **Generating a BOM** — a Bill of Materials produced from a natural-language project
  description, ready for price and stock comparison.

The emphasis is on **grounded, explainable guidance**: recommendations are tied to
component specifications and verified supplier data, not generic chatbot answers.

---

## 6. Smart Price & Shop Optimization

**The platform can optimize the whole basket, not just one item.**

| Stage | Description |
| --- | --- |
| **Input** | Required components + budget + preferred travel distance. |
| **Optimization** | Compare supplier combinations, stock and prices across shops. |
| **Output** | Suggested shops + total cost + alternatives. |

**Example:** Component **A** is cheapest at **Shop 1**, but components **B** and **C**
are cheaper together at **Shop 2**. Buying everything from one shop is simple, but not
always the lowest total cost — and visiting three shops may not be worth the travel.

The system can therefore present several **purchase plans**:

- **Lowest cost** — minimize total basket price.
- **Fewest shops** — minimize the number of trips.
- **Nearest option** — minimize travel distance.
- **Balanced option** — a practical trade-off between cost, distance and availability.

This basket-level optimization is what separates ENGI-MART from a simple price
comparison site.

---

## 7. Why Industry 4.0?

The project becomes an Industry 4.0 application when it **connects data, suppliers and
intelligent decision-making**.

| Pillar | How ENGI-MART applies it |
| --- | --- |
| **AI / ML** | Recommendation, component matching and intelligent assistance. |
| **Data Analytics** | Local price trends and purchasing patterns. |
| **Automation** | Automatic BOM generation and supplier comparison. |
| **Digital Supply Chain** | Connects demand from students with local supply. |
| **Connected Data** | Digital shop inventory, prices and availability. |
| **Smart Decision Support** | Optimizes purchasing under real-world constraints. |

Together these pillars form a small but complete **connected, intelligent supply
ecosystem** rather than an isolated shopping website.

---

## 8. System Architecture

**A layered design from interface to data.**

| Layer | Responsibility |
| --- | --- |
| **Frontend** | Responsive web application for students and shop owners. |
| **Backend** | User accounts, product catalog, shop database, price/stock records and project BOMs. |
| **AI layer** | Natural-language understanding, component matching, recommendations and substitute suggestions. |
| **Location layer** | Nearby shop discovery, distance calculation and map display. |
| **Optimization layer** | Basket-cost and multi-shop selection. |
| **Database** | Engineering component specifications + local supplier information. |

Each layer is independently replaceable: for example, the AI layer can start with
rule-based matching and later move to a hosted LLM, and the optimization layer can
evolve from a simple greedy search to a proper constrained optimizer.

---

## 9. Technology Stack

**A practical stack for an engineering-student prototype.**

| Area | Technology |
| --- | --- |
| **Frontend** | HTML • CSS • JavaScript / React |
| **Backend** | Python FastAPI / Flask or Node.js |
| **Database** | PostgreSQL / Firebase |
| **AI** | Python + ML/NLP + an LLM API |
| **Maps** | Maps / location API |
| **Deployment** | Cloud hosting + GitHub |

The stack is intentionally approachable: it can be built and demoed by a small student
team while leaving room to scale into a production system.

---

## 10. Data Flow

**From search to smart purchase recommendation.**

1. **Student searches** for an item or describes a project.
2. **System identifies** the required components and their specifications.
3. **Backend retrieves** supplier price, stock and location data.
4. **AI checks compatibility** and proposes alternatives where needed.
5. **Optimization ranks** purchase plans according to the selected criteria
   (cost, distance, number of shops, availability).
6. **Website displays** shops, prices, distance, availability and the reasoning behind
   each recommendation.

The final screen is not just a list of products — it is a **decision with an
explanation**.

---

## 11. What Makes It Different?

**An engineering-specific, local-first approach.**

- **Not just an online store** — it is an engineering-specific decision-support platform.
- **Not just a component database** — it connects specifications to real local
  availability.
- **Not just price comparison** — it can optimize the entire project shopping basket.
- **Not just an AI chatbot** — recommendations are grounded in component
  specifications and supplier data.
- **Local-first** — useful even when students need to buy components *immediately*
  from nearby shops.

Existing platforms optimize for catalog breadth or delivery speed. ENGI-MART
optimizes for the **student's actual constraint set**: budget, travel, urgency and
technical compatibility.

---

## 12. Challenges & Engineering Solutions

**Addressing data accuracy, AI reliability and trust.**

| Challenge | Engineering solution |
| --- | --- |
| **Real-time prices** | Shop dashboard + verified student bills + timestamped updates. |
| **Stock accuracy** | Shop confirmation, expiry of stale listings and availability confidence. |
| **Wrong AI recommendations** | Use specification constraints and retrieval from verified data. |
| **Multiple suppliers** | Optimization algorithm compares total basket cost and travel. |
| **Trust** | Show source, update time, specifications and confidence instead of hiding uncertainty. |

The guiding principle is **transparency over false certainty**: every price and
recommendation carries its source and freshness, so students can judge how much to
rely on it.

---

## 13. Future Scope

**Scaling the platform beyond the prototype.**

- Campus-wide engineering inventory and lab-equipment integration.
- Automatic price trend alerts and bulk-purchase suggestions.
- Verified local supplier profiles and ratings.
- Project kits generated from a student's syllabus or PBL topic.
- AR / image-assisted component identification from a photo.
- Integration with fabrication, PCB assembly, 3D printing and repair services.
- Expansion to multiple colleges and cities.

Each item extends the same core loop — *identify components → connect local supply →
optimize purchase* — into new services and geographies.

---

## 14. Expected Impact

**Value for students, suppliers and the local ecosystem.**

| Actor | Impact |
| --- | --- |
| **Students** | ⏱ Reduce time spent searching for components. |
| **Students** | 💰 Help compare local prices and reduce project cost. |
| **Students** | 🔧 Reduce wrong-component purchases. |
| **Suppliers** | 🏪 Give local engineering suppliers a digital channel. |
| **Ecosystem** | 🤖 Bring AI-assisted engineering decisions to students. |
| **Ecosystem** | 🌐 Build a connected local engineering supply ecosystem. |

The impact is twofold: immediate practical savings for students, and a digital
on-ramp for small local suppliers who currently have no online presence.

---

## 15. Conclusion

ENGI-MART turns a fragmented component-search problem into a **connected, intelligent
engineering ecosystem**.

```
Student → Project requirement → AI-generated BOM → Local supplier data
        → Price/stock comparison → Smart purchase plan
```

- **Primary theme:** Industry 4.0
- **Supporting technologies:** AI/ML, digital supply chain, data analytics, location
  services and web technology.
- **Prototype goal:** start with **one college/city and a focused catalog**, then scale.

By combining specification-aware AI with real local inventory and basket-level
optimization, ENGI-MART aims to make engineering purchasing faster, cheaper and more
reliable — starting small, and designed to grow.

---

## Appendix — Presentation Map

| # | Section | One-line summary |
| --- | --- | --- |
| 1 | The Problem | Fragmented, opaque local purchasing for student projects. |
| 2 | Our Solution | Search, compare, AI advice, project builder, smart purchase. |
| 3 | Core Features | Engineering catalog, nearby shops, AI advisor, shop dashboard. |
| 4 | User Journey | Project idea → BOM → shops → price/stock → alternatives → plan. |
| 5 | AI Assistant | Requirements, trade-offs, substitutes, BOM generation. |
| 6 | Price & Shop Optimization | Optimize the whole basket across shops and travel distance. |
| 7 | Why Industry 4.0? | AI, analytics, automation, digital supply chain, decision support. |
| 8 | System Architecture | Frontend, backend, AI, location, optimization, database layers. |
| 9 | Technology Stack | React/JS, FastAPI/Flask/Node, PostgreSQL/Firebase, LLM, maps. |
| 10 | Data Flow | Search → identify → retrieve → verify → rank → display. |
| 11 | Differentiation | Engineering-specific, local-first, basket-level optimization. |
| 12 | Challenges | Data freshness, stock accuracy, AI grounding, trust. |
| 13 | Future Scope | Campus inventory, alerts, ratings, kits, AR, fabrication services. |
| 14 | Expected Impact | Time saved, cost reduced, fewer mistakes, digital suppliers. |
| 15 | Conclusion | One college/city first, then scale the connected ecosystem. |
