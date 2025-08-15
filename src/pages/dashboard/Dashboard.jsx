import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Shield,
  DollarSign,
  FileText,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ArrowRight,
  Plus,
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
} from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { policies, loading: policiesLoading } = useSelector(
    (state) => state.policies
  );
  const { claims } = useSelector((state) => state.claims);
  const { payments, upcomingPayments } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPolicies());
    dispatch(fetchClaims());
    dispatch(fetchPayments());
  }, [dispatch]);

  // Calculate stats
  const activePolicies = policies.filter((p) => p.status === "active");
  const pendingClaims = claims.filter(
    (c) => c.status === "pending" || c.status === "processing"
  );
  const totalPremium = activePolicies.reduce(
    (sum, policy) => sum + policy.premium,
    0
  );
  const upcomingPaymentsTotal = upcomingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );

  // Chart data
  const policyData = [
    {
      name: "Auto",
      value: policies.filter((p) => p.type === "auto").length,
      color: "#3B82F6",
    },
    {
      name: "Home",
      value: policies.filter((p) => p.type === "home").length,
      color: "#10B981",
    },
    {
      name: "Life",
      value: policies.filter((p) => p.type === "life").length,
      color: "#F59E0B",
    },
    {
      name: "Health",
      value: policies.filter((p) => p.type === "health").length,
      color: "#EF4444",
    },
  ];

  const monthlyData = [
    { month: "Jan", premium: 2400, claims: 800 },
    { month: "Feb", premium: 2100, claims: 600 },
    { month: "Mar", premium: 2800, claims: 1200 },
    { month: "Apr", premium: 2600, claims: 900 },
    { month: "May", premium: 2900, claims: 700 },
    { month: "Jun", premium: 3200, claims: 1100 },
  ];

  const stats = [
    {
      title: "Active Policies",
      value: activePolicies.length,
      icon: Shield,
      color: "bg-blue-100 text-blue-600",
      change: "+2 this month",
    },
    {
      title: "Total Premium",
      value: formatCurrency(totalPremium),
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
      change: "+5.2% from last month",
    },
    {
      title: "Pending Claims",
      value: pendingClaims.length,
      icon: FileText,
      color: "bg-yellow-100 text-yellow-600",
      change: "2 awaiting review",
    },
    {
      title: "Upcoming Payments",
      value: formatCurrency(upcomingPaymentsTotal),
      icon: Calendar,
      color: "bg-purple-100 text-purple-600",
      change: "Due in 15 days",
    },
  ];

  if (policiesLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your insurance portfolio and recent activity.
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
          {/* Monthly Overview */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Monthly Overview
              </h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="premium" fill="#3B82F6" name="Premium" />
                <Bar dataKey="claims" fill="#EF4444" name="Claims" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Policy Distribution */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Policy Distribution
              </h3>
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={policyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {policyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {policyData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/quote">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500">
              <div className="text-center py-8">
                <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Get New Quote
                </h3>
                <p className="text-gray-600 text-sm">
                  Add more coverage to your portfolio
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/dashboard/claims">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  File a Claim
                </h3>
                <p className="text-gray-600 text-sm">
                  Report an incident and start your claim
                </p>
              </div>
            </Card>
          </Link>

          <Link to="/dashboard/payments">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  Make Payment
                </h3>
                <p className="text-gray-600 text-sm">
                  Pay your premium or outstanding balance
                </p>
              </div>
            </Card>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Policies */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Policies
              </h3>
              <Link to="/dashboard/policies">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {activePolicies.slice(0, 3).map((policy) => (
                <div
                  key={policy.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {policy.type.charAt(0).toUpperCase() +
                        policy.type.slice(1)}{" "}
                      Insurance
                    </h4>
                    <p className="text-sm text-gray-600">
                      Policy #{policy.policyNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      Next payment: {formatDate(policy.nextPaymentDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        policy.status
                      )}`}
                    >
                      {policy.status}
                    </span>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatCurrency(policy.premium)}/month
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Claims */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Claims
              </h3>
              <Link to="/dashboard/claims">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            {claims.length > 0 ? (
              <div className="space-y-4">
                {claims.slice(0, 3).map((claim) => (
                  <div
                    key={claim.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {claim.type}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Claim #{claim.claimNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        Filed: {formatDate(claim.dateReported)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          claim.status
                        )}`}
                      >
                        {claim.status}
                      </span>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {formatCurrency(claim.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No claims filed yet</p>
                <Link to="/dashboard/claims">
                  <Button variant="outline" size="sm" className="mt-2">
                    File Your First Claim
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Alerts */}
        {upcomingPayments.length > 0 && (
          <Card className="mt-8 bg-yellow-50 border-yellow-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900">
                  Upcoming Payments
                </h3>
                <p className="text-yellow-800 mt-1">
                  You have {upcomingPayments.length} payment(s) due in the next
                  30 days totaling {formatCurrency(upcomingPaymentsTotal)}.
                </p>
                <Link to="/dashboard/payments">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                  >
                    View Payments
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
