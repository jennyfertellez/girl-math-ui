# GirlMath

GirlMath is a personal finance tool built for first-generation individuals who are breaking the cycle of financial survival mode. It helps users get out of debt, plan their savings goals, and start investing in their future.

## 🧠 The Problem
First-generation individuals are often the first in their families to navigate credit card debt, student loans, and long-term financial planning — without a safety net, without guidance, and without tools built for their reality. Most financial apps assume a baseline of financial literacy that many of us simply weren't taught.
GirlMath was built from personal experience. The snowball method helped me pay off most of my credit card debt. When one creditor sued me, I realized how many people are in the same position with no roadmap out. This app is that roadmap.

## 👤 Who It's For
First-generation individuals who are:
* Carrying credit card debt, student loans, or medical bills
* Wanting to save for a home, emergency fund, or future investment
* Ready to stop surviving and start planning

## ✨ Features (v1)
### 💳 Debt Tracker
Add and manage all your debts in one place — credit cards, student loans, medical bills, and more. Track balances, interest rates, and minimum payments.

### ❄️ Snowball Calculator
The debt snowball method, visualized. Enter your debts and an optional extra monthly payment, and GirlMath generates a month-by-month payoff timeline with a live chart showing exactly when each debt hits zero.

### 🏦 Savings Goals
Set savings goals (home down payment, emergency fund, etc.), track your progress, and see your projected completion date based on your monthly contributions.

### 📊 Financial Dashboard
A single view of your complete financial picture — total debt, months to debt-free, total saved, and savings goal progress all in one place.

## 🏗️ Technical Architecture
### Backend — Spring Boot API
* Java 17 + Spring Boot 3.x
* Spring Data JPA + Hibernate for ORM
* Spring Security for API protection
* PostgreSQL for relational data storage
* RESTful API design with full CRUD operations
* Maven for dependency management

### Frontend — React
* React 18 with functional components and hooks
* React Router for client-side navigation
* Recharts for interactive debt payoff visualizations
* Axios for API communication

### DevOps
* Git + GitHub for version control
* Separate frontend/backend repositories
* Local Docker support planned for v2

## 🔌 API Endpoints

| Method | Endpoint |
| :--- | :--- |
| `GET` | `/api/dashboard` |
| `GET/POST/PUT/DELETE` | `/api/debts` |
| `GET/POST/PUT/DELETE` | `/api/savings-goals` |
| `GET` | `/api/snowball/calculate?extraPayment=0` |
| `GET` | `/api/savings-projection` |
| `GET` | `/api/savings-projection/{id}` |

## 🚀 Running Locally
Prerequisites
* Java 17
* Maven
* PostgreSQL
* Node.js + npm

### Backend Setup
```
# Clone the repo
git clone https://github.com/jennyfertellez/girlMath.git
cd girlMath

# Create the database
psql -d postgres -c "CREATE DATABASE girlmath;"

# Update application.properties with your PostgreSQL username
# Then run the app
mvn spring-boot:run
```

### Frontend Setup
```
# Clone the frontend repo
git clone https://github.com/jennyfertellez/girl-math-ui.git
cd girl-math-ui

# Install dependencies
npm install

# Start the app
npm start
```
The app will be running at `http://localhost:3000` with the API at `http://localhost:8080`.

## 💡 Why I Built This
I used the debt snowball method to pay off most of my credit cards. I know what it feels like to get a lawsuit from a creditor. I know what it feels like to not have anyone in your family to ask about APR, credit scores, or down payments.
GirlMath is the tool I wish I had. And I built it because I know I'm not alone.

## 👩‍💻 Built By
Jennifer Tellez — Software Engineer

[GitHub](https://github.com/jennyfertellez) • [LinkedIn](https://www.linkedin.com/in/jennifer-tellez-vera/)