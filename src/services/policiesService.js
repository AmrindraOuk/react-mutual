import { mockPolicies } from "../data/mockData";
import { PolicyStatus } from "../types";

class PoliciesService {
  async getPolicies() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPolicies;
  }

  async createPolicy(policyData) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newPolicy = {
      id: Date.now().toString(),
      ...policyData,
      policyNumber: this.generatePolicyNumber(),
      status: PolicyStatus.ACTIVE,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      nextPaymentDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(), // 30 days
      documents: [],
    };

    mockPolicies.push(newPolicy);
    return newPolicy;
  }

  async renewPolicy(policyId) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const policy = mockPolicies.find((p) => p.id === policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }

    const renewedPolicy = {
      ...policy,
      status: PolicyStatus.ACTIVE,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      nextPaymentDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    const index = mockPolicies.findIndex((p) => p.id === policyId);
    mockPolicies[index] = renewedPolicy;

    return renewedPolicy;
  }

  async cancelPolicy(policyId) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const policy = mockPolicies.find((p) => p.id === policyId);
    if (!policy) {
      throw new Error("Policy not found");
    }

    const cancelledPolicy = {
      ...policy,
      status: PolicyStatus.CANCELLED,
    };

    const index = mockPolicies.findIndex((p) => p.id === policyId);
    mockPolicies[index] = cancelledPolicy;

    return cancelledPolicy;
  }

  generatePolicyNumber() {
    const prefix = "POL";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${timestamp}-${random}`;
  }
}

export const policiesService = new PoliciesService();
