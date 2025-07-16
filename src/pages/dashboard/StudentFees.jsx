import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, CreditCard, Calendar, Download, ExternalLink, Filter, ArrowUpDown, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { getStudentFees, payFee } from '../../constant/StudentFeesApi';
import { toast } from 'react-hot-toast';
import { useGlobalState } from '../../context/GlobalStateProvider';

// Mock API data for fees
// Schema:
// GET /api/student/fees
// {
//   currentSemester: string,
//   feeStructure: Array<{
//     id: string,
//     name: string,
//     amount: number,
//     description: string,
//     deadline: string,
//     status: 'paid' | 'pending' | 'overdue',
//     paidDate?: string,
//     paidAmount?: number,
//     transactionId?: string
//   }>,
//   transactions: Array<{
//     id: string,
//     date: string,
//     amount: number,
//     description: string,
//     paymentMethod: string,
//     status: 'completed' | 'pending' | 'failed',
//     receiptUrl?: string,
//     feeCategoryId?: string
//   }>
// }

const mockFeeData = {
  currentSemester: '2025 Summer',
  feeStructure: [
    {
      id: 'fee-1',
      name: 'Tuition Fee',
      amount: 25000,
      description: 'Regular tuition fee for Summer 2025 semester',
      deadline: '2025-07-15T23:59:59',
      status: 'pending'
    },
    {
      id: 'fee-2',
      name: 'Registration Fee',
      amount: 5000,
      description: 'Course registration fee for Summer 2025',
      deadline: '2025-07-10T23:59:59',
      status: 'paid',
      paidDate: '2025-07-01T14:30:00',
      paidAmount: 5000,
      transactionId: 'TXN-78945612'
    },
    {
      id: 'fee-3',
      name: 'Library Fee',
      amount: 2000,
      description: 'Annual library and resource access fee',
      deadline: '2025-07-20T23:59:59',
      status: 'pending'
    },
    {
      id: 'fee-4',
      name: 'Lab Fee',
      amount: 3500,
      description: 'Laboratory usage and maintenance fee',
      deadline: '2025-07-20T23:59:59',
      status: 'pending'
    },
    {
      id: 'fee-5',
      name: 'Student Activity Fee',
      amount: 1500,
      description: 'Fee for student clubs and activities',
      deadline: '2025-08-01T23:59:59',
      status: 'pending'
    },
    {
      id: 'fee-6',
      name: 'Previous Semester Due',
      amount: 2500,
      description: 'Outstanding balance from Spring 2025',
      deadline: '2025-07-05T23:59:59',
      status: 'overdue'
    }
  ],
  transactions: [
    {
      id: 'txn-1',
      date: '2025-07-01T14:30:00',
      amount: 5000,
      description: 'Registration Fee Payment',
      paymentMethod: 'Online Banking',
      status: 'completed',
      receiptUrl: '/receipts/txn-78945612.pdf',
      feeCategoryId: 'fee-2'
    },
    {
      id: 'txn-2',
      date: '2025-06-15T10:45:00',
      amount: 25000,
      description: 'Tuition Fee Payment (Spring 2025)',
      paymentMethod: 'Credit Card',
      status: 'completed',
      receiptUrl: '/receipts/txn-78945611.pdf'
    },
    {
      id: 'txn-3',
      date: '2025-06-10T09:20:00',
      amount: 2000,
      description: 'Library Fee Payment (Spring 2025)',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      receiptUrl: '/receipts/txn-78945610.pdf'
    },
    {
      id: 'txn-4',
      date: '2025-05-20T16:15:00',
      amount: 1500,
      description: 'Student Activity Fee (Spring 2025)',
      paymentMethod: 'Mobile Banking',
      status: 'completed',
      receiptUrl: '/receipts/txn-78945609.pdf'
    },
    {
      id: 'txn-5',
      date: '2025-07-02T11:30:00',
      amount: 2500,
      description: 'Previous Semester Due Payment',
      paymentMethod: 'Online Banking',
      status: 'pending'
    }
  ]
};

const StudentFees = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feeData, setFeeData] = useState({
    currentSemester: '',
    fees: [],
    transactions: []
  });
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('ONLINE_BANKING');
  const { globalState } = useGlobalState();
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate time remaining until deadline
  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate - now;
    
    if (diffMs <= 0) {
      return { text: 'Overdue', color: 'text-red-600' };
    }
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 10) {
      return { text: `${diffDays} days left`, color: 'text-green-600' };
    } else if (diffDays > 3) {
      return { text: `${diffDays} days left`, color: 'text-amber-600' };
    } else {
      return { text: `${diffDays} days left`, color: 'text-red-600' };
    }
  };
  
  // Fetch fee data when component mounts
  useEffect(() => {
    const fetchFeeData = async () => {
      try {
        setLoading(true);
        // In a real app, you'd get the student ID from auth context or similar
        // For now, we'll use a hardcoded student ID
        const studentId = 210; // Using a valid student ID from our database
        const data = await getStudentFees(studentId);
        setFeeData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching fee data:', err);
        setError('Failed to load fee data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeeData();
  }, []);

  // Filter fees based on search query
  const filteredFees = useMemo(() => {
    if (!searchQuery) return feeData.fees;
    
    const query = searchQuery.toLowerCase();
    return feeData.fees?.filter(fee => 
      fee.name.toLowerCase().includes(query) ||
      fee.description.toLowerCase().includes(query)
    ) || [];
  }, [searchQuery, feeData.fees]);
  
  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return feeData.transactions;
    
    const query = searchQuery.toLowerCase();
    return feeData.transactions?.filter(transaction => 
      transaction.description.toLowerCase().includes(query) ||
      transaction.payment_method.toLowerCase().includes(query)
    ) || [];
  }, [searchQuery, feeData.transactions]);
  
  // Payment modal functions
  const handleOpenPaymentModal = (fee) => {
    setSelectedFee(fee);
    setPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedFee(null);
  };

  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };

  // Handle fee payment
  const handlePayFee = async () => {
    if (!selectedFee || !globalState.user) return;
    
    setProcessingPayment(true);
    
    try {
      // Prepare transaction data
      const transactionData = {
        amount: selectedFee.amount,
        description: `Payment for ${selectedFee.name} - ${feeData.currentSemester}`,
        payment_method: selectedPaymentMethod,
        fee_id: selectedFee.id,
        student_id: globalState.user.id,
        // Generate a random transaction ID for demo purposes
        transaction_id: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };
      
      // Call the API to pay the fee
      const response = await payFee(transactionData);
      
      // Update the fee status in the local state
      const updatedFees = feeData.fees.map(fee => {
        if (fee.id === selectedFee.id) {
          return {
            ...fee,
            status: 'PAID',
            paid_date: new Date().toISOString(),
            paid_amount: selectedFee.amount,
            transactions: [response]
          };
        }
        return fee;
      });
      
      // Update the fees list
      setFeeData({
        ...feeData,
        fees: updatedFees,
        transactions: [...feeData.transactions, response]
      });
      
      // Show success message
      toast.success('Payment successful!');
      
      // Close the payment modal
      handleClosePaymentModal();
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };
  
  // Render the main content
  const renderContent = () => {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Fees & Payments</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search fees or transactions..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'current'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('current')}
          >
            Current Fees
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            Transaction History
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'structure'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('structure')}
          >
            Fee Structure
          </button>
        </div>
      
      {/* Tab Content */}
      {activeTab === 'current' && (
        <div>
          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Semester: {feeData.current_semester || 'Loading...'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">Total Fees</p>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(feeData.fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0)}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">Paid Amount</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(feeData.fees
                    ?.filter(fee => fee.status === 'PAID')
                    .reduce((sum, fee) => sum + fee.amount, 0) || 0)}
                </p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-red-600 font-medium">Due Amount</p>
                <p className="text-2xl font-bold text-red-700">
                  {formatCurrency(feeData.fees
                    ?.filter(fee => fee.status !== 'PAID')
                    .reduce((sum, fee) => sum + fee.amount, 0) || 0)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Fee Cards */}
          <div className="space-y-4">
            {filteredFees.map(fee => {
              const timeRemaining = fee.status !== 'PAID' ? getTimeRemaining(fee.deadline) : null;
              
              return (
                <motion.div
                  key={fee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{fee.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{fee.description}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">{formatCurrency(fee.amount)}</p>
                        <p className="text-xs text-gray-500 mt-1">Due: {formatDate(fee.deadline)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        {fee.status === 'PAID' ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle size={18} className="mr-1" />
                            <span className="text-sm font-medium">Paid on {formatDate(fee.paid_date)}</span>
                          </div>
                        ) : fee.status === 'OVERDUE' ? (
                          <div className="flex items-center text-red-600">
                            <AlertCircle size={18} className="mr-1" />
                            <span className="text-sm font-medium">Overdue</span>
                          </div>
                        ) : (
                          <div className={`flex items-center ${timeRemaining.color}`}>
                            <Clock size={18} className="mr-1" />
                            <span className="text-sm font-medium">{timeRemaining.text}</span>
                          </div>
                        )}
                      </div>
                      
                      {fee.status !== 'PAID' ? (
                        <button 
                          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
                          onClick={() => handleOpenPaymentModal(fee)}
                          disabled={processingPayment}
                        >
                          {processingPayment && selectedFee?.id === fee.id ? 'Processing...' : 'Pay Now'}
                        </button>
                      ) : (
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors flex items-center">
                          <Download size={16} className="mr-1" />
                          Receipt
                        </button>
                      )}
                    </div>
                    
                    {fee.status === 'PAID' && fee.transactions && fee.transactions.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        Transaction ID: {fee.transactions[0].transaction_id}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
            
            {filteredFees.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No fees found</h3>
                <p className="text-gray-500">
                  There are no fees matching your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Transaction History Tab */}
      {activeTab === 'history' && (
        <div>
          {/* Summary Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction History</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-700">
                  {feeData.transactions?.length || 0}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">Total Paid</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(feeData.transactions
                    ?.filter(txn => txn.status === 'COMPLETED')
                    .reduce((sum, txn) => sum + txn.amount, 0) || 0)}
                </p>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-sm text-amber-600 font-medium">Pending Payments</p>
                <p className="text-2xl font-bold text-amber-700">
                  {formatCurrency(feeData.transactions
                    ?.filter(txn => txn.status === 'PENDING')
                    .reduce((sum, txn) => sum + txn.amount, 0) || 0)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction, index) => (
                    <motion.tr 
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.payment_method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.status === 'COMPLETED' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : transaction.status === 'PENDING' ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.receipt_url && (
                          <a href={transaction.receipt_url} target="_blank" rel="noopener noreferrer">
                            <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                              <Download size={16} />
                            </button>
                          </a>
                        )}
                        <button className="text-gray-600 hover:text-gray-900">
                          <ExternalLink size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <AlertCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">
                  There are no transactions matching your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Fee Structure Tab */}
      {activeTab === 'structure' && (
        <div>
          {/* Fee Structure Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Fee Structure Information</h2>
            <p className="text-gray-600 mb-4">
              The following table outlines the standard fee structure for students in the Department of Computer Science and Engineering.
              Fees are subject to change based on university policy and may vary by program, batch, and semester.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">Current Semester</p>
                <p className="text-xl font-bold text-blue-700">
                  {mockFeeData.currentSemester}
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600 font-medium">Payment Deadline</p>
                <p className="text-xl font-bold text-purple-700">
                  July 15, 2025
                </p>
              </div>
            </div>
          </div>
          
          {/* Fee Categories */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Regular Semester Fees</h3>
              <p className="text-gray-600 mt-1">Fees charged every semester</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tuition Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(25000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Per Semester</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Core tuition fee covering academic instruction</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Registration Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(5000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Per Semester</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Course registration and administrative processing</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lab Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(3500)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Per Semester</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Access to laboratory facilities and equipment</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Student Activity Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(1500)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Per Semester</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Supports student clubs, events, and activities</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Annual Fees */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Annual Fees</h3>
              <p className="text-gray-600 mt-1">Fees charged once per academic year</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Library Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(2000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Annual</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Access to library resources and online journals</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technology Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(3000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Annual</td>
                    <td className="px-6 py-4 text-sm text-gray-500">IT infrastructure, software licenses, and technical support</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Development Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(2500)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Annual</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Campus infrastructure and facility improvements</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* One-time Fees */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">One-time Fees</h3>
              <p className="text-gray-600 mt-1">Fees charged only once during the program</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      When Charged
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Admission Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(10000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">At Admission</td>
                    <td className="px-6 py-4 text-sm text-gray-500">One-time fee for new students joining the program</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Security Deposit</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(5000)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">At Admission</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Refundable deposit returned upon program completion</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Graduation Fee</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(7500)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Final Semester</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Covers degree certificate, convocation, and related expenses</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

  return (
    <>
      {/* Main content */}
      {renderContent()}
      
      {/* Payment Modal */}
      {paymentModalOpen && selectedFee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold mb-4">Pay Fee</h3>
            
            <div className="mb-4">
              <p className="font-medium">{selectedFee.name}</p>
              <p className="text-gray-600">{selectedFee.description}</p>
              <p className="text-lg font-bold mt-2">Amount: ৳{selectedFee.amount.toLocaleString()}</p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={selectedPaymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <option value="ONLINE_BANKING">Online Banking</option>
                <option value="MOBILE_BANKING">Mobile Banking</option>
                <option value="CARD">Credit/Debit Card</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={handleClosePaymentModal}
                disabled={processingPayment}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                onClick={handlePayFee}
                disabled={processingPayment}
              >
                {processingPayment ? 'Processing...' : 'Confirm Payment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default StudentFees;
