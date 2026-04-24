import axios from '../lib/axios';
import type { StripeSessionResponse } from "@/types";

export const getStripeSession = async (sessionId: string): Promise<StripeSessionResponse> => {
  return await axios("GET", `/payments/session/${sessionId}`);
};
