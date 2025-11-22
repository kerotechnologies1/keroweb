import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Search, ChevronUp, ChevronDown, Gift, Users, Edit2, Trash2, Plus } from "lucide-react";
import Modal from "@/components/modal";
import RideStatCard from "@/components/RideStatCard";
import api from "@/utils/api";
import { formatCurrency } from "@/utils/cn";

const Rewards = () => {
    const [rewards, setRewards] = useState([]);
    const [rewardLogs, setRewardLogs] = useState([]);
    const [filteredRewards, setFilteredRewards] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [activeTab, setActiveTab] = useState("rewards"); // 'rewards' or 'logs'
    const [groupFilter, setGroupFilter] = useState("all"); // 'all', 'riders', 'drivers', 'admin'
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        rewardName: "",
        rewardValue: "",
        group: "riders",
        startDate: "",
        endDate: "",
    });
    const [isEditMode, setIsEditMode] = useState(false);

    const [stats, setStats] = useState({
        totalRewards: 0,
        totalLogs: 0,
        totalRewardValue: 0,
        activeRewards: 0,
    });

    const getRewards = async () => {
        const loadingToast = toast.loading("Fetching rewards data...");
        try {
            const response = await api.get("/admin/rewards");
            const rewardsData = response.data.data;
            setRewards(rewardsData);
            filterRewards(rewardsData, groupFilter);
            calculateStats(rewardsData, rewardLogs);
            toast.update(loadingToast, {
                render: "Rewards data loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching rewards data",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    const getRewardLogs = async () => {
        const loadingToast = toast.loading("Fetching reward logs...");
        try {
            const response = await api.get("/admin/rewardlogs");
            const logsData = response.data.data;
            setRewardLogs(logsData);
            filterLogs(logsData, groupFilter);
            calculateStats(rewards, logsData);
            toast.update(loadingToast, {
                render: "Reward logs loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching reward logs",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    const calculateStats = (rewardsData, logsData) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const activeRewards = rewardsData.filter((r) => {
            const start = new Date(r.startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(r.endDate);
            end.setHours(0, 0, 0, 0);
            return start <= now && end >= now;
        }).length;

        const totalRewardValue = logsData.reduce((sum, log) => sum + (log.rewardValue || 0), 0);

        setStats({
            totalRewards: rewardsData.length,
            totalLogs: logsData.length,
            totalRewardValue,
            activeRewards,
        });
    };

    const filterRewards = (rewardsList, group) => {
        let filtered = rewardsList;
        if (group !== "all") {
            filtered = filtered.filter((r) => r.group === group);
        }
        setFilteredRewards(filtered);
        setGroupFilter(group);
    };

    const filterLogs = (logsList, group) => {
        let filtered = logsList;
        if (group !== "all") {
            filtered = filtered.filter((l) => l.userType === group);
        }
        setFilteredLogs(filtered);
        setGroupFilter(group);
    };

    const handleCreateReward = () => {
        setIsEditMode(false);
        setFormData({
            rewardName: "",
            rewardValue: "",
            group: "riders",
            startDate: "",
            endDate: "",
        });
        setIsFormModalOpen(true);
    };

    const handleEditReward = (reward) => {
        setIsEditMode(true);
        setFormData({
            rewardName: reward.rewardName,
            rewardValue: reward.rewardValue,
            group: reward.group,
            startDate: reward.startDate.split("T")[0],
            endDate: reward.endDate.split("T")[0],
        });
        setSelectedItem(reward);
        setIsFormModalOpen(true);
    };

    const handleDeleteReward = async (rewardId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        const loadingToast = toast.loading("Deleting reward...");
        try {
            await api.delete(`/admin/reward/${rewardId}`);
            toast.update(loadingToast, {
                render: "Reward deleted successfully",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
            Swal.fire("Deleted!", "The reward has been deleted.", "success");
            getRewards();
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error deleting reward",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    const handleSubmitReward = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(isEditMode ? "Updating reward..." : "Creating reward...");

        try {
            if (isEditMode) {
                await api.put(`/admin/reward/${selectedItem._id}`, formData);
                toast.update(loadingToast, {
                    render: "Reward updated successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                await api.post("/admin/reward", formData);
                toast.update(loadingToast, {
                    render: "Reward created successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            }
            setIsFormModalOpen(false);
            getRewards();
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error saving reward",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    const statsCards = useMemo(
        () => [
            {
                title: "Total Reward Programs",
                value: stats.totalRewards,
                comparison: "0",
                icon: (
                    <Gift
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#605D55]",
            },
            {
                title: "Active Rewards",
                value: stats.activeRewards,
                comparison: "0",
                icon: (
                    <Gift
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#258D3F]",
            },
            {
                title: "Total Reward Logs",
                value: stats.totalLogs,
                comparison: "0",
                icon: (
                    <Users
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#856833]",
            },
            {
                title: "Total Rewards Given",
                value: formatCurrency(stats.totalRewardValue),
                comparison: "0",
                icon: (
                    <Gift
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#3b82f6]",
            },
        ],
        [stats],
    );

    const rewardsColumns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "S/N",
                cell: ({ row }) => row.index + 1,
                enableSorting: false,
            },
            {
                accessorKey: "rewardName",
                header: "Reward Name",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "rewardValue",
                header: "Reward Value",
                cell: (info) => formatCurrency(info.getValue()),
            },
            {
                accessorKey: "group",
                header: "Group",
                cell: (info) => (
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${
                            info.getValue() === "riders" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}
                    >
                        {info.getValue()?.charAt(0).toUpperCase() + info.getValue()?.slice(1)}
                    </span>
                ),
            },
            {
                accessorKey: "startDate",
                header: "Start Date",
                cell: (info) => new Date(info.getValue()).toLocaleDateString(),
            },
            {
                accessorKey: "endDate",
                header: "End Date",
                cell: (info) => new Date(info.getValue()).toLocaleDateString(),
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => {
                    const now = new Date();
                    now.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
                    const start = new Date(row.original.startDate);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(row.original.endDate);
                    end.setHours(0, 0, 0, 0);
                    const isActive = start <= now && end >= now;
                    return (
                        <span className={`rounded-full px-2 py-1 text-xs ${isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {isActive ? "Active" : "Inactive"}
                        </span>
                    );
                },
            },
            {
                accessorKey: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditReward(row.original);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteReward(row.original._id);
                            }}
                            className="text-red-600 hover:text-red-800"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
                enableSorting: false,
            },
        ],
        [],
    );

    const logsColumns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "S/N",
                cell: ({ row }) => row.index + 1,
                enableSorting: false,
            },
            {
                accessorKey: "user",
                header: "User Name",
                cell: (info) => info.getValue()?.fullname || "N/A",
            },
            {
                accessorKey: "rewardName",
                header: "Reward Name",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "rewardValue",
                header: "Reward Value",
                cell: (info) => formatCurrency(info.getValue() || 0),
            },
            {
                accessorKey: "userType",
                header: "User Type",
                cell: (info) => (
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${
                            info.getValue() === "riders" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}
                    >
                        {info.getValue()?.charAt(0).toUpperCase() + info.getValue()?.slice(1)}
                    </span>
                ),
            },
            {
                accessorKey: "date",
                header: "Date",
                cell: (info) => new Date(info.getValue()).toLocaleDateString(),
            },
            {
                accessorKey: "createdAt",
                header: "Created At",
                cell: (info) => new Date(info.getValue()).toLocaleString(),
            },
        ],
        [],
    );

    const rewardsTable = useReactTable({
        data: filteredRewards,
        columns: rewardsColumns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 25 } },
    });

    const logsTable = useReactTable({
        data: filteredLogs,
        columns: logsColumns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 25 } },
    });

    useEffect(() => {
        getRewards();
        getRewardLogs();
    }, []);

    useEffect(() => {
        if (activeTab === "rewards") {
            filterRewards(rewards, groupFilter);
        } else {
            filterLogs(rewardLogs, groupFilter);
        }
    }, [activeTab, groupFilter]);

    const currentTable = activeTab === "rewards" ? rewardsTable : logsTable;
    const currentData = activeTab === "rewards" ? filteredRewards : filteredLogs;

    return (
        <div className="dashboard-content p-3 md:p-4">
            <div className="mb-4 flex flex-col items-start justify-between gap-3 pt-4 sm:flex-row sm:items-center">
                <p className="text-[24px] font-medium">Rewards & Referrals Management</p>
                {activeTab === "rewards" && (
                    <button
                        onClick={handleCreateReward}
                        className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-sm text-white hover:bg-primary-600 sm:text-base"
                    >
                        <Plus size={16} />
                        Create Reward
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
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
                    {/* Tab Selection - Full width on mobile, auto on desktop */}
                    <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                        <button
                            onClick={() => setActiveTab("rewards")}
                            className={`flex-1 rounded-md px-4 py-2 text-sm sm:flex-none sm:text-base ${activeTab === "rewards" ? "bg-primary-500 text-white" : "bg-gray-200"}`}
                        >
                            Reward Programs
                        </button>
                        <button
                            onClick={() => setActiveTab("logs")}
                            className={`flex-1 rounded-md px-4 py-2 text-sm sm:flex-none sm:text-base ${activeTab === "logs" ? "bg-primary-500 text-white" : "bg-gray-200"}`}
                        >
                            Reward Logs
                        </button>
                    </div>

                    {/* Filters and Search - Stack on mobile, flex on desktop */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <select
                            value={groupFilter}
                            onChange={(e) => setGroupFilter(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
                        >
                            <option value="all">All Groups</option>
                            <option value="riders">Riders</option>
                            <option value="drivers">Drivers</option>
                        </select>
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full rounded-lg border py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
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
                            {currentTable.getHeaderGroups().map((headerGroup) => (
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
                            {currentTable.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => {
                                        setSelectedItem(row.original);
                                        setIsModalOpen(true);
                                    }}
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

                {currentData.length === 0 && <p className="p-4 text-center">No {activeTab === "rewards" ? "rewards" : "logs"} found</p>}

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-medium">{currentTable.getRowModel().rows.length}</span> of{" "}
                            <span className="font-medium">{currentData.length}</span> results
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => currentTable.previousPage()}
                            disabled={!currentTable.getCanPreviousPage()}
                            className="rounded-md border px-3 py-1 text-sm font-medium disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => currentTable.nextPage()}
                            disabled={!currentTable.getCanNextPage()}
                            className="rounded-md border px-3 py-1 text-sm font-medium disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedItem && (
                    <div className="space-y-6">
                        <h3 className="mb-6 text-center text-xl font-bold">{activeTab === "rewards" ? "Reward Details" : "Reward Log Details"}</h3>

                        <div className="space-y-4">
                            {activeTab === "rewards" ? (
                                <>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Reward Name</p>
                                        <p className="text-md">{selectedItem.rewardName}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Reward Value</p>
                                        <p className="text-md">{formatCurrency(selectedItem.rewardValue)}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Group</p>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs ${
                                                selectedItem.group === "riders" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {selectedItem.group?.charAt(0).toUpperCase() + selectedItem.group?.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Start Date</p>
                                        <p className="text-md">{new Date(selectedItem.startDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">End Date</p>
                                        <p className="text-md">{new Date(selectedItem.endDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Created At</p>
                                        <p className="text-md">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">User Name</p>
                                        <p className="text-md">{selectedItem.user?.fullname || "N/A"}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Reward Name</p>
                                        <p className="text-md">{selectedItem.rewardName}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Reward Value</p>
                                        <p className="text-md">{formatCurrency(selectedItem.rewardValue || 0)}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">User Type</p>
                                        <span
                                            className={`rounded-full px-2 py-1 text-xs ${
                                                selectedItem.userType === "riders" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {selectedItem.userType?.charAt(0).toUpperCase() + selectedItem.userType?.slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Date</p>
                                        <p className="text-md">{new Date(selectedItem.date).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium">Created At</p>
                                        <p className="text-md">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Create/Edit Reward Form Modal */}
            <Modal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
            >
                <div className="space-y-6">
                    <h3 className="text-center text-xl font-bold">{isEditMode ? "Edit Reward" : "Create New Reward"}</h3>
                    <form
                        onSubmit={handleSubmitReward}
                        className="space-y-4"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-medium">Reward Name</label>
                            <input
                                type="text"
                                value={formData.rewardName}
                                onChange={(e) => setFormData({ ...formData, rewardName: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Reward Value (₦)</label>
                            <input
                                type="number"
                                value={formData.rewardValue}
                                onChange={(e) => setFormData({ ...formData, rewardValue: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Group</label>
                            <select
                                value={formData.group}
                                onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="riders">Riders</option>
                                <option value="drivers">Drivers</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">Start Date</label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium">End Date</label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex-1 rounded-lg bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                            >
                                {isEditMode ? "Update Reward" : "Create Reward"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsFormModalOpen(false)}
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Rewards;
