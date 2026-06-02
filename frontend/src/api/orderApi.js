import client from "./client";

export const getOrders = (page, limit) =>
  client.get(`/orders?page=${page}&limit=${limit}`).then((res) => res.data);

export const getOrderCount = () =>
  client.get("/orders/count").then((res) => res.data);

export const getOrder = (id) =>
  client.get(`/orders/${id}`).then((res) => res.data);

export const createOrder = (data) =>
  client.post("/orders", data).then((res) => res.data);

export const deleteOrder = (id) =>
  client.delete(`/orders/${id}`).then((res) => res.data);

export const getAllCustomers = (page = 1, limit = 100) =>
  client.get(`/customers?page=${page}&limit=${limit}`).then((res) => res.data);

export const getAllProducts = (page = 1, limit = 100) =>
  client.get(`/products?page=${page}&limit=${limit}`).then((res) => res.data);
