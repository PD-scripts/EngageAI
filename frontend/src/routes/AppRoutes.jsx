import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import CustomerDetails from '../pages/CustomerDetails';
import Orders from '../pages/Orders';
import QueryTester from '../pages/QueryTester';
import AICopilot from '../pages/AICopilot';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="orders" element={<Orders />} />
        <Route path="query-tester" element={<QueryTester />} />
        <Route path="ai-copilot" element={<AICopilot />} />
        {/* Fallback route */}
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

