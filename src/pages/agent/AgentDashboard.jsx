import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { fetchPolicies } from "../../store/policiesSlice";
import { fetchClaims } from "../../store/claimsSlice";
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
  LineChart,
  Line,
} from "recharts";

const AgentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { policies, loading } = useSelector((state) => state.policies);
  const { claims } = useSelector((state) => state.claims);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  useEffect(() => {
    dispatch(fetchPolicies());
    dispatch(fetchClaims());
  }, [dispatch]);

  // Mock agent-specific data
  const agentStats = {
    totalClients: 45,
    activePolicies: policies.filter((p) => p.status === "active").length,
    monthlyCommission: 8500,
    quotesGenerated: 23,
  };

  const recentActivities = [
    {
      id: 1,
      type: "quote",
      client: "John Smith",
      action: "Generated auto quote",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "policy",
      client: "Sarah Johnson",
      action: "Policy renewed",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "claim",
      client: "Mike Davis",
      action: "Claim approved",
      time: "1 day ago",
    },
    {
      id: 4,
      type: "meeting",
      client: "Lisa Wilson",
      action: "Consultation scheduled",
      time: "2 days ago",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: "Follow up with John Smith on auto quote",
      due: "2024-01-25T10:00:00Z",
      priority: "high",
    },
    {
      id: 2,
      task: "Review claim documentation for Sarah Johnson",
      due: "2024-01-25T14:00:00Z",
      priority: "medium",
    },
    {
      id: 3,
      task: "Prepare renewal quotes for March expiring policies",
      due: "2024-01-26T09:00:00Z",
      priority: "low",
    },
    {
      id: 4,
      task: "Client meeting with Mike Davis",
      due: "2024-01-26T15:00:00Z",
      priority: "high",
    },
  ];

  const performanceData = [
    { month: "Jul", policies: 12, commission: 6800 },
    { month: "Aug", policies: 15, commission: 7200 },
    { month: "Sep", policies: 18, commission: 8100 },
    { month: "Oct", policies: 22, commission: 8900 },
    { month: "Nov", policies: 19, commission: 8200 },
    { month: "Dec", policies: 25, commission: 9500 },
  ];

  const clientData = [
    {
      name: "John Smith",
      email: "john@email.com",
      phone: "(555) 123-4567",
      policies: 2,
      lastContact: "2024-01-20T10:00:00Z",
    },
    {
      name: "Sarah Johnson",
      email: "sarah@email.com",
      phone: "(555) 234-5678",
      policies: 1,
      lastContact: "2024-01-18T14:30:00Z",
    },
    {
      name: "Mike Davis",
      email: "mike@email.com",
      phone: "(555) 345-6789",
      policies: 3,
      lastContact: "2024-01-15T09:15:00Z",
    },
    {
      name: "Lisa Wilson",
      email: "lisa@email.com",
      phone: "(555) 456-7890",
      policies: 1,
      lastContact: "2024-01-22T16:45:00Z",
    },
  ];

  const filteredClients = clientData.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    {
      title: "Total Clients",
      value: agentStats.totalClients,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      change: "+3 this month",
    },
    {
      title: "Active Policies",
      value: agentStats.activePolicies,
      icon: FileText,
      color: "bg-green-100 text-green-600",
      change: "+8 this month",
    },
    {
      title: "Monthly Commission",
      value: formatCurrency(agentStats.monthlyCommission),
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
      change: "+12% from last month",
    },
    {
      title: "Quotes Generated",
      value: agentStats.quotesGenerated,
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
      change: "+5 this week",
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.firstName}! Here's your performance overview.
          </p>
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Performance Trends
              </h3>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    name === "commission" ? formatCurrency(value) : value,
                    name === "commission" ? "Commission" : "Policies",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="policies"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="commission"
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Activities */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Recent Activities
            </h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === "quote"
                        ? "bg-blue-100"
                        : activity.type === "policy"
                        ? "bg-green-100"
                        : activity.type === "claim"
                        ? "bg-yellow-100"
                        : "bg-purple-100"
                    }`}
                  >
                    {activity.type === "quote" && (
                      <FileText className="w-4 h-4 text-blue-600" />
                    )}
                    {activity.type === "policy" && (
                      <FileText className="w-4 h-4 text-green-600" />
                    )}
                    {activity.type === "claim" && (
                      <FileText className="w-4 h-4 text-yellow-600" />
                    )}
                    {activity.type === "meeting" && (
                      <Calendar className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.client}
                    </p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tasks and Clients Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upcoming Tasks */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Upcoming Tasks
            </h3>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {task.task}
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {formatDate(task.due)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center">
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-sm">New Quote</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Users className="w-6 h-6 mb-2" />
                <span className="text-sm">Add Client</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <Calendar className="w-6 h-6 mb-2" />
                <span className="text-sm">Schedule Meeting</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
              >
                <FileText className="w-6 h-6 mb-2" />
                <span className="text-sm">Generate Report</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Client Management */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Client Management
            </h3>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Client List */}
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <div
                key={client.name}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {client.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{client.name}</h4>
                    <p className="text-sm text-gray-600">{client.email}</p>
                    <p className="text-sm text-gray-500">
                      Last contact: {formatDate(client.lastContact)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {client.policies} policies
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;
