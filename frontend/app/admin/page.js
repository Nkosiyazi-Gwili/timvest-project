'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL 
  : 'http://localhost:5000';

export default function AdminPortal() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
        loadAdminData(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
  }, []);

  const loadAdminData = async (token) => {
    setLoadingData(true);
    setError('');
    
    try {
      const [appsRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/applications`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setApplications(appsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading admin data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Session expired. Please login again.');
        logout();
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the backend is running.');
      } else {
        setError('Failed to load data. Please try again.');
      }
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      await loadAdminData(token);
      setSuccessMessage('Login successful!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 400) {
        setError('Invalid email or password. Please try again.');
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the backend is running.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setApplications([]);
    setStats(null);
    setEmail('');
    setPassword('');
  };

  const updateApplicationStatus = async (id, status) => {
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/admin/applications/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app
      ));
      
      // Update stats
      if (stats) {
        const newStats = { ...stats };
        const oldApp = applications.find(app => app.id === id);
        
        if (oldApp) {
          newStats[oldApp.status] = Math.max(0, newStats[oldApp.status] - 1);
        }
        newStats[status] = (newStats[status] || 0) + 1;
        newStats.totalApplications = applications.length;
        setStats(newStats);
      }
      
      setSuccessMessage(`Application ${status} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating application:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Session expired. Please login again.');
        logout();
      } else {
        setError('Error updating application. Please try again.');
      }
    }
  };

  const viewApplicationDetails = (application) => {
    setSelectedApplication(application);
  };

  const closeApplicationDetails = () => {
    setSelectedApplication(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      case 'pending':
        return '⏳';
      default:
        return '📄';
    }
  };

  // Filter applications based on search term and status
  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         application.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const exportToCSV = () => {
    const headers = ['Company Name', 'Contact Person', 'Email', 'Phone', 'Company Type', 'Payment Plan', 'Status', 'Applied Date'];
    const csvData = filteredApplications.map(app => [
      `"${app.companyName}"`,
      `"${app.contactPerson}"`,
      `"${app.email}"`,
      `"${app.phone}"`,
      `"${app.companyType}"`,
      `"${app.paymentPlan}"`,
      `"${app.status}"`,
      `"${formatDate(app.createdAt)}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-applications-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    setSuccessMessage('Applications exported to CSV successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-primary-200">
            <div className="text-center">
              {/* APEX FINANCIAL HUB Logo */}
              <div className="flex justify-center mb-6">
                <div className="bg-primary-600 rounded-xl p-4">
                  <Image
                    src="/images/apex-logo.jpg"
                    alt="APEX FINANCIAL HUB"
                    width={150}
                    height={60}
                    className="rounded-lg mx-auto object-cover"
                  />
                  <div className="mt-2 text-white text-sm font-semibold">
                    in partnership with <span className="font-bold">TIMVEST</span>
                  </div>
                </div>
              </div>
              
              <div className="mx-auto h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-3xl font-extrabold text-primary-900">
                Admin Portal
              </h2>
              <p className="mt-2 text-sm text-primary-600">
                TIMVEST & APEX FINANCIAL HUB
              </p>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative block w-full px-3 py-3 border border-primary-300 placeholder-primary-400 text-primary-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 transition-colors"
                    placeholder="admin@timvest.co.za"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="relative block w-full px-3 py-3 border border-primary-300 placeholder-primary-400 text-primary-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 transition-colors"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-primary-500">
                  Default credentials: admin@timvest.co.za / password
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-primary-600 rounded-lg p-2 flex items-center justify-center">
                <Image
                  src="/images/apex-logo.jpg"
                  alt="APEX FINANCIAL HUB"
                  width={80}
                  height={35}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="h-8 w-px bg-primary-200"></div>
              <div>
                <h1 className="text-2xl font-bold text-primary-900">Admin Dashboard</h1>
                <p className="text-primary-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 border border-primary-300 rounded-lg hover:bg-primary-100 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Export CSV</span>
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      {(error || successMessage) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-700">{successMessage}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-primary-900">{stats.totalApplications}</div>
                  <div className="text-primary-600">Total Applications</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-primary-600">Pending</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                  <div className="text-primary-600">Approved</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-primary-100">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                  <div className="text-primary-600">Rejected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white shadow-sm rounded-xl border border-primary-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-primary-200 bg-primary-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <h2 className="text-xl font-semibold text-primary-900">Business Applications</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors w-64"
                  />
                  <svg className="w-4 h-4 text-primary-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Refresh Button */}
                <button
                  onClick={() => loadAdminData(localStorage.getItem('token'))}
                  disabled={loadingData}
                  className="px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{loadingData ? 'Refreshing...' : 'Refresh'}</span>
                </button>
              </div>
            </div>
          </div>
          
          {loadingData ? (
            <div className="p-8 text-center">
              <svg className="animate-spin h-8 w-8 text-primary-600 mx-auto" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-primary-600">Loading applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-primary-900">No applications found</h3>
              <p className="mt-1 text-sm text-primary-600">
                {applications.length === 0 ? 'No applications have been submitted yet.' : 'No applications match your search criteria.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-primary-200">
                  <thead className="bg-primary-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-primary-200">
                    {currentApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-primary-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-primary-900">{application.companyName}</div>
                          <div className="text-sm text-primary-600">{application.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-primary-900">{application.contactPerson}</div>
                          <div className="text-sm text-primary-600">{application.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                          {application.companyType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            application.paymentPlan === 'annual' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {application.paymentPlan === 'annual' ? 'Annual' : 'Monthly'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                          {formatDate(application.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            <span className="mr-1">{getStatusIcon(application.status)}</span>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => viewApplicationDetails(application)}
                            className="text-primary-600 hover:text-primary-900 transition-colors px-2 py-1 rounded hover:bg-primary-100"
                          >
                            View
                          </button>
                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateApplicationStatus(application.id, 'approved')}
                                className="text-green-600 hover:text-green-900 transition-colors px-2 py-1 rounded hover:bg-green-100"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateApplicationStatus(application.id, 'rejected')}
                                className="text-red-600 hover:text-red-900 transition-colors px-2 py-1 rounded hover:bg-red-100"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-primary-200 bg-primary-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-primary-600">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredApplications.length)} of {filteredApplications.length} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-primary-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-100 transition-colors"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-3 py-1 text-sm border rounded transition-colors ${
                            currentPage === page
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-primary-300 text-primary-700 hover:bg-primary-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-primary-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-100 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 rounded-lg p-2">
                    <Image
                      src="/images/apex-logo.jpg"
                      alt="APEX FINANCIAL HUB"
                      width={80}
                      height={35}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary-900">Application Details</h2>
                    <p className="text-primary-600">Application #{selectedApplication.id}</p>
                  </div>
                </div>
                <button
                  onClick={closeApplicationDetails}
                  className="text-primary-400 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-primary-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-primary-900 mb-4">Company Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-1">Company Name</label>
                        <p className="text-primary-900 font-medium">{selectedApplication.companyName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-1">Company Type</label>
                        <p className="text-primary-900">{selectedApplication.companyType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-primary-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-1">Contact Person</label>
                        <p className="text-primary-900">{selectedApplication.contactPerson}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-1">Email</label>
                        <p className="text-primary-900">{selectedApplication.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-700 mb-1">Phone</label>
                        <p className="text-primary-900">{selectedApplication.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Services Requested</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedApplication.services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-white rounded border border-primary-200">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-primary-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Payment Plan</h3>
                  <div className="bg-white p-4 rounded-lg border border-primary-200">
                    <p className="text-lg font-bold text-primary-600">
                      {selectedApplication.paymentPlan === 'annual' ? 'Annual Payment - R12,000' : 'Monthly Payment - R1,000/month'}
                    </p>
                    <p className="text-sm text-primary-600 mt-1">
                      {selectedApplication.paymentPlan === 'annual' 
                        ? 'One-time annual payment with priority support' 
                        : 'Monthly payments with R2,000 deposit required'}
                    </p>
                  </div>
                </div>

                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">Application Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-primary-700">Applied</span>
                      <span className="text-sm text-primary-600">{formatDate(selectedApplication.createdAt)}</span>
                    </div>
                    {selectedApplication.updatedAt && selectedApplication.status !== 'pending' && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-primary-700">Status Updated</span>
                        <span className="text-sm text-primary-600">{formatDate(selectedApplication.updatedAt)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedApplication.status === 'pending' && (
                  <div className="flex space-x-4 pt-6 border-t border-primary-200">
                    <button
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, 'approved');
                        closeApplicationDetails();
                      }}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Approve Application</span>
                    </button>
                    <button
                      onClick={() => {
                        updateApplicationStatus(selectedApplication.id, 'rejected');
                        closeApplicationDetails();
                      }}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reject Application</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}