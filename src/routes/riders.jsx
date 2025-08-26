
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import RideStatCard from "@/components/RideStatCard";
import Modal from "@/components/modal";
import api from "@/utils/api";
import { User, UserCheck, UserX, ChevronUp, ChevronDown, Search } from "lucide-react";
import { formatCurrency } from "@/utils/cn";

const Riders = ({ showEmail = true, showPhone = true, showWalletBalance = true }) => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalRiders: 0,
        verifiedRiders: 0,
        unverifiedRiders: 0,
        completedProfiles: 0,
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const getRiders = async () => {
        const loadingToast = toast.loading("Fetching riders data...");
        try {
            const response = await api.get("/admin/users/");
            const userData = response.data.data.map((user) => ({
                ...user,
                fullname: user.fullname || "N/A",
                email: showEmail ? user.email || "N/A" : "***@***.com",
                phone: showPhone ? user.phone || "N/A" : "***********",
                createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
                walletBalance: showWalletBalance ? formatCurrency(user.walletBalance) : "₦***",
            }));
            setUsers(userData);
            console.log(userData);
            analyzeUserData(response.data.data); // Use original data for stats
            toast.update(loadingToast, {
                render: "Riders data loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching riders data",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    const analyzeUserData = (users) => {
        const total = users.length;
        const verified = users.filter((user) => user.isVerified).length;
        const completed = users.filter((user) => user.isCompleted).length;

        setStats({
            totalRiders: total,
            verifiedRiders: verified,
            unverifiedRiders: total - verified,
            completedProfiles: completed,
        });
    };

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const columns = useMemo(() => {
        const baseColumns = [
            {
                accessorKey: "id",
                header: "S/N",
                cell: ({ row }) => row.index + 1,
            },
            {
                accessorKey: "fullname",
                header: "Name",
                cell: (info) => info.getValue(),
            },
        ];

        // Conditionally add email column
        if (showEmail) {
            baseColumns.push({
                accessorKey: "email",
                header: "Email",
                cell: (info) => info.getValue(),
            });
        }

        // Conditionally add phone column
        if (showPhone) {
            baseColumns.push({
                accessorKey: "phone",
                header: "Phone",
                cell: (info) => info.getValue(),
            });
        }

        baseColumns.push(
            {
                accessorKey: "isVerified",
                header: "Verified",
                cell: (info) => (
                    <span className={`rounded-full px-2 py-1 text-xs ${info.getValue() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {info.getValue() ? "Verified" : "Unverified"}
                    </span>
                ),
            },
            {
                accessorKey: "isCompleted",
                header: "Profile Complete",
                cell: (info) => (
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${
                            info.getValue() ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                        {info.getValue() ? "Complete" : "Incomplete"}
                    </span>
                ),
            },
        );

        // Conditionally add wallet balance column
        if (showWalletBalance) {
            baseColumns.push({
                accessorKey: "walletBalance",
                header: "Balance",
                cell: (info) => info.getValue(),
            });
        }

        baseColumns.push({
            accessorKey: "createdAt",
            header: "Joined Date",
            cell: (info) => info.getValue(),
        });

        return baseColumns;
    }, [showEmail, showPhone, showWalletBalance]);

    const table = useReactTable({
        data: users,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    useEffect(() => {
        getRiders();
    }, [showEmail, showPhone, showWalletBalance]);

    const riderStatsData = [
        {
            title: "Total Riders",
            value: stats.totalRiders,
            comparison: "0",
            icon: (
                <User
                    size={16}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#605D55]",
        },
        {
            title: "Verified Riders",
            value: stats.verifiedRiders,
            comparison: "0",
            icon: (
                <UserCheck
                    size={16}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#258D3F]",
        },
        {
            title: "Unverified Riders",
            value: stats.unverifiedRiders,
            comparison: "0",
            icon: (
                <UserX
                    size={16}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#856833]",
        },
        {
            title: "Completed Profiles",
            value: stats.completedProfiles,
            comparison: "0",
            icon: (
                <UserCheck
                    size={16}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#3b82f6]",
        },
    ];

    return (
        <div className="dashboard-content p-3 md:p-4">
            <p className="mb-4 pt-4 text-[24px] font-medium">Riders</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
                {riderStatsData.map((stat, index) => (
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

            <div className="mt-4 grid grid-cols-1 gap-4">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-xl">Riders List</p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search riders..."
                                className="rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {users.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <th
                                                    key={header.id}
                                                    className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                                    onClick={header.column.getToggleSortingHandler()}
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
                                            onClick={() => handleRowClick(row.original)}
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

                            {/* Pagination */}
                            <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    <button
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{table.getState().pagination.pageIndex + 1}</span> of{" "}
                                            <span className="font-medium">{table.getPageCount()}</span> pages
                                        </p>
                                    </div>
                                    <div>
                                        <nav
                                            className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                                            aria-label="Pagination"
                                        >
                                            <button
                                                onClick={() => table.setPageIndex(0)}
                                                disabled={!table.getCanPreviousPage()}
                                                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <span className="sr-only">First</span>
                                                &laquo;
                                            </button>
                                            <button
                                                onClick={() => table.previousPage()}
                                                disabled={!table.getCanPreviousPage()}
                                                className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <span className="sr-only">Previous</span>
                                                &lsaquo;
                                            </button>
                                            <button
                                                onClick={() => table.nextPage()}
                                                disabled={!table.getCanNextPage()}
                                                className="relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <span className="sr-only">Next</span>
                                                &rsaquo;
                                            </button>
                                            <button
                                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                                disabled={!table.getCanNextPage()}
                                                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <span className="sr-only">Last</span>
                                                &raquo;
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="p-4 text-center">No riders found</p>
                    )}
                </div>
            </div>

            {/* User Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedUser && (
                    <div className="space-y-6">
                        <h3 className="mb-6 text-center text-xl font-bold">Rider Details</h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Full Name</p>
                                    <div className="flex items-center gap-2">
                                        {selectedUser.profileImage ? (
                                            <img
                                                src={selectedUser.profileImage}
                                                className="h-6 w-6 rounded-full object-cover"
                                                alt="User"
                                            />
                                        ) : (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-300">
                                                <User size={14} />
                                            </div>
                                        )}
                                        <p className="text-md">{selectedUser.fullname}</p>
                                    </div>
                                </div>

                                {showEmail && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Email Address</p>
                                        <p className="text-md">{selectedUser.email}</p>
                                    </div>
                                )}

                                {showPhone && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Phone Number</p>
                                        <p className="text-md">{selectedUser.phone}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Verification Status</p>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${selectedUser.isVerified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                    >
                                        {selectedUser.isVerified ? "Verified" : "Unverified"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Profile Status</p>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${selectedUser.isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                    >
                                        {selectedUser.isCompleted ? "Complete" : "Incomplete"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Passcode Set</p>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${selectedUser.isSetPassCode ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                    >
                                        {selectedUser.isSetPassCode ? "Yes" : "No"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {showWalletBalance && (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm">Wallet Balance</p>
                                            <p className="text-md">{formatCurrency(selectedUser.walletBalance)}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm">Bonus Balance</p>
                                            <p className="text-md">{formatCurrency(selectedUser.bonusBalance)}</p>
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Join Date</p>
                                    <p className="text-md">{selectedUser.createdAt}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Last Updated</p>
                                    <p className="text-md">
                                        {selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Account Status</p>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${!selectedUser.isDeleted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                    >
                                        {!selectedUser.isDeleted ? "Active" : "Deleted"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Riders;
