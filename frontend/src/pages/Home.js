import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  MapPin, 
  AlertCircle, 
  Users, 
  BarChart3, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Shield,
  Globe,
  Zap
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f9ff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
                  Keep Kosovo
                  <span className="block bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
                    Clean & Beautiful
                  </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed transition-colors duration-300">
                  Join thousands of citizens working together to report waste issues, track progress, 
                  and build a sustainable future for Kosovo.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated() ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="group inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/map"
                      className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all duration-300"
                    >
                      <MapPin className="mr-2 w-5 h-5" />
                      Find Nearest Bin
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="group inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      Get Started Free
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center rounded-2xl px-8 py-4 text-lg font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all duration-300"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">1000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Reports Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">500+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">50+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Cities Covered</div>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-100 via-green-100 to-purple-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-2 border-white dark:border-gray-600 shadow-2xl overflow-hidden transition-colors duration-300">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-green-500/20 to-purple-500/20 dark:from-blue-400/30 dark:via-green-400/30 dark:to-purple-400/30"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-white/80 dark:bg-gray-800/80 rounded-2xl flex items-center justify-center mx-auto shadow-lg transition-colors duration-300">
                        <MapPin className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 transition-colors duration-300">Interactive Map</div>
                      <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Find and report issues</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase transition-colors duration-300">Features</h2>
            <p className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl transition-colors duration-300">
              A better way to manage waste
            </p>
            <p className="mt-6 max-w-3xl text-xl text-gray-600 dark:text-gray-300 mx-auto transition-colors duration-300">
              Our platform provides comprehensive tools for citizens, workers, and administrators 
              to efficiently manage waste collection and reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-blue-200 dark:hover:border-blue-400">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Report Issues</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Easily report overflowing bins, illegal dumps, and other waste-related issues with photos and GPS location.
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-green-200 dark:hover:border-green-400">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Monitor the status of your reports from submission to resolution in real-time with detailed progress tracking.
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-purple-200 dark:hover:border-purple-400">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Community</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                Join thousands of citizens working together to keep Kosovo clean and beautiful through collaborative efforts.
              </p>
            </div>

            <div className="group bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-600 hover:border-orange-200 dark:hover:border-orange-400">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                View comprehensive reports and analytics to understand waste management patterns and improve efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative max-w-4xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Ready to make a
              <span className="block bg-gradient-to-r from-yellow-300 to-green-300 bg-clip-text text-transparent">
                difference?
              </span>
            </h2>
            <p className="text-xl text-blue-100 dark:text-blue-200 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
              Join the Waste Management System and help us build a cleaner, more sustainable Kosovo for future generations.
            </p>
            
            {!isAuthenticated() && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-700 bg-white hover:bg-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Zap className="mr-2 w-5 h-5" />
                  Sign up for free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 hover:border-white/50 rounded-2xl transition-all duration-300"
                >
                  Sign in
                </Link>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">Secure</div>
                <div className="text-blue-200 dark:text-blue-300 text-sm transition-colors duration-300">Your data is protected</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">Global</div>
                <div className="text-blue-200 dark:text-blue-300 text-sm transition-colors duration-300">Available everywhere</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">Growing</div>
                <div className="text-blue-200 dark:text-blue-300 text-sm transition-colors duration-300">Community expanding</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
