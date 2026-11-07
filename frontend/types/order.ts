export type orderConfirmation = {
  id: number;
  reference_id: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  phone: string;
  latitude: string;
  longitude: string;
  status: string;
  items: {
    key: string;
    quantity: number;
  }[];
  created_at: string;
  updated_at: string;
};
