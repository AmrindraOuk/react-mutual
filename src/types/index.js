// Core types and interfaces for the insurance application

export const UserRoles = {
  CUSTOMER: "customer",
  AGENT: "agent",
  ADMIN: "admin",
};

export const QuoteTypes = {
  AUTO: "auto",
  HOME: "home",
  LIFE: "life",
  HEALTH: "health",
};

export const QuoteStatus = {
  DRAFT: "draft",
  ACTIVE: "active",
  EXPIRED: "expired",
};

export const PolicyStatus = {
  ACTIVE: "active",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
  PENDING: "pending",
};

export const ClaimStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  DENIED: "denied",
  PROCESSING: "processing",
};

export const PaymentStatus = {
  COMPLETED: "completed",
  PENDING: "pending",
  FAILED: "failed",
};

export const PaymentMethods = {
  CREDIT_CARD: "credit_card",
  BANK_TRANSFER: "bank_transfer",
  CHECK: "check",
};

// Default structures for forms and data
export const defaultUser = {
  id: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  role: UserRoles.CUSTOMER,
  dateOfBirth: "",
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  },
  createdAt: "",
};

export const defaultQuote = {
  id: "",
  userId: "",
  type: QuoteTypes.AUTO,
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
  },
  coverageDetails: {
    coverageType: "",
    coverageAmount: 0,
    deductible: 0,
  },
  premium: 0,
  status: QuoteStatus.DRAFT,
  createdAt: "",
  expiresAt: "",
  validUntil: "",
};

export const defaultPolicy = {
  id: "",
  userId: "",
  quoteId: "",
  policyNumber: "",
  type: QuoteTypes.AUTO,
  status: PolicyStatus.ACTIVE,
  premium: 0,
  startDate: "",
  endDate: "",
  nextPaymentDate: "",
  coverageDetails: {},
  documents: [],
};

export const defaultClaim = {
  id: "",
  userId: "",
  policyId: "",
  claimNumber: "",
  type: "",
  description: "",
  amount: 0,
  status: ClaimStatus.PENDING,
  dateOfIncident: "",
  dateReported: "",
  attachments: [],
  messages: [],
};
