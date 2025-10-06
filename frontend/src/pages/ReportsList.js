import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';
import { reportsAPI } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { ReportCardSkeleton } from '../components/Skeleton';
import { 
  AlertCircle, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Eye,
  FileText,
  BarChart3
} from 'lucide-react';

const ReportsList = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: userReports, isLoading, refetch } = useQuery(
    'userReports',
    () => reportsAPI.getReportsByUser(user.id),
    {
      enabled: !!user?.id,
    }
  );

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

  const getTypeDisplayName = (type) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredReports = userReports?.data?.filter(report => {
    const matchesFilter = filter === 'ALL' || report.status === filter;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  const getStatusCounts = () => {
    const reports = userReports?.data || [];
    return {
      ALL: reports.length,
      PENDING: reports.filter(r => r.status === 'PENDING').length,
      IN_PROGRESS: reports.filter(r => r.status === 'IN_PROGRESS').length,
      RESOLVED: reports.filter(r => r.status === 'RESOLVED').length,
      CLOSED: reports.filter(r => r.status === 'CLOSED').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">My Reports</h1>
                  <p className="text-green-100 mt-1">
                    Track and manage all your waste management reports
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { key: 'ALL', label: 'Total', count: statusCounts.ALL, color: 'blue', icon: BarChart3 },
              { key: 'PENDING', label: 'Pending', count: statusCounts.PENDING, color: 'yellow', icon: Clock },
              { key: 'IN_PROGRESS', label: 'In Progress', count: statusCounts.IN_PROGRESS, color: 'blue', icon: AlertCircle },
              { key: 'RESOLVED', label: 'Resolved', count: statusCounts.RESOLVED, color: 'green', icon: CheckCircle },
              { key: 'CLOSED', label: 'Closed', count: statusCounts.CLOSED, color: 'gray', icon: CheckCircle }
            ].map(({ key, label, count, color, icon: Icon }) => (
              <div
                key={key}
                onClick={() => setFilter(key)}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-xl border-2 ${
                  filter === key 
                    ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{count}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${
                    color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                      color === 'green' ? 'text-green-600 dark:text-green-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-colors duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Search & Filter</h3>
                <p className="text-gray-600 dark:text-gray-400">Find specific reports quickly</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900/30 focus:border-green-500 dark:focus:border-green-400 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          </div>

          {/* Reports List */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
            <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Your Reports</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track the progress of all your submitted reports</p>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, idx) => (
                    <ReportCardSkeleton key={idx} />
                  ))}
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {searchTerm || filter !== 'ALL' ? 'No reports found' : 'No reports yet'}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchTerm || filter !== 'ALL' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by creating your first report.'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-100 dark:border-gray-600 rounded-2xl p-6 hover:border-green-200 dark:hover:border-green-400 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4">
                            {getStatusIcon(report.status)}
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {report.title}
                            </h3>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                            {report.description}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                              <span className="truncate">{report.address || 'Location via GPS'}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                              <span>Submitted: {new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                            
                            {report.resolvedAt && (
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                                <span>Resolved: {new Date(report.resolvedAt).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Progress indicator */}
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                              <span>Progress</span>
                              <span className="font-medium">
                                {report.status === 'PENDING' ? '25%' :
                                 report.status === 'IN_PROGRESS' ? '75%' : '100%'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full transition-all duration-500 ${
                                  report.status === 'RESOLVED' || report.status === 'CLOSED' 
                                    ? 'bg-gradient-to-r from-green-400 to-green-500' 
                                    : report.status === 'IN_PROGRESS'
                                    ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                                }`}
                                style={{
                                  width: report.status === 'PENDING' ? '25%' :
                                         report.status === 'IN_PROGRESS' ? '75%' : '100%'
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-3 ml-6">
                          <div className="flex flex-col items-end space-y-2">
                            <StatusBadge value={report.status} />
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(report.priority)}`}>
                              {report.priority}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              {getTypeDisplayName(report.type)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsList;
