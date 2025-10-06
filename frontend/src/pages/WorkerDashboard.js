import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { reportsAPI, usersAPI } from '../services/api';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MapPin,
  User,
  Filter,
  Search,
  Play,
  Check,
  X,
  TrendingUp,
  Users,
  Activity,
  Loader2,
  Eye,
  Calendar
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { ReportCardSkeleton } from '../components/Skeleton';

const WorkerDashboard = () => {
  const [reportFilter, setReportFilter] = useState('ASSIGNED');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  // Fetch reports data
  const { data: reportsData, isLoading: reportsLoading, refetch } = useQuery(
    'workerReports',
    () => reportsAPI.getReports({ page: 0, size: 100 }),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const reports = reportsData?.data?.content || [];

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

  const handleStatusUpdate = async (reportId, newStatus) => {
    setUpdatingStatus(reportId);
    try {
      await reportsAPI.updateReportStatus(reportId, newStatus);
      await refetch();
    } catch (error) {
      console.error('Error updating report status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesFilter = reportFilter === 'ALL' || 
                         (reportFilter === 'ASSIGNED' && report.assignedWorker) ||
                         (reportFilter === 'UNASSIGNED' && !report.assignedWorker) ||
                         report.status === reportFilter;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Statistics
  const stats = {
    totalReports: reports.length,
    assignedReports: reports.filter(r => r.assignedWorker).length,
    unassignedReports: reports.filter(r => !r.assignedWorker).length,
    pendingReports: reports.filter(r => r.status === 'PENDING').length,
    inProgressReports: reports.filter(r => r.status === 'IN_PROGRESS').length,
    resolvedReports: reports.filter(r => r.status === 'RESOLVED').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Worker Dashboard</h1>
                  <p className="text-blue-100 mt-1">
                    Manage and track assigned waste management tasks
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalReports}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                  <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>All time reports</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Reports</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.assignedReports}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                  <User className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Activity className="h-4 w-4 mr-1" />
                <span>Currently assigned</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unassigned Reports</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.unassignedReports}</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-xl">
                  <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Awaiting assignment</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved Reports</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.resolvedReports}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Successfully completed</span>
              </div>
            </div>
          </div>

          {/* Reports Management */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
            <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reports Management</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track all waste management reports</p>
                </div>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <select
                      value={reportFilter}
                      onChange={(e) => setReportFilter(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="ALL">All Reports</option>
                      <option value="ASSIGNED">Assigned</option>
                      <option value="UNASSIGNED">Unassigned</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {reportsLoading ? (
                <div className="space-y-6">
                  {[...Array(4)].map((_, idx) => (
                    <ReportCardSkeleton key={idx} />
                  ))}
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm || reportFilter !== 'ALL' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'No reports match the current criteria.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.slice(0, 20).map((report) => (
                    <div
                      key={report.id}
                      className="bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-2xl p-6 hover:border-blue-200 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            {getStatusIcon(report.status)}
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {report.title}
                            </h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {report.description}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                              <span className="truncate">{report.address || 'Location via GPS'}</span>
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                              <span>By: {report.reporter?.firstName} {report.reporter?.lastName}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                              <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-3 ml-6">
                          <div className="flex flex-col items-end space-y-2">
                            <StatusBadge value={report.status} />
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(report.priority)}`}>
                              {report.priority}
                            </span>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex space-x-2">
                            {report.status === 'PENDING' && (
                              <button
                                onClick={() => handleStatusUpdate(report.id, 'IN_PROGRESS')}
                                disabled={updatingStatus === report.id}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                              >
                                {updatingStatus === report.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Play className="h-4 w-4 mr-2" />
                                )}
                                Start
                              </button>
                            )}
                            {report.status === 'IN_PROGRESS' && (
                              <button
                                onClick={() => handleStatusUpdate(report.id, 'RESOLVED')}
                                disabled={updatingStatus === report.id}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 focus:outline-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                              >
                                {updatingStatus === report.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4 mr-2" />
                                )}
                                Complete
                              </button>
                            )}
                            {(report.status === 'PENDING' || report.status === 'IN_PROGRESS') && (
                              <button
                                onClick={() => handleStatusUpdate(report.id, 'CLOSED')}
                                disabled={updatingStatus === report.id}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                              >
                                {updatingStatus === report.id ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4 mr-2" />
                                )}
                                Close
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredReports.length > 20 && (
                    <div className="text-center pt-6 border-t border-gray-200">
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
      </div>
    </div>
  );
};

export default WorkerDashboard;
