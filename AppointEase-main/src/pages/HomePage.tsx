import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Smart Appointment Booking
            </h1>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto mb-8 text-indigo-100">
              Streamline your scheduling with our powerful and inthuitive appointment booking system
            </p>
            <div className="mt-8 flex justify-center">
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary text-base px-8 py-3"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <div className="space-x-4">
                  <Link
                    to="/register"
                    className="btn btn-primary text-base px-8 py-3"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline text-base px-8 py-3 bg-white text-indigo-700"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="h-20 bg-gray-50" style={{ clipPath: 'polygon(0 0, 100% 100%, 100% 0)' }}></div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Simplify Your Scheduling
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our appointment booking system makes it easy for both businesses and customers to manage appointments efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="inline-block p-3 bg-indigo-100 rounded-lg mb-4">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book appointments with a few clicks through our intuitive interface.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="inline-block p-3 bg-indigo-100 rounded-lg mb-4">
                <Clock className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Updates</h3>
              <p className="text-gray-600">
                Get instant confirmation and updates about your appointments.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="inline-block p-3 bg-indigo-100 rounded-lg mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Dashboard</h3>
              <p className="text-gray-600">
                Manage users and appointment slots with ease through the admin panel.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="inline-block p-3 bg-indigo-100 rounded-lg mb-4">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Notifications</h3>
              <p className="text-gray-600">
                Automated email notifications for booking confirmations and reminders.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our simple process makes scheduling appointments effortless for everyone.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="bg-gray-50 p-6 rounded-lg max-w-md">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Create an Account</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Sign up for an account to gain access to our appointment booking system.
              </p>
            </div>
            
            <div className="hidden md:block text-gray-300">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg max-w-md">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Select a Service</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Choose from our range of available services based on your needs.
              </p>
            </div>
            
            <div className="hidden md:block text-gray-300">
              <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg max-w-md">
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 text-white h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Book & Manage</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Choose a convenient time slot and manage your appointments with ease.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            Ready to Simplify Your Scheduling?
          </h2>
          <p className="text-lg text-indigo-100 max-w-3xl mx-auto mb-8">
            Join thousands of satisfied users who have transformed their appointment management.
          </p>
          <div className="mt-8">
            {user ? (
              <Link
                to="/booking"
                className="btn btn-primary text-base px-8 py-3 bg-white text-indigo-700 hover:bg-gray-100"
              >
                Book an Appointment
              </Link>
            ) : (
              <Link
                to="/register"
                className="btn btn-primary text-base px-8 py-3 bg-white text-indigo-700 hover:bg-gray-100"
              >
                Sign Up Now
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;