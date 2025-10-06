import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'react-query';
import { reportsAPI } from '../services/api';
import { 
  AlertCircle, 
  MapPin, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Plus,
  Eye,
  BarChart3,
  Activity,
  Users,
  FileText,
  ArrowRight,
  Calendar
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { ReportCardSkeleton } from '../components/Skeleton';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: userReports, isLoading } = useQuery(
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

  const recentReports = userReports?.data?.slice(0, 5) || [];
  const totalReports = userReports?.data?.length || 0;
  const pendingReports = userReports?.data?.filter(r => r.status === 'PENDING').length || 0;
  const inProgressReports = userReports?.data?.filter(r => r.status === 'IN_PROGRESS').length || 0;
  const resolvedReports = userReports?.data?.filter(r => r.status === 'RESOLVED').length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden transition-colors duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    Welcome back, {user?.firstName}!
                  </h1>
                  <p className="text-blue-100 mt-1">
                    Here's what's happening with your waste management reports
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
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalReports}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>All time reports</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{pendingReports}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-xl">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Activity className="h-4 w-4 mr-1" />
                <span>Awaiting review</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{inProgressReports}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-xl">
                  <AlertCircle className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Activity className="h-4 w-4 mr-1" />
                <span>Being processed</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{resolvedReports}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Successfully completed</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/report"
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-400"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                    <Plus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Report Issue</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit a new waste issue</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/reports"
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-400"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                    <Eye className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">View Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">See all your reports</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <Link
              to="/map"
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-400"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                    <MapPin className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Map View</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Find nearest bins</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>

          {/* Recent Reports */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300">
            <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Reports</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Your latest waste management reports</p>
            </div>
            
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, idx) => (
                    <ReportCardSkeleton key={idx} />
                  ))}
                </div>
              ) : recentReports.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Get started by creating your first report.
                  </p>
                  <Link
                    to="/report"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Report Issue
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border-2 border-gray-100 dark:border-gray-600 rounded-2xl p-6 hover:border-blue-200 dark:hover:border-blue-400 hover:shadow-lg transition-all duration-200"
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
                          <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                              <span className="truncate">{report.address || 'Location via GPS'}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                              <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-6">
                          <StatusBadge value={report.status} />
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(report.priority)}`}>
                            {report.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {userReports?.data?.length > 5 && (
                    <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to="/reports"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                      >
                        View all {userReports.data.length} reports
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
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

export default Dashboard;
