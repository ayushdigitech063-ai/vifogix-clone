// src/services/contactService.js
import api from "./api";

const toError = (error, fallback = "Failed to submit inquiry.") => {
  if (error.response?.data?.message) {
    return new Error(error.response.data.message);
  }
  if (error.request) {
    return new Error("Cannot reach the server. Please check your network connection.");
  }
  return new Error(fallback);
};

/**
 * Submits a contact inquiry
 * Maps to backend: POST /v1/contact
 *
 * @param {Object} inquiryData - { inquiryType, name, email, phone, companySize, goal, message }
 * @returns {Promise<Object>} Created inquiry response
 */
export const submitContactInquiry = async (inquiryData) => {
  try {
    const { data } = await api.post("/v1/contact", inquiryData);
    return data; // { success, statusCode, message, data: { inquiry } }
  } catch (error) {
    throw toError(error, "Failed to submit inquiry.");
  }
};

/**
 * Fetches contact inquiries list for admin
 * Maps to backend: GET /v1/admin/contacts
 *
 * @param {Object} params - { page, limit, status, inquiryType }
 * @returns {Promise<Object>}
 */
export const getAdminInquiries = async (params = {}) => {
  try {
    const { data } = await api.get("/v1/admin/contacts", { params });
    return data; // { success, statusCode, message, data: { inquiries, pagination } }
  } catch (error) {
    throw toError(error, "Failed to fetch contact inquiries.");
  }
};

/**
 * Update contact inquiry status and admin notes
 * Maps to backend: PATCH /v1/admin/contacts/:contactId
 *
 * @param {string} contactId
 * @param {Object} updateData - { status, adminNotes }
 * @returns {Promise<Object>}
 */
export const updateAdminInquiry = async (contactId, updateData) => {
  try {
    const { data } = await api.patch(`/v1/admin/contacts/${contactId}`, updateData);
    return data;
  } catch (error) {
    throw toError(error, "Failed to update inquiry.");
  }
};

/**
 * Delete a contact inquiry by ID
 * Maps to backend: DELETE /v1/admin/contacts/:contactId
 *
 * @param {string} contactId
 * @returns {Promise<Object>}
 */
export const deleteAdminInquiry = async (contactId) => {
  try {
    const { data } = await api.delete(`/v1/admin/contacts/${contactId}`);
    return data;
  } catch (error) {
    throw toError(error, "Failed to delete inquiry.");
  }
};

