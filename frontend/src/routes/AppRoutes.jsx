import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Customers from '../pages/Customers';
import CustomerDetails from '../pages/CustomerDetails';
import Orders from '../pages/Orders';
import AudienceBuilder from '../pages/AudienceBuilder';
import Campaigns from '../pages/Campaigns';
import Analytics from '../pages/Analytics';
import AIStrategist from '../pages/AIStrategist';
import QueryTester from '../pages/QueryTester';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:id" element={<CustomerDetails />} />
        <Route path="orders" element={<Orders />} />
        <Route path="audience-builder" element={<AudienceBuilder />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ai-strategist" element={<AIStrategist />} />
        <Route path="query-tester" element={<QueryTester />} />
        {/* Fallback route */}
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
