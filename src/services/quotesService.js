import { mockQuotes } from "../data/mockData";
import { QuoteStatus } from "../types";

class QuotesService {
  async getQuotes() {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockQuotes;
  }

  async createQuote(quoteData) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newQuote = {
      id: Date.now().toString(),
      ...quoteData,
      status: QuoteStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      premium: this.calculatePremium(quoteData),
    };

    mockQuotes.push(newQuote);
    return newQuote;
  }

  async updateQuote(id, quoteData) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = mockQuotes.findIndex((quote) => quote.id === id);
    if (index === -1) {
      throw new Error("Quote not found");
    }

    const updatedQuote = {
      ...mockQuotes[index],
      ...quoteData,
      premium: this.calculatePremium(quoteData),
    };

    mockQuotes[index] = updatedQuote;
    return updatedQuote;
  }

  async deleteQuote(id) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockQuotes.findIndex((quote) => quote.id === id);
    if (index === -1) {
      throw new Error("Quote not found");
    }
    mockQuotes.splice(index, 1);
  }

  calculatePremium(quoteData) {
    // Mock premium calculation logic
    let basePremium = 500;

    switch (quoteData.type) {
      case "auto":
        basePremium = 800;
        if (quoteData.vehicleInfo?.year < 2010) basePremium += 200;
        if (quoteData.vehicleInfo?.mileage > 100000) basePremium += 150;
        break;
      case "home":
        basePremium = 1200;
        if (quoteData.homeInfo?.yearBuilt < 1990) basePremium += 300;
        if (quoteData.homeInfo?.squareFootage > 3000) basePremium += 400;
        break;
      case "life":
        basePremium = 600;
        break;
      case "health":
        basePremium = 400;
        break;
      default:
        basePremium = 500;
    }

    // Coverage amount affects premium
    if (quoteData.coverageDetails?.coverageAmount > 100000) {
      basePremium +=
        Math.floor(quoteData.coverageDetails.coverageAmount / 100000) * 50;
    }

    // Higher deductible = lower premium
    if (quoteData.coverageDetails?.deductible > 1000) {
      basePremium -= 100;
    }

    return Math.max(basePremium, 200); // Minimum premium
  }
}

export const quotesService = new QuotesService();
