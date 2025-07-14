"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Swal from "sweetalert2";
import { useAdminAuthStore } from '@/app/store/adminAuthStore';
import AdminHeader from '@/app/components/admin/AdminHeader';
import SecurityStatus from '@/app/components/admin/SecurityStatus';
import { AdminUser, UserDetailsResponse, UsersResponse, PaymentData, ManualPaymentRequest, FreeTrialData, ExtendedAdminUser } from '@/types/admin';

interface UserTabProps {
  user: ExtendedAdminUser;
  isActive: boolean;
  onClick: () => void;
}

const UserTab: React.FC<UserTabProps> = ({ user, isActive, onClick }) => {
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'canceled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div
      className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
        isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-900">{user.username || 'N/A'}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">{user.shopName || user.shopData?.shopName || 'No shop name'}</p>
        </div>
        <div className="text-right">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              user.subscription?.status || user.latestPayment?.status
            )}`}
          >
            {user.subscription?.status || user.latestPayment?.status || 'Unknown'}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

interface UserDetailsProps {
  user: AdminUser | null;
  userDetails: UserDetailsResponse | null;
  loading: boolean;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, userDetails, loading }) => {
  const [activeTab, setActiveTab] = useState<'payments' | 'trials'>('payments');

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a user to view details
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-black">Loading user details...</div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Failed to load user details
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* User Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">User Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Username</label>
            <p className="text-gray-900">{userDetails.user.username || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{userDetails.user.email || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Phone Number</label>
            <p className="text-gray-900">{userDetails.user.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Business Type</label>
            <p className="text-gray-900">{userDetails.shopData?.businessType || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Address</label>
            <p className="text-gray-900">{userDetails.user.address || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Joined Date</label>
            <p className="text-gray-900">
              {userDetails.user.createdAt 
                ? new Date(userDetails.user.createdAt).toLocaleDateString() 
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Shop Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Shop Information</h2>
        {userDetails.shopData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Shop Name</label>
              <p className="text-gray-900">{userDetails.shopData.shopName || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Business Type</label>
              <p className="text-gray-900">{userDetails.shopData.businessType || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Address</label>
              <p className="text-gray-900">{userDetails.shopData.address || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-gray-900">{userDetails.shopData.phoneNumber || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No shop data available</p>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Shop Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{userDetails.stats.totalCategories}</div>
            <div className="text-sm text-blue-600">Categories</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{userDetails.stats.totalProducts}</div>
            <div className="text-sm text-green-600">Products</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{userDetails.stats.totalCustomers}</div>
            <div className="text-sm text-purple-600">Customers</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{userDetails.stats.totalSales}</div>
            <div className="text-sm text-orange-600">Sales</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">LKR {userDetails.stats.totalSalesAmount}</div>
            <div className="text-sm text-red-600">Revenue</div>
          </div>
        </div>
      </div>

      {/* Payment History with Tabs */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Payment & Trial History</h2>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'payments'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Payments ({userDetails.payments.length})
            </button>
            <button
              onClick={() => setActiveTab('trials')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'trials'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Free Trials ({userDetails.freeTrials?.length || 0})
            </button>
          </div>
        </div>

        {/* Payment Tab */}
        {activeTab === 'payments' && (
          <>
            {userDetails.payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Package
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expires Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userDetails.payments.map((payment: PaymentData) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.packageName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          LKR {payment.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.expiresAt ? new Date(payment.expiresAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.status === 'completed' || payment.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'expired'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                          {payment.payment_id}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No payment history available</p>
            )}
          </>
        )}

        {/* Free Trials Tab */}
        {activeTab === 'trials' && (
          <>
            {userDetails.freeTrials && userDetails.freeTrials.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Package
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Started Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expires Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userDetails.freeTrials.map((trial: FreeTrialData) => (
                      <tr key={trial.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {trial.packageName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trial.duration} days
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trial.paidAt ? new Date(trial.paidAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trial.expiresAt ? new Date(trial.expiresAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            trial.status === 'active'
                              ? 'bg-blue-100 text-blue-800'
                              : trial.status === 'expired'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {trial.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {trial.notes || 'No notes'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No free trials available</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface ManualPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<ExtendedAdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ExtendedAdminUser | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] = useState(false);
  
  const { user } = useAdminAuthStore();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data: UsersResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch users');
      }
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Failed to fetch users');
        console.error('Failed to fetch users:', data);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const fetchUserDetails = async (userId: string) => {
    try {
      setDetailsLoading(true);
      
      if (!user?.token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(`/api/admin/user-details?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data: UserDetailsResponse = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user details');
      }
      
      if (data.success) {
        setUserDetails(data);
      } else {
        console.error('Failed to fetch user details:', data);
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUserSelect = (user: AdminUser) => {
    setSelectedUser(user);
    fetchUserDetails(user.id);
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-xl text-black">Loading admin dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2 flex justify-between items-center">
            <button
              onClick={() => setIsManualPaymentModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Add Payment / Free Trial
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SecurityStatus />
        
        <div className="flex h-[calc(100vh-50px)] bg-white rounded-lg shadow">
          {/* Users List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Users ({filteredUsers.length})
                </h2>
                <button 
                  onClick={fetchUsers}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Refresh
                </button>
              </div>
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredUsers.map((user) => (
                <UserTab
                  key={user.id}
                  user={user}
                  isActive={selectedUser?.id === user.id}
                  onClick={() => handleUserSelect(user)}
                />
              ))}
              {filteredUsers.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? 'No users found matching search' : 'No users found'}
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 overflow-y-auto">
            <UserDetails
              user={selectedUser}
              userDetails={userDetails}
              loading={detailsLoading}
            />
          </div>
        </div>
      </div>

      {/* Manual Payment Modal */}
      <ManualPaymentModal
        isOpen={isManualPaymentModalOpen}
        onClose={() => setIsManualPaymentModalOpen(false)}
        onSuccess={() => {
          fetchUsers();
          if (selectedUser) {
            fetchUserDetails(selectedUser.id);
          }
        }}
      />
    </div>
  );
}

const ManualPaymentModal: React.FC<ManualPaymentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState<ExtendedAdminUser | null>(null);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [duration, setDuration] = useState(7);
  const [paymentType, setPaymentType] = useState<'manual' | 'free_trial'>('free_trial');
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const { user } = useAdminAuthStore();

  // Hardcoded packages
  const packages = [
    {
      id: 'starter',
      name: 'Starter Plan',
      priceDisplay: 'LKR 990/month',
      price: 990,
      description: 'Ideal for small businesses and startups',
      features: [
        'Mobile POS Access',
        'Sales & Invoice Management',
        'Inventory Tracking',
        'Email Support',
      ],
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      priceDisplay: 'LKR 1,990/month',
      price: 1990,
      description: 'Perfect for retail shops and service providers',
      features: [
        'Everything in Starter, plus:',
        'Supplier Management',
        'Customer Management',
        'Sales & Expense Reports',
        'Discount Handling',
        'Priority Support',
      ],
    },
  ];

  useEffect(() => {
    if (isOpen && packages.length > 0) {
      setSelectedPackage(packages[0].id);
    }
  }, [isOpen]);

  const searchUser = async () => {
    if (!email.trim()) return;
    
    try {
      setSearching(true);
      
      if (!user?.token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      const data: UsersResponse = await response.json();
      
      if (data.success) {
        const user = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
        if (user) {
          setSelectedUser(user);
        } else {
          Swal.fire({
            icon: "warning",
            title: "User Not Found",
            text: "No user found with this email address",
          });
          setSelectedUser(null);
        }
      }
    } catch (error) {
      console.error('Error searching user:', error);
      Swal.fire({
        icon: "error",
        title: "Search Error",
        text: "An error occurred while searching for the user",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !selectedPackage) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please select a user and package",
      });
      return;
    }

    if (!user?.token) {
      Swal.fire({
        icon: "error",
        title: "Authentication Error",
        text: "No authentication token available",
      });
      return;
    }

    try {
      setLoading(true);
      const selectedPkg = packages.find(p => p.id === selectedPackage);
      
      const requestData: ManualPaymentRequest = {
        userId: selectedUser.id,
        packageName: selectedPkg?.name || selectedPackage,
        packageType: selectedPackage,
        duration,
        amount: paymentType === 'free_trial' ? 0 : amount,
        paymentType,
        notes
      };

      const response = await fetch('/api/admin/add-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Payment Added Successfully",
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
        });
        onSuccess();
        resetForm();
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: data.message || 'Failed to add payment',
        });
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "An error occurred while adding the payment",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setSelectedUser(null);
    setSelectedPackage('');
    setDuration(7);
    setPaymentType('free_trial');
    setAmount(0);
    setNotes('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Add Manual Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Enter user email"
                required
              />
              <button
                type="button"
                onClick={searchUser}
                disabled={searching}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
            {selectedUser && (
              <div className="mt-2 p-2 bg-green-50 rounded border">
                <p className="text-sm text-green-800">
                  <strong>{selectedUser.username}</strong> - {selectedUser.email}
                </p>
              </div>
            )}
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Type
            </label>
            <select
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value as 'manual' | 'free_trial')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="free_trial">Free Trial</option>
              <option value="manual">Manual Payment</option>
            </select>
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Package
            </label>
            <select
              value={selectedPackage}
              onChange={(e) => {
                setSelectedPackage(e.target.value);
                const pkg = packages.find(p => p.id === e.target.value);
                if (pkg && paymentType === 'manual') {
                  setAmount(pkg.price);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            >
              <option value="">Select a package</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} - {pkg.priceDisplay}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Days)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
              <option value={365}>1 Year</option>
            </select>
          </div>

          {/* Amount (only for manual payments) */}
          {paymentType === 'manual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount (LKR)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="0"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              rows={3}
              placeholder="Add any notes about this payment..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedUser}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Adding...' : (paymentType === 'free_trial' ? 'Add Free Trial' : 'Add Payment')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
