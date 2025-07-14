'use client';

import { useState } from 'react';

export default function SecurityStatus() {
  const [isExpanded, setIsExpanded] = useState(false);

  const securityFeatures = [
    {
      name: 'Middleware Protection',
      status: 'Active',
      description: 'Routes protected by authentication middleware'
    },
    {
      name: 'Admin Role Verification',
      status: 'Active', 
      description: 'Database-level admin privilege checking'
    },
    {
      name: 'Token Validation',
      status: 'Active',
      description: 'Firebase Admin SDK token verification'
    },
    {
      name: 'Rate Limiting',
      status: 'Active',
      description: '100 requests per 15 minutes per IP'
    },
    {
      name: 'Secure Cookies',
      status: 'Active',
      description: 'Auth tokens stored in secure cookies'
    },
    {
      name: 'Real-time Verification',
      status: 'Active',
      description: 'Continuous admin privilege validation'
    }
  ];

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <h3 className="text-sm font-medium text-green-800">Security Status: Protected</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-green-700 mb-3">
            This admin dashboard is protected by multiple layers of security:
          </p>
          {securityFeatures.map((feature, index) => (
            <div key={index} className="flex items-center justify-between bg-white rounded px-3 py-2">
              <div>
                <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                <p className="text-xs text-gray-600">{feature.description}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                {feature.status}
              </span>
            </div>
          ))}
          <div className="mt-3 text-xs text-green-600">
            ⚠️ Only users with admin privileges can access this dashboard
          </div>
        </div>
      )}
    </div>
  );
}
