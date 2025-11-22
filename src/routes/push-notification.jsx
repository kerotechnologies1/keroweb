import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Search, Plus, Edit, Trash2, ChevronUp, ChevronDown, Bell } from "lucide-react";
import Modal from "@/components/modal";
import api from "@/utils/api";

const PushNotifications = () => {
    // const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentNotification, setCurrentNotification] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        userGroup: "",
        city: "",
        startDate: "",
        endDate: "",
        message: "",
    });

    // Fetch notifications data
    const getNotifications = async () => {
        const loadingToast = toast.loading("Fetching notifications...");
        try {
            const response = await api.get("/admin/push-notifications");
            // setNotifications(response.data.data);
            setFilteredNotifications(response.data.data);
            toast.update(loadingToast, {
                render: "Notifications loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching notifications",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Open modal for adding new notification
    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentNotification(null);
        setFormData({
            title: "",
            userGroup: "",
            city: "",
            startDate: "",
            endDate: "",
            message: "",
        });
        setIsModalOpen(true);
    };

    // Open modal for editing notification
    const openEditModal = (notification) => {
        setIsEditMode(true);
        setCurrentNotification(notification);
        setFormData({
            title: notification.title,
            userGroup: notification.userGroup,
            city: notification.city,
            startDate: notification.startDate ? new Date(notification.startDate).toISOString().split("T")[0] : "",
            endDate: notification.endDate ? new Date(notification.endDate).toISOString().split("T")[0] : "",
            message: notification.message,
        });
        setIsModalOpen(true);
    };

    // Submit form (both add and edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(isEditMode ? "Updating notification..." : "Creating notification...");

        try {
            if (isEditMode && currentNotification?._id) {
                // Update existing notification
                await api.put(`/admin/push-notification/${currentNotification._id}`, formData);
                toast.update(loadingToast, {
                    render: "Notification updated successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                // Create new notification
                await api.post("/admin/push-notification", formData);
                toast.update(loadingToast, {
                    render: "Notification created successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            }

            setIsModalOpen(false);
            getNotifications();
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error processing request",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    // Delete notification with confirmation
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const response = await api.delete(`/admin/push-notification/${id}`);
                await Swal.fire("Deleted!", response.data.message || "Notification deleted successfully.", "success");
                getNotifications();
            } catch (error) {
                Swal.fire("Error!", error.response?.data?.message || "Failed to delete notification", "error");
            }
        }
    };

    // Table columns
    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "S/N",
                cell: ({ row }) => row.index + 1,
                enableSorting: false,
            },
            {
                accessorKey: "title",
                header: "Title",
            },
            {
                accessorKey: "userGroup",
                header: "User Group",
                cell: (info) => <span className="capitalize">{info.getValue() === "both" ? "Drivers & Riders" : info.getValue()}</span>,
            },
            {
                accessorKey: "city",
                header: "City",
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
                accessorKey: "active",
                header: "Status",
                cell: (info) => (
                    <span className={`rounded-full px-2 py-1 text-xs ${info.getValue() ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {info.getValue() ? "Active" : "Inactive"}
                    </span>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => openEditModal(row.original)}
                            className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original._id)}
                            className="rounded-md bg-red-500 p-2 text-white hover:bg-red-600"
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

    // Initialize table
    const table = useReactTable({
        data: filteredNotifications,
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
                pageSize: 10,
            },
        },
    });

    // Fetch data on component mount
    useEffect(() => {
        getNotifications();
    }, []);

    return (
        <div className="dashboard-content p-3 md:p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    <p className="mb-4 pt-4 text-[24px] font-medium">Push Notifications</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                >
                    <Plus size={16} />
                    Create Notification
                </button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            onClick={header.column.getToggleSortingHandler()}
                                            style={{
                                                cursor: header.column.getCanSort() ? "pointer" : "default",
                                            }}
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

                {filteredNotifications.length === 0 && <p className="p-4 text-center">No notifications found</p>}

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <span className="text-sm text-gray-700 dark:text-white">
                            Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{" "}
                            <span className="font-medium">{filteredNotifications.length}</span> results
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

            {/* Notification Form Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="space-y-6">
                    <h3 className="text-center text-xl font-bold">{isEditMode ? "Edit Notification" : "Create New Notification"}</h3>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                                placeholder="e.g., Road Closure Alert"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">User Group</label>
                            <select
                                name="userGroup"
                                value={formData.userGroup}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                            >
                                <option value="">Select User Group</option>
                                <option value="drivers">Drivers</option>
                                <option value="riders">Riders</option>
                                <option value="both">Both (Drivers & Riders)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                                placeholder="e.g., Lagos"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-white">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows="4"
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                                placeholder="Enter notification message..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-500"
                            >
                                {isEditMode ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default PushNotifications;
