import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FileText,
  Plus,
  Upload,
  Send,
  Paperclip,
  MessageCircle,
  Calendar,
  DollarSign,
  Search,
  Filter,
} from "lucide-react";
import {
  fetchClaims,
  createClaim,
  addClaimMessage,
} from "../../store/claimsSlice";
import { fetchPolicies } from "../../store/policiesSlice";
import { claimSchema } from "../../utils/validationSchemas";
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

const Claims = () => {
  const dispatch = useDispatch();
  const { claims, loading } = useSelector((state) => state.claims);
  const { policies } = useSelector((state) => state.policies);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showClaimDetails, setShowClaimDetails] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(claimSchema),
  });

  useEffect(() => {
    dispatch(fetchClaims());
    dispatch(fetchPolicies());
  }, [dispatch]);

  const activePolicies = policies.filter((p) => p.status === "active");

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type,
      size: file.size,
      file: file,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const onSubmitClaim = async (data) => {
    try {
      const claimData = {
        ...data,
        userId: user.id,
        attachments: uploadedFiles,
      };

      await dispatch(createClaim(claimData)).unwrap();
      toast.success("Claim filed successfully!");
      setShowNewClaimModal(false);
      reset();
      setUploadedFiles([]);
    } catch (error) {
      toast.error("Failed to file claim");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedClaim) return;

    try {
      await dispatch(
        addClaimMessage({
          claimId: selectedClaim.id,
          message: {
            senderId: user.id,
            senderName: `${user.firstName} ${user.lastName}`,
            message: newMessage,
          },
        })
      ).unwrap();

      setNewMessage("");
      toast.success("Message sent successfully");
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  const claimTypes = [
    "Vehicle Accident",
    "Property Damage",
    "Theft",
    "Fire Damage",
    "Water Damage",
    "Medical Claim",
    "Other",
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Claims</h1>
            <p className="text-gray-600 mt-2">
              File and track your insurance claims
            </p>
          </div>
          <Button
            onClick={() => setShowNewClaimModal(true)}
            className="mt-4 md:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            File New Claim
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search claims..."
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </select>
          </div>
        </Card>

        {/* Claims List */}
        {filteredClaims.length > 0 ? (
          <div className="space-y-6">
            {filteredClaims.map((claim) => (
              <Card
                key={claim.id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {claim.type}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Claim #{claim.claimNumber}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      claim.status
                    )}`}
                  >
                    {claim.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Date Filed</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(claim.dateReported)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Claim Amount</p>
                      <p className="font-medium text-gray-900">
                        {formatCurrency(claim.amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Messages</p>
                      <p className="font-medium text-gray-900">
                        {claim.messages?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{claim.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {claim.attachments?.length > 0 && (
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Paperclip className="w-4 h-4" />
                        <span>{claim.attachments.length} attachment(s)</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedClaim(claim);
                      setShowClaimDetails(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No claims found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "No claims match your current filters."
                : "You haven't filed any claims yet."}
            </p>
            <Button onClick={() => setShowNewClaimModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              File Your First Claim
            </Button>
          </div>
        )}

        {/* New Claim Modal */}
        <Modal
          isOpen={showNewClaimModal}
          onClose={() => setShowNewClaimModal(false)}
          title="File New Claim"
          size="lg"
        >
          <form onSubmit={handleSubmit(onSubmitClaim)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Policy *
              </label>
              <select
                {...register("policyId")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a policy</option>
                {activePolicies.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)}{" "}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Claim Type *
              </label>
              <select
                {...register("type")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select claim type</option>
                {claimTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Incident *
              </label>
              <input
                {...register("dateOfIncident")}
                type="date"
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.dateOfIncident && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dateOfIncident.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Amount *
              </label>
              <input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
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
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Please provide a detailed description of what happened..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Documents
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">
                  Upload photos, receipts, or other documents
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" size="sm">
                    Choose Files
                  </Button>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                File Claim
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewClaimModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>

        {/* Claim Details Modal */}
        <Modal
          isOpen={showClaimDetails}
          onClose={() => setShowClaimDetails(false)}
          title={`Claim Details - ${selectedClaim?.claimNumber}`}
          size="lg"
        >
          {selectedClaim && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      selectedClaim.status
                    )}`}
                  >
                    {selectedClaim.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-medium">
                    {formatCurrency(selectedClaim.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date Filed</p>
                  <p className="font-medium">
                    {formatDate(selectedClaim.dateReported)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Incident Date</p>
                  <p className="font-medium">
                    {formatDate(selectedClaim.dateOfIncident)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-900">{selectedClaim.description}</p>
              </div>

              {selectedClaim.messages && selectedClaim.messages.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Messages</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedClaim.messages.map((message) => (
                      <div
                        key={message.id}
                        className="bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">
                            {message.senderName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">
                          {message.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send Message
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Claims;
