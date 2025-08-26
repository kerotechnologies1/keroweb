import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Search, CreditCard, ChevronUp, ChevronDown, DollarSign, User } from "lucide-react";
import Modal from "@/components/modal";
import RideStatCard from "@/components/RideStatCard";
import api from "@/utils/api";
import { formatCurrency } from "@/utils/cn";

const Transactions = ({ lagosAdmin = false }) => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [activeTab, setActiveTab] = useState("all"); // 'all', 'fund_transfer', 'fund_account', 'user_fare_payment', 'driver_fare_payment'
    const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'success', 'failed', 'pending'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [stats, setStats] = useState({
        totalTransactions: 0,
        totalAmount: 0,
        totalCharges: 0,
        totalSettled: 0,
        totalLagosCommission: 0,
        totalKeroCommission: 0,
    });

    const getTransactions = async () => {
        const loadingToast = toast.loading("Fetching transactions data...");
        try {
            const response = await api.get("/admin/get-all-transactions");
            let transactionsData = response.data.data;

            // Filter for Lagos admin if prop is true
            if (lagosAdmin) {
                transactionsData = transactionsData.filter((t) => t.lagosCommission > 0);
            }

            setTransactions(transactionsData);
            calculateStats(transactionsData, response.data.totals);
            filterTransactions(transactionsData, "all", "all");
            toast.update(loadingToast, {
                render: "Transactions data loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching transactions data",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    const calculateStats = (transactions, totals = {}) => {
        const totalTransactions = transactions.length;

        setStats({
            totalTransactions,
            totalAmount: totals.totalAmount || 0,
            totalLagosCommission: totals.totalLagosCommission || 0,
            totalKeroCommission: totals.totalKeroCommission || 0,
        });
    };

    const filterTransactions = (transactionsList, serviceTab, statusFilter = "all") => {
        let filtered = transactionsList;

        // Filter by service type
        if (serviceTab !== "all") {
            filtered = filtered.filter((t) => t.transaction_services === serviceTab);
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter((t) => t.status === statusFilter);
        }

        setFilteredTransactions(filtered);
        setActiveTab(serviceTab);
        setStatusFilter(statusFilter);
    };

    const openTransactionModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const getTransactionServiceLabel = (service) => {
        const serviceLabels = {
            fund_transfer: "Fund Transfer",
            fund_account: "Account Funding",
            user_fare_payment: "User Fare Payment",
            driver_fare_payment: "Driver Fare Payment",
        };
        return serviceLabels[service] || service || "N/A";
    };

    // Stats cards data
    const statsCards = useMemo(() => {
        if (lagosAdmin) {
            return [
                {
                    title: "Total Transactions",
                    value: stats.totalTransactions,
                    comparison: "0",
                    icon: (
                        <CreditCard
                            size={16}
                            color="white"
                        />
                    ),
                    iconBgColor: "bg-[#605D55]",
                },
                {
                    title: "Total Lagos Commission",
                    value: formatCurrency(stats.totalLagosCommission),
                    comparison: "0",
                    icon: (
                        <DollarSign
                            size={16}
                            color="white"
                        />
                    ),
                    iconBgColor: "bg-[#258D3F]",
                },
            ];
        } else {
            return [
                {
                    title: "Total Transactions",
                    value: stats.totalTransactions,
                    comparison: "0",
                    icon: (
                        <CreditCard
                            size={16}
                            color="white"
                        />
                    ),
                    iconBgColor: "bg-[#605D55]",
                },
                {
                    title: "Total Amount",
                    value: formatCurrency(stats.totalAmount),
                    comparison: "0",
                    icon: (
                        <DollarSign
                            size={16}
                            color="white"
                        />
                    ),
                    iconBgColor: "bg-[#258D3F]",
                },
                {
                    title: "Total Charges",
                    value: formatCurrency(stats.totalCharges),
                    comparison: "0",
                    icon: (
                        <DollarSign
                            size={16}
                            color="white"
                        />
                    ),
                    iconBgColor: "bg-[#856833]",
                },
                {
                    title: "Total Settled",
                    value: formatCurrency(stats.totalSettled),
                    comparison: "0",
                    icon: (
                        <DollarSign
                            size={16}
                            color="white"
                        />
                    ),
                    iconBgColor: "bg-[#3b82f6]",
                },
            ];
        }
    }, [stats, lagosAdmin]);

    const columns = useMemo(() => {
        const baseColumns = [
            {
                accessorKey: "id",
                header: "S/N",
                cell: ({ row }) => row.index + 1,
                enableSorting: false,
            },
            {
                accessorKey: "transaction_id",
                header: "Transaction ID",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "reference",
                header: "Reference",
                cell: (info) => info.getValue(),
            },
        ];

        // Add user/driver email column
        if (lagosAdmin) {
            baseColumns.push({
                accessorKey: "user_id",
                header: "User Email",
                cell: (info) => {
                    const row = info.row.original;
                    return row.user_id?.email || row.driver_id?.email || "N/A";
                },
            });
        } else {
            baseColumns.push({
                accessorKey: "user_id",
                header: "User Email",
                cell: (info) => {
                    const row = info.row.original;
                    return row.user_id?.email || row.driver_id?.email || "N/A";
                },
            });
        }

        // Lagos admin specific columns
        if (lagosAdmin) {
            baseColumns.push(
                {
                    accessorKey: "lagosCommission",
                    header: "Lagos Commission",
                    cell: (info) => formatCurrency(info.getValue() || 0),
                },
                {
                    accessorKey: "transaction_services",
                    header: "Service",
                    cell: (info) => (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            {getTransactionServiceLabel(info.getValue())}
                        </span>
                    ),
                },
            );
        } else {
            // Regular admin columns
            baseColumns.push(
                {
                    accessorKey: "amount",
                    header: "Amount",
                    cell: (info) => formatCurrency(info.getValue()),
                },
                {
                    accessorKey: "settled_amount",
                    header: "Settled",
                    cell: (info) => formatCurrency(info.getValue()),
                },
                {
                    accessorKey: "charges",
                    header: "Charges",
                    cell: (info) => formatCurrency(info.getValue()),
                },
                {
                    accessorKey: "keroCommission",
                    header: "Kero Commission",
                    cell: (info) => formatCurrency(info.getValue() || 0),
                },
            );
        }

        // Common columns for both
        baseColumns.push(
            {
                accessorKey: "transaction_type",
                header: "Type",
                cell: (info) => (
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${
                            info.getValue() === "credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                        {info.getValue()?.charAt(0).toUpperCase() + info.getValue()?.slice(1)}
                    </span>
                ),
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: (info) => {
                    const status = info.getValue();
                    let bgColor, textColor;

                    switch (status) {
                        case "success":
                            bgColor = "bg-green-100";
                            textColor = "text-green-800";
                            break;
                        case "pending":
                            bgColor = "bg-yellow-100";
                            textColor = "text-yellow-800";
                            break;
                        case "failed":
                            bgColor = "bg-red-100";
                            textColor = "text-red-800";
                            break;
                        default:
                            bgColor = "bg-gray-100";
                            textColor = "text-gray-800";
                    }

                    return (
                        <span className={`rounded-full px-2 py-1 text-xs ${bgColor} ${textColor}`}>
                            {status?.charAt(0).toUpperCase() + status?.slice(1)}
                        </span>
                    );
                },
            },
            {
                accessorKey: "createdAt",
                header: "Date",
                cell: (info) => new Date(info.getValue()).toLocaleDateString(),
            },
        );

        return baseColumns;
    }, [lagosAdmin]);

    const table = useReactTable({
        data: filteredTransactions,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 25,
            },
        },
    });

    useEffect(() => {
        getTransactions();
    }, [lagosAdmin]);

    const getServiceTabLabel = (tab) => {
        switch (tab) {
            case "all":
                return "All Services";
            case "fund_transfer":
                return "Fund Transfer";
            case "fund_account":
                return "Fund Account";
            case "user_fare_payment":
                return "User Fare";
            case "driver_fare_payment":
                return "Driver Fare";
            default:
                return tab;
        }
    };

    return (
        <div className="dashboard-content p-3 md:p-4">
            <p className="mb-4 pt-4 text-[24px] font-medium">{lagosAdmin ? "Lagos Commission Transactions" : "Transactions Management"}</p>

            {/* Stats Cards */}
            <div className={`mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 ${lagosAdmin ? "" : "lg:grid-cols-4"}`}>
                {statsCards.map((stat, index) => (
                    <RideStatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        comparison={stat.comparison}
                        icon={stat.icon}
                        iconBgColor={stat.iconBgColor}
                    />
                ))}
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                    {/* Service Tabs */}
                    {!lagosAdmin && (
                        <div className="flex space-x-2">
                            {["all", "fund_transfer", "fund_account", "user_fare_payment", "driver_fare_payment"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => filterTransactions(transactions, tab, statusFilter)}
                                    className={`rounded-md px-4 py-2 ${activeTab === tab ? "bg-primary-500 text-white" : "bg-gray-200"}`}
                                >
                                    {getServiceTabLabel(tab)}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Status:</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => filterTransactions(transactions, activeTab, e.target.value)}
                                className="rounded-lg border px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="success">Successful</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="w-full overflow-x-auto"
                    style={{ maxHeight: "calc(100vh - 100px)" }}
                >
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            onClick={header.column.getToggleSortingHandler()}
                                            style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                                        >
                                            <div className="flex items-center">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {{
                                                    asc: <ChevronUp className="ml-1 h-4 w-4" />,
                                                    desc: <ChevronDown className="ml-1 h-4 w-4" />,
                                                }[header.column.getIsSorted()] ?? null}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => openTransactionModal(row.original)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredTransactions.length === 0 && <p className="p-4 text-center">No transactions found for the selected filters</p>}

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{" "}
                            <span className="font-medium">{filteredTransactions.length}</span> results
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="rounded-md border px-3 py-1 text-sm font-medium disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="rounded-md border px-3 py-1 text-sm font-medium disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedTransaction && (
                    <div className="space-y-6">
                        <h3 className="mb-6 text-center text-xl font-bold">Transaction Details</h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">Transaction ID</p>
                                    <p className="text-md font-mono">{selectedTransaction.transaction_id}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">User/Driver Email</p>
                                    <p className="text-md">{selectedTransaction.user_id?.email || selectedTransaction.driver_id?.email || "N/A"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">Reference</p>
                                    <p className="text-md">{selectedTransaction.reference}</p>
                                </div>

                                {selectedTransaction.narration && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Narration</p>
                                        <p className="text-md max-w-xs text-right">{selectedTransaction.narration}</p>
                                    </div>
                                )}

                                {selectedTransaction.trip_id && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Trip ID</p>
                                        <p className="text-md font-mono">{selectedTransaction.trip_id}</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4">
                                {!lagosAdmin && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Amount</p>
                                            <p className="text-md">{formatCurrency(selectedTransaction.amount)}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Settled Amount</p>
                                            <p className="text-md">{formatCurrency(selectedTransaction.settled_amount)}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Charges</p>
                                            <p className="text-md">{formatCurrency(selectedTransaction.charges)}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Kero Commission</p>
                                            <p className="text-md">{formatCurrency(selectedTransaction.keroCommission || 0)}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Lagos Commission</p>
                                            <p className="text-md">{formatCurrency(selectedTransaction.lagosCommission || 0)}</p>
                                        </div>
                                    </>
                                )}

                                {lagosAdmin && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Lagos Commission</p>
                                        <p className="text-md">{formatCurrency(selectedTransaction.lagosCommission || 0)}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">Service Type</p>
                                    <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                        {getTransactionServiceLabel(selectedTransaction.transaction_services)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">Transaction Type</p>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${
                                            selectedTransaction.transaction_type === "credit"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {selectedTransaction.transaction_type?.charAt(0).toUpperCase() +
                                            selectedTransaction.transaction_type?.slice(1)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">Status</p>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${
                                            selectedTransaction.status === "success"
                                                ? "bg-green-100 text-green-800"
                                                : selectedTransaction.status === "pending"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {selectedTransaction.status?.charAt(0).toUpperCase() + selectedTransaction.status?.slice(1)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">Date & Time</p>
                                    <p className="text-md">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                                </div>

                                {!lagosAdmin && selectedTransaction.account_no && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Account Number</p>
                                            <p className="text-md">{selectedTransaction.account_no}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium">Bank Name</p>
                                            <p className="text-md max-w-xs text-right">{selectedTransaction.bank_name}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Transactions;
