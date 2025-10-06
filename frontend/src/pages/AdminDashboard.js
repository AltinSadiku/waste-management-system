import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { reportsAPI, usersAPI } from '../services/api';
import { 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  MapPin,
  BarChart3,
  Filter,
  Search
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { ReportCardSkeleton } from '../components/Skeleton';

const AdminDashboard = () => {
  const [reportFilter, setReportFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch reports data
  const { data: reportsData, isLoading: reportsLoading } = useQuery(
    'adminReports',
    () => reportsAPI.getReports({ page: 0, size: 100 }),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  // Fetch users data
  const { data: usersData, isLoading: usersLoading } = useQuery(
    'adminUsers',
    () => usersAPI.getUsers(),
    {
      refetchInterval: 60000, // Refetch every minute
    }
  );

  const reports = reportsData?.data?.content || [];
  const users = usersData?.data || [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'IN_PROGRESS':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'RESOLVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CLOSED':
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = reportFilter === 'ALL' || report.status === reportFilter;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Statistics
  const stats = {
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'PENDING').length,
    inProgressReports: reports.filter(r => r.status === 'IN_PROGRESS').length,
    resolvedReports: reports.filter(r => r.status === 'RESOLVED').length,
    totalUsers: users.length,
    citizens: users.filter(u => u.role === 'CITIZEN').length,
    workers: users.filter(u => u.role === 'WORKER').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
  };

  const recentReports = reports.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="px-5 py-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of the waste management system
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Reports
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalReports}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Reports
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.pendingReports}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalUsers}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Resolved Reports
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.resolvedReports}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="card">
        <div className="px-5 py-6 sm:p-8">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            User Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.citizens}</div>
              <div className="text-sm text-gray-500">Citizens</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.workers}</div>
              <div className="text-sm text-gray-500">Workers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.admins}</div>
              <div className="text-sm text-gray-500">Administrators</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Management */}
      <div className="card">
        <div className="px-5 py-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Reports Management
            </h3>
            
            {/* Filters */}
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value)}
                  className="select"
                >
                  <option value="ALL">All Reports</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {reportsLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, idx) => (
                <ReportCardSkeleton key={idx} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.slice(0, 20).map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(report.status)}
                        <h4 className="text-sm font-medium text-gray-900">
                          {report.title}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {report.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {report.address || 'Location via GPS'}
                        </span>
                        <span>
                          By: {report.reporter?.firstName} {report.reporter?.lastName}
                        </span>
                        <span>
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <StatusBadge value={report.status} />
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                      {report.assignedWorker && (
                        <span className="text-xs text-gray-500">
                          Worker: {report.assignedWorker.firstName} {report.assignedWorker.lastName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredReports.length > 20 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    Showing 20 of {filteredReports.length} reports
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
