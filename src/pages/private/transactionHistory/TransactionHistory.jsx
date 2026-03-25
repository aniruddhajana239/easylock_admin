// pages/TransactionHistory.js
import { useState } from "react";
import Breadcrumb from "../../../component/breadcrumb/Breadcrumb";
import Table from "../../../component/table/Table";
import { useNavigate } from "react-router";
import Loader from "../../../component/loader/Loader";
import { Paper } from "@mui/material";
import { 
  FaUser, 
  FaStore, 
  FaUsers, 
  FaHashtag, 
  FaMoneyBillWave, 
  FaExchangeAlt,
  FaIdCard
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { BiCalendar } from "react-icons/bi";

const TransactionHistory = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Dummy data
  const [transactionData, setTransactionData] = useState([
    {
      id: 1,
      customer: { fullName: "John Doe", email: "john.doe@example.com" },
      retailer: { fullName: "Jane Smith", email: "jane.smith@example.com" },
      distributor: { fullName: "Alex Brown", email: "alex.brown@example.com" },
      emiId: "EMI001",
      amount: "₹10,000",
      receivedAs: "Down payment",
      transactionId: "TXN123456",
      receivedDate: "13 Dec 24, 06:30 PM",
      dueDate: "14 Dec, 24",
    },
    {
      id: 2,
      customer: { fullName: "Alice Green", email: "alice.green@example.com" },
      retailer: { fullName: "Mark Johnson", email: "mark.johnson@example.com" },
      distributor: { fullName: "Samuel White", email: "samuel.white@example.com" },
      emiId: "EMI002",
      amount: "₹8,500",
      receivedAs: "EMI",
      transactionId: "TXN654321",
      receivedDate: "15 Dec 24, 10:00 AM",
      dueDate: "16 Dec, 24",
    },
  ]);

  const columns = [
    "Customer",
    "Retailer",
    "Distributor",
    "EMI ID",
    "Amount",
    "Received As",
    "Transaction ID",
    "Received Date",
    "Due Date",
  ];

  const breadcrumbItems = [
    { label: "Home", path: "/device-lock/home" },
    { label: "Transaction History", path: "/device-lock/transaction_history" },
  ];

  const renderTableBody = () => (
    <tbody className="divide-y divide-slate-200">
      {transactionData.map((item, index) => (
        <tr
          key={index}
          className="hover:bg-slate-50 transition-colors duration-150 cursor-pointer"
          onClick={() => navigate(`/device-lock/transaction_history/details/${item.id}`)}
        >
          {/* Customer Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="text-blue-600 text-xs" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item.customer.fullName}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MdEmail className="text-[10px]" />
                  <span className="truncate max-w-[120px]">{item.customer.email}</span>
                </div>
              </div>
            </div>
          </td>
          
          {/* Retailer Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaStore className="text-purple-600 text-xs" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item.retailer.fullName}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MdEmail className="text-[10px]" />
                  <span className="truncate max-w-[120px]">{item.retailer.email}</span>
                </div>
              </div>
            </div>
          </td>
          
          {/* Distributor Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUsers className="text-amber-600 text-xs" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-slate-900 truncate">
                  {item.distributor.fullName}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MdEmail className="text-[10px]" />
                  <span className="truncate max-w-[120px]">{item.distributor.email}</span>
                </div>
              </div>
            </div>
          </td>
          
          {/* EMI ID Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <FaIdCard className="text-slate-400 text-xs" />
              <span className="text-xs font-mono text-slate-600">{item.emiId}</span>
            </div>
          </td>
          
          {/* Amount Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <FaMoneyBillWave className="text-emerald-500 text-xs" />
              <span className="text-sm font-semibold text-slate-900">{item.amount}</span>
            </div>
          </td>
          
          {/* Received As Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <FaExchangeAlt className="text-blue-500 text-xs" />
              <span className="text-xs text-slate-600">{item.receivedAs}</span>
            </div>
          </td>
          
          {/* Transaction ID Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <FaHashtag className="text-slate-400 text-xs" />
              <span className="text-xs font-mono text-slate-600">{item.transactionId}</span>
            </div>
          </td>
          
          {/* Received Date Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <BiCalendar className="text-slate-400 text-sm" />
              <span className="text-xs text-slate-600">{item.receivedDate}</span>
            </div>
          </td>
          
          {/* Due Date Column */}
          <td className="py-3 px-4">
            <div className="flex items-center gap-1.5">
              <BiCalendar className="text-amber-400 text-sm" />
              <span className="text-xs text-slate-600">{item.dueDate}</span>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="min-h-screen py-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4">
            <h1 className="text-2xl font-light text-slate-900">
              Transaction History
              <span className="text-base font-normal text-slate-400 ml-3">
                {transactionData.length > 0 && `(${transactionData.length} transactions)`}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View all payment transactions across the platform
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Paper 
          elevation={0} 
          sx={{ 
            padding: 3, 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.08)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            backgroundColor:'white'
          }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader />
            </div>
          ) : transactionData.length > 0 ? (
            <Table columns={columns}>
              {renderTableBody()}
            </Table>
          ) : (
            <div className="py-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <FaExchangeAlt className="text-slate-400 text-2xl" />
                </div>
                <h3 className="text-sm font-medium text-slate-900 mb-1">No Transactions Found</h3>
                <p className="text-sm text-slate-500">
                  Transactions will appear here once they are processed
                </p>
              </div>
            </div>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default TransactionHistory;