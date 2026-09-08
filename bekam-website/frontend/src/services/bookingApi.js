const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = (data.errors && data.errors[0]) || "Terjadi kesalahan. Coba lagi.";
    throw new Error(message);
  }
  return data;
}

export async function fetchServices() {
  const res = await fetch(`${API_URL}/services`);
  return handleResponse(res);
}

export async function fetchAvailability(dateISO) {
  const res = await fetch(`${API_URL}/availability?date=${encodeURIComponent(dateISO)}`);
  return handleResponse(res);
}

export async function fetchMonthAvailability(year, month) {
  const res = await fetch(`${API_URL}/availability/month?year=${year}&month=${month}`);
  return handleResponse(res);
}

export async function createBooking(payload) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
