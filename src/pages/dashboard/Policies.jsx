import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Shield,
  Download,
  RefreshCw,
  X,
  Calendar,
  DollarSign,
  FileText,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import {
  fetchPolicies,
  renewPolicy,
  cancelPolicy,
} from "../../store/policiesSlice";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../../utils/helpers";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Alert from "../../components/common/Alert";
import toast from "react-hot-toast";

const Policies = () => {
  const dispatch = useDispatch();
  const { policies, loading } = useSelector((state) => state.policies);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPolicies());
  }, [dispatch]);

  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || policy.status === statusFilter;
    const matchesType = typeFilter === "all" || policy.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRenewPolicy = async () => {
    if (!selectedPolicy) return;

    setActionLoading(true);
    try {
      await dispatch(renewPolicy(selectedPolicy.id)).unwrap();
      toast.success("Policy renewed successfully!");
      setShowRenewModal(false);
      setSelectedPolicy(null);
    } catch (error) {
      toast.error("Failed to renew policy");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelPolicy = async () => {
    if (!selectedPolicy) return;

    setActionLoading(true);
    try {
      await dispatch(cancelPolicy(selectedPolicy.id)).unwrap();
      toast.success("Policy cancelled successfully");
      setShowCancelModal(false);
      setSelectedPolicy(null);
    } catch (error) {
      toast.error("Failed to cancel policy");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadDocument = (policy) => {
    // Simulate document download
    const docData = {
      policyNumber: policy.policyNumber,
      type: policy.type,
      status: policy.status,
      premium: policy.premium,
      startDate: policy.startDate,
      endDate: policy.endDate,
      generatedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(docData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `policy-${policy.policyNumber}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Policy document downloaded!");
  };

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Policies</h1>
            <p className="text-gray-600 mt-2">
              Manage your insurance policies and coverage
            </p>
          </div>
          <Link to="/quote">
            <Button className="mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Get New Quote
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="auto">Auto</option>
                <option value="home">Home</option>
                <option value="life">Life</option>
                <option value="health">Health</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Policies Grid */}
        {filteredPolicies.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPolicies.map((policy) => (
              <Card
                key={policy.id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {policy.type.charAt(0).toUpperCase() +
                          policy.type.slice(1)}{" "}
                        Insurance
                      </h3>
                      <p className="text-sm text-gray-600">
                        Policy #{policy.policyNumber}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      policy.status
                    )}`}
                  >
                    {policy.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Premium</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(policy.premium)}/month
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Coverage</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(policy.coverageDetails.coverageAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(policy.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(policy.endDate)}
                    </p>
                  </div>
                </div>

                {policy.status === "active" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        Next payment due: {formatDate(policy.nextPaymentDate)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadDocument(policy)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>

                  {policy.status === "active" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPolicy(policy);
                          setShowRenewModal(true);
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Renew
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPolicy(policy);
                          setShowCancelModal(true);
                        }}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No policies found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "No policies match your current filters."
                : "You don't have any insurance policies yet."}
            </p>
            <Link to="/quote">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Get Your First Quote
              </Button>
            </Link>
          </div>
        )}

        {/* Renew Policy Modal */}
        <Modal
          isOpen={showRenewModal}
          onClose={() => setShowRenewModal(false)}
          title="Renew Policy"
        >
          {selectedPolicy && (
            <div>
              <Alert type="info" className="mb-4">
                You are about to renew your {selectedPolicy.type} insurance
                policy.
              </Alert>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Policy Number:</span>
                  <span className="font-medium">
                    {selectedPolicy.policyNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Premium:</span>
                  <span className="font-medium">
                    {formatCurrency(selectedPolicy.premium)}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New Term:</span>
                  <span className="font-medium">12 months</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleRenewPolicy}
                  loading={actionLoading}
                  className="flex-1"
                >
                  Confirm Renewal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowRenewModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Cancel Policy Modal */}
        <Modal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          title="Cancel Policy"
        >
          {selectedPolicy && (
            <div>
              <Alert type="warning" className="mb-4">
                Are you sure you want to cancel this policy? This action cannot
                be undone.
              </Alert>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Policy Number:</span>
                  <span className="font-medium">
                    {selectedPolicy.policyNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">
                    {selectedPolicy.type.charAt(0).toUpperCase() +
                      selectedPolicy.type.slice(1)}{" "}
                    Insurance
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancellation Date:</span>
                  <span className="font-medium">
                    {formatDate(new Date().toISOString())}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="danger"
                  onClick={handleCancelPolicy}
                  loading={actionLoading}
                  className="flex-1"
                >
                  Confirm Cancellation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1"
                >
                  Keep Policy
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Policies;
