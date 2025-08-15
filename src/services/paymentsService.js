import { mockPayments } from "../data/mockData";
import { PaymentStatus } from "../types";

class PaymentsService {
  async getPayments() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockPayments;
  }

  async makePayment(paymentData) {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate payment processing

    const newPayment = {
      id: Date.now().toString(),
      ...paymentData,
      status: PaymentStatus.COMPLETED,
      date: new Date().toISOString(),
    };

    mockPayments.push(newPayment);
    return newPayment;
  }

  async getUpcomingPayments() {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    return mockPayments.filter((payment) => {
      const dueDate = new Date(payment.dueDate);
      return (
        payment.status === PaymentStatus.PENDING &&
        dueDate >= now &&
        dueDate <= thirtyDaysFromNow
      );
    });
  }
}

export const paymentsService = new PaymentsService();
