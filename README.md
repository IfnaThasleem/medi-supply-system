# Medicine Distribution System For Agency

This is a web-based intranet application developed as a final year project for automating the operations of a medicine-distributing agency. It handles inventory, employee roles, client orders, real-time delivery tracking, and financial reporting.



 Features

- 🔐 **Role-Based Access** – Admin and Employee logins with permissions
- 💊 **Inventory Management** – Add, update, delete medicines and track stock levels
- 🛒 **Order Processing** – Place, edit, and fulfill pharmacy orders
- 🚚 **Real-Time Delivery Tracking** – Google Maps API integration with live vehicle location
- 💵 **Payment Integration** – Online payments , Cash on Delivery (COD)
- 📄 **PDF Reports** – Auto-generated reports for income, expenses, and stock
- 📦 **Client Management** – Manage pharmacies and shop clients


⚙️ Technology Stack

| Layer      | Tech Used                          |
|------------|------------------------------------|
| Frontend   | HTML5, CSS3, JavaScript, React.js, Bootstrap 
| Backend    | Node.js, Express.js,      
| Database   |  mySql              
| APIs       | Google Maps API  
| Auth       | JWT (JSON Web Tokens)              
| Deployment | XAMPP (local)
| PDF Report | jsPDF              

📁 Project Structure

/frontend
└── React Components (UI)

/backend
├── routes/
├── controllers/
├── models/
└── server.js

/database
└── MySqlcollections (Medicines, Users, Orders, Payments)


**Navigate to backend and frontend directories**
cd backend
npm install

cd ../frontend
npm install


**Start the backend and frontend**
cd backend
npm start

cd ../frontend
npm start


**Clone the repository**
   ```bash
   git clone https://github.com/IfnaThasleem/medi-supply-system.git


