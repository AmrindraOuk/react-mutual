import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Shield,
  Activity,
  BarChart3,
  Search,
  Filter,
  Download,
  Settings,
} from "lucide-react";
import { fetchPolicies } from "../../store/policiesSlice";
import { fetchClaims } from "../../store/claimsSlice";
import { fetchPayments } from "../../store/paymentsSlice";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../../utils/helpers";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { policies, loading } = useSelector((state) => state.policies);
  const { claims } = useSelector((state) => state.claims);
  const { payments } = useSelector((state) => state.payments);

  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchPolicies());
    dispatch(fetchClaims());
    dispatch(fetchPayments());
  }, [dispatch]);

  // Calculate comprehensive stats
  const totalUsers = 1250;
  const totalPolicies = policies.length;
  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const pendingClaims = claims.filter(
    (c) => c.status === "pending" || c.status === "processing"
  ).length;

  // Mock additional admin data
  const systemHealth = {
    uptime: "99.9%",
    responseTime: "120ms",
    errorRate: "0.1%",
    activeUsers: 342,
  };

  const revenueData = [
    { month: "Jan", revenue: 125000, policies: 180, claims: 45 },
    { month: "Feb", revenue: 132000, policies: 195, claims: 38 },
    { month: "Mar", revenue: 148000, policies: 210, claims: 52 },
    { month: "Apr", revenue: 155000, policies: 225, claims: 41 },
    { month: "May", revenue: 162000, policies: 240, claims: 48 },
    { month: "Jun", revenue: 178000, policies: 265, claims: 55 },
  ];

  const policyDistribution = [
    { name: "Auto", value: 45, color: "#3B82F6" },
    { name: "Home", value: 30, color: "#10B981" },
    { name: "Life", value: 15, color: "#F59E0B" },
    { name: "Health", value: 10, color: "#EF4444" },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@email.com",
      role: "customer",
      joinDate: "2024-01-20T10:00:00Z",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah@email.com",
      role: "agent",
      joinDate: "2024-01-18T14:30:00Z",
      status: "active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@email.com",
      role: "customer",
      joinDate: "2024-01-15T09:15:00Z",
      status: "inactive",
    },
    {
      id: 4,
      name: "Lisa Davis",
      email: "lisa@email.com",
      role: "customer",
      joinDate: "2024-01-22T16:45:00Z",
      status: "active",
    },
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      message: "High claim volume detected in auto insurance",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "info",
      message: "Monthly backup completed successfully",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "error",
      message: "Payment gateway timeout - resolved",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "success",
      message: "System update deployed successfully",
      time: "2 days ago",
    },
  ];

  const filteredUsers = recentUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      change: "+12% from last month",
    },
    {
      title: "Active Policies",
      value: totalPolicies.toLocaleString(),
      icon: Shield,
      color: "bg-green-100 text-green-600",
      change: "+8% from last month",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
      change: "+15% from last month",
    },
    {
      title: "Pending Claims",
      value: pendingClaims,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-600",
      change: "-5% from last month",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              System overview and management console
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* System Health */}
        <Card className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            System Health
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {systemHealth.uptime}
              </p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {systemHealth.responseTime}
              </p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">
                {systemHealth.errorRate}
              </p>
              <p className="text-sm text-gray-600">Error Rate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {systemHealth.activeUsers}
              </p>
              <p className="text-sm text-gray-600">Active Users</p>
            </div>
          </div>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trends */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Trends
              </h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "revenue" ? formatCurrency(value) : value,
                    name === "revenue"
                      ? "Revenue"
                      : name === "policies"
                      ? "Policies"
                      : "Claims",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="policies"
                  stroke="#10B981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="claims"
                  stroke="#EF4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Policy Distribution */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Policy Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={policyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {policyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {policyDistribution.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {entry.name} ({entry.value}%)
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Alerts and Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* System Alerts */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              System Alerts
            </h3>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      alert.type === "error"
                        ? "bg-red-100"
                        : alert.type === "warning"
                        ? "bg-yellow-100"
                        : alert.type === "success"
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        alert.type === "error"
                          ? "text-red-600"
                          : alert.type === "warning"
                          ? "text-yellow-600"
                          : alert.type === "success"
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Users */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Users
              </h3>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "agent"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(user.joinDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center">
              <Users className="w-6 h-6 mb-2" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <Shield className="w-6 h-6 mb-2" />
              <span className="text-sm">Policy Review</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <BarChart3 className="w-6 h-6 mb-2" />
              <span className="text-sm">Analytics</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <Settings className="w-6 h-6 mb-2" />
              <span className="text-sm">System Config</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
