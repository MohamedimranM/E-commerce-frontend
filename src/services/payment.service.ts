import axios from '../lib/axios';

export const createCheckoutSession = async (
  items: any[],
  customerEmail: any,
  orderId: string
): Promise<any> => {
  return await axios(
    "POST",
    "/payments/create-checkout-session",
    {
      items,
      customerEmail,
      orderId,
    }
  );
};
