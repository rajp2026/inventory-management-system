import client from "./client";

export const getProducts = (page, limit) =>
  client.get(`/products?page=${page}&limit=${limit}`).then((res) => res.data);

export const getProductCount = () =>
  client.get("/products/count").then((res) => res.data);

export const getProduct = (id) =>
  client.get(`/products/${id}`).then((res) => res.data);

export const createProduct = (data) =>
  client.post("/products/create", data).then((res) => res.data);

export const updateProduct = (id, data) =>
  client.put(`/products/${id}`, data).then((res) => res.data);

export const deleteProduct = (id) =>
  client.delete(`/products/${id}`).then((res) => res.data);
