import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import ReactECharts from 'echarts-for-react';

const { FiTrendingUp, FiUsers, FiDollarSign, FiCalendar, FiEye, FiRefreshCw, FiDownload } = FiIcons;

const AnalyticsDashboard = () => {
  const { analytics, realTimeData, loading, loadAnalyticsData } = useAnalytics();
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${analytics.revenue?.reduce((sum, item) => sum + item.revenue, 0)?.toLocaleString() || '0'}`,
      change: '+12.5%',
      changeType: 'positive',
      icon: FiDollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Bookings',
      value: analytics.bookings?.reduce((sum, item) => sum + item.bookings, 0)?.toLocaleString() || '0',
      change: '+8.3%',
      changeType: 'positive',
      icon: FiCalendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Users',
      value: realTimeData.activeUsers.toLocaleString(),
      change: '+15.2%',
      changeType: 'positive',
      icon: FiUsers,
      color: 'bg-purple-500'
    },
    {
      title: 'Conversion Rate',
      value: `${realTimeData.conversionRate}%`,
      change: '+2.1%',
      changeType: 'positive',
      icon: FiTrendingUp,
      color: 'bg-orange-500'
    }
  ];

  // Revenue Chart Options
  const revenueChartOptions = {
    title: {
      text: 'Revenue Trend',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const data = params[0];
        return `${data.name}<br/>Revenue: $${data.value.toLocaleString()}`;
      }
    },
    xAxis: {
      type: 'category',
      data: analytics.revenue?.map(item => item.month) || []
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '${value}'
      }
    },
    series: [{
      data: analytics.revenue?.map(item => item.revenue) || [],
      type: 'line',
      smooth: true,
      itemStyle: { color: '#003580' },
      areaStyle: { opacity: 0.3 }
    }],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  };

  // Bookings Chart Options
  const bookingsChartOptions = {
    title: {
      text: 'Daily Bookings',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: analytics.bookings?.slice(-7).map(item => 
        new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ) || []
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: analytics.bookings?.slice(-7).map(item => item.bookings) || [],
      type: 'bar',
      itemStyle: { color: '#febb02' }
    }],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  };

  // Property Performance Chart
  const propertyChartOptions = {
    title: {
      text: 'Property Performance',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: ${c} ({d}%)'
    },
    series: [{
      name: 'Revenue',
      type: 'pie',
      radius: '60%',
      data: analytics.properties?.map(prop => ({
        value: prop.revenue,
        name: prop.name
      })) || [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  // User Analytics Chart
  const userChartOptions = {
    title: {
      text: 'User Growth',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['New Users', 'Returning Users']
    },
    xAxis: {
      type: 'category',
      data: analytics.users?.slice(-14).map(item => 
        new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ) || []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'New Users',
        type: 'line',
        data: analytics.users?.slice(-14).map(item => item.newUsers) || [],
        itemStyle: { color: '#008234' }
      },
      {
        name: 'Returning Users',
        type: 'line',
        data: analytics.users?.slice(-14).map(item => item.returningUsers) || [],
        itemStyle: { color: '#003580' }
      }
    ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    }
  };

  const handleExportData = () => {
    const dataToExport = {
      timestamp: new Date().toISOString(),
      timeRange: selectedTimeRange,
      kpiMetrics: kpiCards,
      analytics: analytics
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-booking-blue border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into your booking performance
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-booking-blue focus:border-transparent"
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button
            onClick={loadAnalyticsData}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiRefreshCw} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-4 py-2 bg-booking-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiDownload} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="bg-gradient-to-r from-booking-blue to-blue-800 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">Real-time Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{realTimeData.activeUsers}</div>
            <div className="text-blue-100">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{realTimeData.currentBookings}</div>
            <div className="text-blue-100">Current Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${realTimeData.todayRevenue.toLocaleString()}</div>
            <div className="text-blue-100">Today's Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{realTimeData.conversionRate}%</div>
            <div className="text-blue-100">Conversion Rate</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <SafeIcon icon={FiTrendingUp} className="mr-1" />
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${kpi.color}`}>
                <SafeIcon icon={kpi.icon} className="text-white text-xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ReactECharts
            option={revenueChartOptions}
            style={{ height: '350px' }}
          />
        </div>

        {/* Bookings Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ReactECharts
            option={bookingsChartOptions}
            style={{ height: '350px' }}
          />
        </div>

        {/* Property Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ReactECharts
            option={propertyChartOptions}
            style={{ height: '350px' }}
          />
        </div>

        {/* User Growth */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ReactECharts
            option={userChartOptions}
            style={{ height: '350px' }}
          />
        </div>
      </div>

      {/* Performance Metrics Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Property Performance Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Property</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Bookings</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {analytics.properties?.map((property) => (
                <tr key={property.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium">{property.name}</td>
                  <td className="py-3 px-4">{property.bookings}</td>
                  <td className="py-3 px-4">${property.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <SafeIcon icon={FiEye} className="text-yellow-400 mr-1" />
                      {property.rating}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-booking-blue h-2 rounded-full"
                          style={{ width: `${property.occupancy}%` }}
                        />
                      </div>
                      <span className="text-sm">{property.occupancy}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;