const BASE_URL = "/api/payment";

// Fetch all payments
export const fetchPayments = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error fetching payments:", errorText);
    throw new Error("Failed to fetch payments");
  }
  return res.json();
};

// Add new payment
export const addPayment = async (payment: {
  party: string;
  amount: number;
  type: "IN" | "OUT";
  note?: string;
  date: string;
}) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  });
  if (!res.ok) throw new Error("Failed to add payment");
  return res.json();
};

// Edit a payment
export const editPayment = async (
  id: string,
  updated: {
    party: string;
    amount: number;
    type: "IN" | "OUT";
    note?: string;
    date: string;
  }
) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  if (!res.ok) throw new Error("Failed to edit payment");
  return res.json();
};

// Delete a payment
export const deletePayment = async (id: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete payment");
  return res.json();
};

// Reset all payments
export const resetPayments = async () => {
  const res = await fetch(`${BASE_URL}/reset`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to reset payments");
  return res.json();
};
