import client from "./client";

export const getCustomers = (page, limit) =>
  client.get(`/customers?page=${page}&limit=${limit}`).then((res) => res.data);

export const getCustomer = (id) =>
  client.get(`/customers/${id}`).then((res) => res.data);

export const createCustomer = (data) =>
  client.post("/customers", data).then((res) => res.data);

export const updateCustomer = (id, data) =>
  client.put(`/customers/${id}`, data).then((res) => res.data);

export const deleteCustomer = (id) =>
  client.delete(`/customers/${id}`).then((res) => res.data);
