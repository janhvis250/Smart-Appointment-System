import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <AlertTriangle className="h-16 w-16 text-indigo-600 mx-auto" />
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          404 - Page Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link 
            to="/" 
            className="btn btn-primary inline-flex items-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;