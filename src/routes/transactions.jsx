import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import {  Search, CreditCard, ChevronUp, ChevronDown, DollarSign } from "lucide-react";
import Modal from "@/components/Modal";
import RideStatCard from "@/components/RideStatCard";
import api from "@/utils/api";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [activeTab, setActiveTab] = useState("all"); // 'all', 'success', 'failed', 'pending'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [stats, setStats] = useState({
        totalTransactions: 0,
        totalAmount: 0,
        totalCharges: 0,
        totalSettled: 0
    });

    const getTransactions = async () => {
        const loadingToast = toast.loading("Fetching transactions data...");
        try {
            const response = await api.get("/admin/get-all-transactions");
            setTransactions(response.data.data);
            calculateStats(response.data.data);
            filterTransactions(response.data.data, "all");
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

    const calculateStats = (transactions) => {
        const totalTransactions = transactions.length;
        const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 2)/100;
        const totalCharges = transactions.reduce((sum, t) => sum + t.charges, 2)/100;
        const totalSettled = transactions.reduce((sum, t) => sum + t.settled_amount, 2)/100;

        setStats({
            totalTransactions,
            totalAmount,
            totalCharges,
            totalSettled
        });
    };

    const filterTransactions = (transactionsList, tab) => {
        if (tab === "all") {
            setFilteredTransactions(transactionsList);
        } else {
            setFilteredTransactions(transactionsList.filter((t) => t.status === tab));
        }
        setActiveTab(tab);
    };

    const openTransactionModal = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    // Stats cards data
    const statsCards = useMemo(
        () => [
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
                value: `₦${stats.totalAmount.toLocaleString()}`,
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
                value: `₦${stats.totalCharges.toLocaleString()}`,
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
                value: `₦${stats.totalSettled.toLocaleString()}`,
                comparison: "0",
                icon: (
                    <DollarSign
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#3b82f6]",
            },
        ],
        [stats],
    );

    const columns = useMemo(
        () => [
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
                accessorKey: "user_id.email",
                header: "User Email",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "reference",
                header: "Reference",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "amount",
                header: "Amount (₦)",
                cell: (info) => `₦${parseFloat(info.getValue()/100).toLocaleString()}`,
            },
            {
                accessorKey: "settled_amount",
                header: "Settled (₦)",
                cell: (info) => `₦${parseFloat(info.getValue()/100).toLocaleString()}`,
            },
            {
                accessorKey: "charges",
                header: "Charges (₦)",
                cell: (info) => `₦${parseFloat(info.getValue()/100).toLocaleString()}`,
            },
            {
                accessorKey: "transaction_type",
                header: "Type",
                cell: (info) => (
                    <span className={`rounded-full px-2 py-1 text-xs ${
                        info.getValue() === "credit" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}>
                        {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
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
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    );
                },
            },
            {
                accessorKey: "createdAt",
                header: "Date",
                cell: (info) => new Date(info.getValue()).toLocaleDateString(),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <button
                        onClick={() => openTransactionModal(row.original)}
                        className="rounded-md bg-secondary-500 px-3 py-1 text-white transition hover:bg-secondary-600"
                    >
                        Details
                    </button>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

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
    }, []);

    const getTabLabel = (tab) => {
        switch (tab) {
            case "all":
                return "All Transactions";
            case "success":
                return "Successful";
            case "failed":
                return "Failed";
            case "pending":
                return "Pending";
            default:
                return tab;
        }
    };

    return (
        <div className="dashboard-content p-3 md:p-4">
            <p className="mb-4 pt-4 text-[24px] font-medium">Transactions Management</p>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
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
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                        {["all", "success", "failed", "pending"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => filterTransactions(transactions, tab)}
                                className={`rounded-md px-4 py-2 ${activeTab === tab ? "bg-primary-500 text-white" : "bg-gray-200"}`}
                            >
                                {getTabLabel(tab)}
                            </button>
                        ))}
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

                <div
                    className="w-full overflow-x-auto"
                    style={{ maxHeight: "calc(100vh - 300px)" }}
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
                                    className="hover:bg-gray-50"
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

                {filteredTransactions.length === 0 && <p className="p-4 text-center">No {getTabLabel(activeTab).toLowerCase()} transactions found</p>}

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
                                    <p className="text-sm">Transaction ID</p>
                                    <p className="text-md font-mono">{selectedTransaction.transaction_id}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">User Email</p>
                                    <p className="text-md">{selectedTransaction.user_id?.email || "N/A"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Reference</p>
                                    <p className="text-md">{selectedTransaction.reference}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Amount</p>
                                    <p className="text-md">₦{selectedTransaction.amount.toLocaleString()}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Settled Amount</p>
                                    <p className="text-md">₦{selectedTransaction.settled_amount.toLocaleString()}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Charges</p>
                                    <p className="text-md">₦{selectedTransaction.charges.toLocaleString()}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Type</p>
                                    <span className={`rounded-full px-2 py-1 text-xs ${
                                        selectedTransaction.transaction_type === "credit" 
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-blue-100 text-blue-800"
                                    }`}>
                                        {selectedTransaction.transaction_type.charAt(0).toUpperCase() + 
                                         selectedTransaction.transaction_type.slice(1)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Status</p>
                                    <span className={`rounded-full px-2 py-1 text-xs ${
                                        selectedTransaction.status === "success"
                                            ? "bg-green-100 text-green-800"
                                            : selectedTransaction.status === "pending"
                                              ? "bg-yellow-100 text-yellow-800"
                                              : "bg-red-100 text-red-800"
                                    }`}>
                                        {selectedTransaction.status.charAt(0).toUpperCase() + 
                                         selectedTransaction.status.slice(1)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Date</p>
                                    <p className="text-md">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Transactions;