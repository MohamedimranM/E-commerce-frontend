import axios from '../lib/axios';

export const getStripeSession = async (sessionId) => {
  return await axios("GET", `/payments/session/${sessionId}`);
};
