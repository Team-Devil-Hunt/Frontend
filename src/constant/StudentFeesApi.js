import axios from 'axios';
import { BaseUrl } from '../services/BaseUrl';

/**
 * Get all fees for a student
 * @param {number} studentId - The ID of the student
 * @param {string} semester - Optional semester to filter by
 * @returns {Promise} - Promise with the student fees data
 */
export const getStudentFees = async (studentId, semester) => {
  try {
    let url = `${BaseUrl}/api/student/fees/?`;
    
    if (studentId) {
      url += `student_id=${studentId}&`;
    }
    
    if (semester) {
      url += `semester=${semester}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching student fees:', error);
    throw error;
  }
};

/**
 * Get all fee categories
 * @returns {Promise} - Promise with the fee categories
 */
export const getFeeCategories = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/api/student/fees/categories/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching fee categories:', error);
    throw error;
  }
};

/**
 * Get all transactions for a student
 * @param {number} studentId - The ID of the student
 * @param {number} feeId - Optional fee ID to filter by
 * @returns {Promise} - Promise with the transactions
 */
export const getTransactions = async (studentId, feeId) => {
  try {
    let url = `${BaseUrl}/api/student/fees/transactions/?`;
    
    if (studentId) {
      url += `student_id=${studentId}&`;
    }
    
    if (feeId) {
      url += `fee_id=${feeId}`;
    }
    
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

/**
 * Pay a fee
 * @param {Object} transactionData - The transaction data
 * @returns {Promise} - Promise with the transaction data
 */
export const payFee = async (transactionData) => {
  try {
    const response = await axios.post(`${BaseUrl}/api/student/fees/pay/`, transactionData);
    return response.data;
  } catch (error) {
    console.error('Error paying fee:', error);
    throw error;
  }
};
