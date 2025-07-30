import {
  UserRoles,
  QuoteTypes,
  QuoteStatus,
  PolicyStatus,
  ClaimStatus,
  PaymentStatus,
  PaymentMethods,
} from "../types";

// Mock Users Data
export const mockUsers = [
  {
    id: "1",
    email: "john.doe@email.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    phone: "(555) 123-4567",
    role: UserRoles.CUSTOMER,
    dateOfBirth: "1985-06-15",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    email: "agent@insurance.com",
    password: "agent123",
    firstName: "Sarah",
    lastName: "Wilson",
    phone: "(555) 987-6543",
    role: UserRoles.AGENT,
    dateOfBirth: "1980-03-22",
    address: {
      street: "456 Business Ave",
      city: "Corporate City",
      state: "NY",
      zipCode: "54321",
      country: "USA",
    },
    createdAt: "2023-08-10T09:30:00Z",
  },
  {
    id: "3",
    email: "admin@insurance.com",
    password: "admin123",
    firstName: "Mike",
    lastName: "Johnson",
    phone: "(555) 456-7890",
    role: UserRoles.ADMIN,
    dateOfBirth: "1975-11-08",
    address: {
      street: "789 Executive Blvd",
      city: "Admin City",
      state: "TX",
      zipCode: "67890",
      country: "USA",
    },
    createdAt: "2023-01-01T10:00:00Z",
  },
];

// Mock Quotes Data
export const mockQuotes = [
  {
    id: "1",
    userId: "1",
    type: QuoteTypes.AUTO,
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "(555) 123-4567",
      dateOfBirth: "1985-06-15",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
    },
    coverageDetails: {
      coverageType: "Full Coverage",
      coverageAmount: 100000,
      deductible: 1000,
      vehicleInfo: {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        vin: "1HGBH41JXMN109186",
        mileage: 25000,
        usage: "personal",
      },
    },
    premium: 850,
    status: QuoteStatus.ACTIVE,
    createdAt: "2024-01-20T10:30:00Z",
    expiresAt: "2024-02-20T10:30:00Z",
    validUntil: "2024-02-20T10:30:00Z",
  },
  {
    id: "2",
    userId: "1",
    type: QuoteTypes.HOME,
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "(555) 123-4567",
      dateOfBirth: "1985-06-15",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
    },
    coverageDetails: {
      coverageType: "Homeowners",
      coverageAmount: 250000,
      deductible: 2500,
      homeInfo: {
        propertyType: "house",
        yearBuilt: 2005,
        squareFootage: 2400,
        constructionType: "Wood Frame",
        features: ["Security System", "Fire Sprinklers", "Updated Electrical"],
      },
    },
    premium: 1200,
    status: QuoteStatus.ACTIVE,
    createdAt: "2024-01-18T14:15:00Z",
    expiresAt: "2024-02-18T14:15:00Z",
    validUntil: "2024-02-18T14:15:00Z",
  },
];

// Mock Policies Data
export const mockPolicies = [
  {
    id: "1",
    userId: "1",
    quoteId: "1",
    policyNumber: "POL-20240115-001",
    type: QuoteTypes.AUTO,
    status: PolicyStatus.ACTIVE,
    premium: 850,
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2025-01-15T00:00:00Z",
    nextPaymentDate: "2024-02-15T00:00:00Z",
    coverageDetails: {
      coverageType: "Full Coverage",
      coverageAmount: 100000,
      deductible: 1000,
      vehicleInfo: {
        make: "Toyota",
        model: "Camry",
        year: 2020,
        vin: "1HGBH41JXMN109186",
        mileage: 25000,
        usage: "personal",
      },
    },
    documents: [
      {
        id: "1",
        name: "Policy Document",
        type: "PDF",
        url: "/documents/policy-1.pdf",
        uploadedAt: "2024-01-15T10:00:00Z",
      },
    ],
  },
  {
    id: "2",
    userId: "1",
    quoteId: "2",
    policyNumber: "POL-20240118-002",
    type: QuoteTypes.HOME,
    status: PolicyStatus.ACTIVE,
    premium: 1200,
    startDate: "2024-01-18T00:00:00Z",
    endDate: "2025-01-18T00:00:00Z",
    nextPaymentDate: "2024-02-18T00:00:00Z",
    coverageDetails: {
      coverageType: "Homeowners",
      coverageAmount: 250000,
      deductible: 2500,
      homeInfo: {
        propertyType: "house",
        yearBuilt: 2005,
        squareFootage: 2400,
        constructionType: "Wood Frame",
        features: ["Security System", "Fire Sprinklers", "Updated Electrical"],
      },
    },
    documents: [
      {
        id: "2",
        name: "Home Policy Document",
        type: "PDF",
        url: "/documents/policy-2.pdf",
        uploadedAt: "2024-01-18T16:00:00Z",
      },
    ],
  },
];

// Mock Claims Data
export const mockClaims = [
  {
    id: "1",
    userId: "1",
    policyId: "1",
    claimNumber: "CLM-20240120-001",
    type: "Vehicle Accident",
    description:
      "Rear-end collision at intersection. Damage to rear bumper and trunk.",
    amount: 3500,
    status: ClaimStatus.PROCESSING,
    dateOfIncident: "2024-01-19T16:30:00Z",
    dateReported: "2024-01-20T09:15:00Z",
    attachments: [
      {
        id: "1",
        name: "accident-photo-1.jpg",
        type: "image/jpeg",
        size: 2048576,
        url: "/uploads/accident-photo-1.jpg",
      },
      {
        id: "2",
        name: "police-report.pdf",
        type: "application/pdf",
        size: 1024000,
        url: "/uploads/police-report.pdf",
      },
    ],
    messages: [
      {
        id: "1",
        senderId: "1",
        senderName: "John Doe",
        message:
          "I was stopped at a red light when another vehicle hit me from behind.",
        timestamp: "2024-01-20T09:20:00Z",
      },
      {
        id: "2",
        senderId: "2",
        senderName: "Sarah Wilson",
        message:
          "Thank you for reporting this claim. We have received your documentation and will begin processing immediately.",
        timestamp: "2024-01-20T11:30:00Z",
      },
    ],
  },
];

// Mock Payments Data
export const mockPayments = [
  {
    id: "1",
    userId: "1",
    policyId: "1",
    amount: 850,
    status: PaymentStatus.COMPLETED,
    method: PaymentMethods.CREDIT_CARD,
    date: "2024-01-15T10:00:00Z",
    dueDate: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    userId: "1",
    policyId: "2",
    amount: 1200,
    status: PaymentStatus.COMPLETED,
    method: PaymentMethods.BANK_TRANSFER,
    date: "2024-01-18T14:30:00Z",
    dueDate: "2024-01-18T00:00:00Z",
  },
  {
    id: "3",
    userId: "1",
    policyId: "1",
    amount: 850,
    status: PaymentStatus.PENDING,
    method: PaymentMethods.CREDIT_CARD,
    date: null,
    dueDate: "2024-02-15T00:00:00Z",
  },
  {
    id: "4",
    userId: "1",
    policyId: "2",
    amount: 1200,
    status: PaymentStatus.PENDING,
    method: PaymentMethods.BANK_TRANSFER,
    date: null,
    dueDate: "2024-02-18T00:00:00Z",
  },
];

// FAQ Data
export const mockFAQs = [
  {
    id: "1",
    category: "General",
    question: "How do I file a claim?",
    answer:
      'You can file a claim through your customer portal by clicking on "File a Claim" and following the step-by-step process. You\'ll need to provide details about the incident and upload supporting documents.',
  },
  {
    id: "2",
    category: "Billing",
    question: "When is my payment due?",
    answer:
      'Payment dates vary based on your policy terms. You can view your next payment due date in your customer dashboard under the "Payments" section.',
  },
  {
    id: "3",
    category: "Coverage",
    question: "What does my auto insurance cover?",
    answer:
      "Auto insurance coverage varies by policy type. Full coverage typically includes liability, collision, comprehensive, and uninsured motorist protection. Check your policy documents for specific details.",
  },
  {
    id: "4",
    category: "General",
    question: "How can I update my contact information?",
    answer:
      "You can update your contact information by logging into your customer portal and navigating to your profile settings.",
  },
  {
    id: "5",
    category: "Claims",
    question: "How long does claim processing take?",
    answer:
      "Claim processing times vary depending on the complexity of the claim. Simple claims may be processed within 3-5 business days, while more complex claims may take 2-3 weeks.",
  },
];

// Blog Posts Data
export const mockBlogPosts = [
  {
    id: "1",
    title: "Understanding Your Auto Insurance Coverage",
    excerpt:
      "Learn about the different types of auto insurance coverage and what each one protects.",
    content:
      "Auto insurance can be complex, but understanding your coverage is essential...",
    author: "Insurance Expert Team",
    publishedAt: "2024-01-15T10:00:00Z",
    category: "Auto Insurance",
    readTime: "5 min read",
    image:
      "https://images.pexels.com/photos/1028742/pexels-photo-1028742.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "2",
    title: "5 Ways to Lower Your Home Insurance Premium",
    excerpt:
      "Discover practical tips to reduce your home insurance costs without sacrificing coverage.",
    content:
      "Home insurance is a significant expense, but there are several ways to reduce your premium...",
    author: "Sarah Wilson",
    publishedAt: "2024-01-10T14:30:00Z",
    category: "Home Insurance",
    readTime: "7 min read",
    image:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "3",
    title: "Life Insurance: Term vs Whole Life",
    excerpt:
      "Compare term and whole life insurance to determine which option is best for your needs.",
    content:
      "Choosing between term and whole life insurance is one of the most important decisions...",
    author: "Mike Johnson",
    publishedAt: "2024-01-05T09:15:00Z",
    category: "Life Insurance",
    readTime: "6 min read",
    image:
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];
