import axios from "axios";

const API_BASE = "https://<tu-api-id>.execute-api.us-east-1.amazonaws.com/dev";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "X-Tenant-Id": "pardos-chicken" }
});
