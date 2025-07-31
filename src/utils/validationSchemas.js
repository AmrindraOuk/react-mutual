import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerSchema = yup.object({
  firstName: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(/(?=.*\d)/, "Password must contain at least one number")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  phone: yup
    .string()
    .matches(
      /^\(\d{3}\) \d{3}-\d{4}$/,
      "Phone number must be in format (555) 123-4567"
    )
    .required("Phone number is required"),
  dateOfBirth: yup
    .date()
    .max(new Date(), "Date of birth cannot be in the future")
    .required("Date of birth is required"),
});

export const quoteSchema = yup.object({
  type: yup
    .string()
    .oneOf(["auto", "home", "life", "health"])
    .required("Coverage type is required"),
  personalInfo: yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    phone: yup.string().required("Phone number is required"),
    dateOfBirth: yup.date().required("Date of birth is required"),
    address: yup.object({
      street: yup.string().required("Street address is required"),
      city: yup.string().required("City is required"),
      state: yup.string().required("State is required"),
      zipCode: yup
        .string()
        .matches(/^\d{5}(-\d{4})?$/, "Invalid ZIP code")
        .required("ZIP code is required"),
      country: yup.string().required("Country is required"),
    }),
  }),
  coverageDetails: yup.object({
    coverageType: yup.string().required("Coverage type is required"),
    coverageAmount: yup
      .number()
      .min(1000, "Coverage amount must be at least $1,000")
      .required("Coverage amount is required"),
    deductible: yup
      .number()
      .min(250, "Deductible must be at least $250")
      .required("Deductible is required"),
  }),
});

export const claimSchema = yup.object({
  policyId: yup.string().required("Please select a policy"),
  type: yup.string().required("Claim type is required"),
  description: yup
    .string()
    .min(20, "Description must be at least 20 characters")
    .required("Description is required"),
  dateOfIncident: yup
    .date()
    .max(new Date(), "Incident date cannot be in the future")
    .required("Incident date is required"),
  amount: yup
    .number()
    .min(0, "Amount must be positive")
    .required("Estimated amount is required"),
});

export const paymentSchema = yup.object({
  amount: yup
    .number()
    .min(1, "Amount must be greater than $0")
    .required("Amount is required"),
  method: yup
    .string()
    .oneOf(["credit_card", "bank_transfer", "check"])
    .required("Payment method is required"),
});
