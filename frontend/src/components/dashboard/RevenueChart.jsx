import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const RevenueChart = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <XAxis 
            dataKey="name" 
            stroke="#6B7280" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: '12px', 
              border: '1px solid #E7E5E4',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              fontSize: '11px',
              fontFamily: 'serif'
            }} 
            labelStyle={{ fontWeight: 'bold', color: '#1F2937' }}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            name="Revenue" 
            stroke="#8B7355" 
            strokeWidth={2.5} 
            dot={{ r: 3, fill: '#8B7355', strokeWidth: 0 }} 
            activeDot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="orders" 
            name="Orders" 
            stroke="#B89B72" 
            strokeWidth={2} 
            dot={{ r: 3, fill: '#B89B72', strokeWidth: 0 }} 
            activeDot={{ r: 5 }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="left" 
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ 
              paddingTop: '20px', 
              fontSize: '11px', 
              color: '#6B7280',
              fontWeight: 'semibold'
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
