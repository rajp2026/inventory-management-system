import client from "./client";

export const getOrders = (page, limit) =>
  client.get(`/orders?page=${page}&limit=${limit}`).then((res) => res.data);

export const getOrder = (id) =>
  client.get(`/orders/${id}`).then((res) => res.data);

export const createOrder = (data) =>
  client.post("/orders", data).then((res) => res.data);
