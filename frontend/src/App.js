import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Start from "./components/Start"; 
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import EmployeePage from "./components/EmployeePage";
import AddCustomerPage from "./components/AddCustomerPage";
import OrdersPage from "./components/OrdersPage"; 
import AddMedicinePage from "./components/AddMedicinePage";
import SettingsPage from "./components/SettingsPage";
import ReportsPage from "./components/ReportsPage";
import NotificationPage from "./components/NotificationPage";
import PaymentsPage from "./components/PaymentsPage";





function App() {
  return (
    <Router>
      <Routes>
        <Route path="/start" element={<Start />} /> {/* Welcome page */}
        <Route path="/login" element={<Login />} />
                <Route path="/" element={<Start />} />

        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/employee" element={<EmployeePage />} /> 
         <Route path="/add-customer" element={<AddCustomerPage />} />
        <Route path="/orders" element={<OrdersPage />} /> 
        <Route path="/add-medicine" element={<AddMedicinePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
