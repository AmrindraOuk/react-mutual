import { mockClaims } from "../data/mockData";
import { ClaimStatus } from "../types";

class ClaimsService {
  async getClaims() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockClaims;
  }

  async createClaim(claimData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newClaim = {
      id: Date.now().toString(),
      ...claimData,
      claimNumber: this.generateClaimNumber(),
      status: ClaimStatus.PENDING,
      dateReported: new Date().toISOString(),
      attachments: claimData.attachments || [],
      messages: [],
    };

    mockClaims.push(newClaim);
    return newClaim;
  }

  async updateClaimStatus(claimId, status) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const claim = mockClaims.find((c) => c.id === claimId);
    if (!claim) {
      throw new Error("Claim not found");
    }

    const updatedClaim = {
      ...claim,
      status,
    };

    const index = mockClaims.findIndex((c) => c.id === claimId);
    mockClaims[index] = updatedClaim;

    return updatedClaim;
  }

  async addMessage(claimId, messageData) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const claim = mockClaims.find((c) => c.id === claimId);
    if (!claim) {
      throw new Error("Claim not found");
    }

    const newMessage = {
      id: Date.now().toString(),
      ...messageData,
      timestamp: new Date().toISOString(),
    };

    claim.messages.push(newMessage);

    return { claimId, message: newMessage };
  }

  generateClaimNumber() {
    const prefix = "CLM";
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${timestamp}-${random}`;
  }
}

export const claimsService = new ClaimsService();
