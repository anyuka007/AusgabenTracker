# AusgabenTracker


**EN**  A pure ***backend project*** as a part of the Web Development course by DCI (Digital Career Institute) using Express.js and Mongoose.
Expense Tracker helps users keep track of and analyze their finances.
With this app it is possible not only to create, edit, delete and view expenses, but also to sort, filter and get overall statistics.


**DE**  Ein rein ***Backend-Projekt*** im Rahmen des Kurses "Web Development" bei DCI (Digital Career Institute) mit Express.js und Mongoose.
Ausgaben-Tracker hilft den Benutzern, ihre Finanzen im Blick zu behalten und zu analysieren.
Mit dieser App ist es möglich Ausgaben nicht nur zu erstellen, zu ändern, zu löschen und anzusehen, sondern auch zu sortieren, zu filtern und eine Gesamtstatistik zu erhalten.

---

## Features

- Create, edit, delete, and view expenses
- Sort and filter expenses
- Generate overall statistics for better financial analysis

## Technologies Used

- **Backend Framework**: Express.js
- **Database**: MongoDB (via Mongoose)


## Usage

**API Endpoints**

***Expenses***:

- GET /expenses - Get all expenses
- POST /expenses - Create a new expense
- PUT /expenses/:id - Update an existing expense
- DELETE /expenses/:id - Delete an expense

***Category***:

- GET /categories - Get all categories
- POST /categories - Create a new category
- PUT /categories/:id - Update an existing category
- DELETE /categories/:id - Delete a category

***Total***:

- GET /expenses/total - Get total of expenses 
