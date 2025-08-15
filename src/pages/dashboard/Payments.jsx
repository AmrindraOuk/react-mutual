import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CreditCard,
  Calendar,
  DollarSign,
  Plus,
  Download,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  fetchPayments,
  makePayment,
  fetchUpcomingPayments,
} from "../../store/paymentsSlice";
import { fetchPolicies } from "../../store/policiesSlice";
import { paymentSchema } from "../../utils/validationSchemas";
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

const Payments = () => {
  const dispatch = useDispatch();
  const { payments, upcomingPayments, loading } = useSelector(
    (state) => state.payments
  );
  const { policies } = useSelector((state) => state.policies);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(paymentSchema),
  });

  const selectedPolicyId = watch("policyId");
  const selectedPolicy = policies.find((p) => p.id === selectedPolicyId);

  useEffect(() => {
    dispatch(fetchPayments());
    dispatch(fetchUpcomingPayments());
    dispatch(fetchPolicies());
  }, [dispatch]);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const onSubmitPayment = async (data) => {
    try {
      const paymentData = {
        ...data,
        userId: user.id,
        policyId: selectedPolicy.id,
      };

      await dispatch(makePayment(paymentData)).unwrap();
      toast.success("Payment processed successfully!");
      setShowPaymentModal(false);
      reset();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleDownloadReceipt = (payment) => {
    const receiptData = {
      paymentId: payment.id,
      amount: payment.amount,
      method: payment.method,
      date: payment.date,
      status: payment.status,
      policyId: payment.policyId,
      generatedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `payment-receipt-${payment.id}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Receipt downloaded!");
  };

  // Calculate stats
  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const overduePayments = upcomingPayments.filter(
    (p) => new Date(p.dueDate) < new Date() && p.status === "pending"
  );

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
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-2">
              Manage your premium payments and billing
            </p>
          </div>
          <Button
            onClick={() => setShowPaymentModal(true)}
            className="mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Make Payment
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(pendingAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {overduePayments.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Overdue Payments Alert */}
        {overduePayments.length > 0 && (
          <Alert type="error" className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Overdue Payments</h3>
                <p className="mt-1">
                  You have {overduePayments.length} overdue payment(s). Please
                  make a payment to avoid policy cancellation.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setShowPaymentModal(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                Pay Now
              </Button>
            </div>
          </Alert>
        )}

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <Card className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Payments
            </h3>
            <div className="space-y-3">
              {upcomingPayments.slice(0, 3).map((payment) => {
                const policy = policies.find((p) => p.id === payment.policyId);
                const isOverdue = new Date(payment.dueDate) < new Date();

                return (
                  <div
                    key={payment.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      isOverdue
                        ? "bg-red-50 border border-red-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {policy?.type.charAt(0).toUpperCase() +
                          policy?.type.slice(1)}{" "}
                        Insurance
                      </h4>
                      <p className="text-sm text-gray-600">
                        Policy #{policy?.policyNumber}
                      </p>
                      <p
                        className={`text-sm ${
                          isOverdue
                            ? "text-red-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        Due: {formatDate(payment.dueDate)}{" "}
                        {isOverdue && "(Overdue)"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentModal(true);
                        }}
                        className={
                          isOverdue ? "bg-red-600 hover:bg-red-700" : ""
                        }
                      >
                        Pay Now
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </Card>

        {/* Payment History */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Payment History
          </h3>
          {filteredPayments.length > 0 ? (
            <div className="space-y-4">
              {filteredPayments.map((payment) => {
                const policy = policies.find((p) => p.id === payment.policyId);

                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {policy?.type.charAt(0).toUpperCase() +
                            policy?.type.slice(1)}{" "}
                          Insurance Premium
                        </h4>
                        <p className="text-sm text-gray-600">
                          {payment.method.replace("_", " ").toUpperCase()} •{" "}
                          {formatDate(payment.date || payment.dueDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            payment.status
                          )}`}
                        >
                          {payment.status}
                        </span>
                      </div>
                      {payment.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadReceipt(payment)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No payments found
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "No payments match your current filters."
                  : "You haven't made any payments yet."}
              </p>
            </div>
          )}
        </Card>

        {/* Payment Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPayment(null);
            reset();
          }}
          title="Make Payment"
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmitPayment)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Policy *
              </label>
              <select
                {...register("policyId")}
                defaultValue={selectedPayment?.policyId || ""}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a policy</option>
                {policies
                  .filter((p) => p.status === "active")
                  .map((policy) => (
                    <option key={policy.id} value={policy.id}>
                      {policy.type.charAt(0).toUpperCase() +
                        policy.type.slice(1)}{" "}
                      - {policy.policyNumber}
                    </option>
                  ))}
              </select>
              {errors.policyId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.policyId.message}
                </p>
              )}
            </div>

            {selectedPolicy && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Policy Details
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Monthly Premium:</span>
                    <span className="font-medium ml-2">
                      {formatCurrency(selectedPolicy.premium)}
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-700">Next Due:</span>
                    <span className="font-medium ml-2">
                      {formatDate(selectedPolicy.nextPaymentDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount *
              </label>
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                defaultValue={
                  selectedPayment?.amount || selectedPolicy?.premium || ""
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                {...register("method")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select payment method</option>
                <option value="credit_card">Credit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
              </select>
              {errors.method && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.method.message}
                </p>
              )}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Payment Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment Amount:</span>
                  <span className="font-medium">
                    {watch("amount")
                      ? formatCurrency(Number(watch("amount")))
                      : "$0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>
                    {watch("amount")
                      ? formatCurrency(Number(watch("amount")))
                      : "$0.00"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                Process Payment
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedPayment(null);
                  reset();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Payments;
