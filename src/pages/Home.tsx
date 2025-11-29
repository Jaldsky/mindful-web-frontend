/**
 * Home Page Component
 * Main landing page displayed at root path (/)
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Activity, BarChart3, Clock, TrendingUp } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-2xl">
                <Activity className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Mindful Web
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Track your web usage and get mindful insights about your digital habits
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
            >
              <BarChart3 size={20} />
              View Dashboard
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-background-primary p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 w-fit mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Time Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Monitor how much time you spend on different websites and domains
              </p>
            </div>

            <div className="bg-background-primary p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg text-green-600 w-fit mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Get detailed insights and statistics about your browsing patterns
              </p>
            </div>

            <div className="bg-background-primary p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg text-purple-600 w-fit mb-4">
                <Activity size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mindful Usage</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Understand your digital habits and make more conscious choices
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

