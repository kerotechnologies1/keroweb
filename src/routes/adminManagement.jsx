import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Search, Plus, Edit, Trash2, ChevronUp, ChevronDown, Key } from "lucide-react";
import Modal from "@/components/modal";
import api from "@/utils/api";

const AdminUserManagement = () => {
    const [adminUsers, setAdminUsers] = useState([]);
    const [filteredAdminUsers, setFilteredAdminUsers] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullname: "",
        isLagosRole: false,
    });
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    // Fetch admin users data
    const getAdminUsers = async () => {
        const loadingToast = toast.loading("Fetching admin users...");
        try {
            const response = await api.get("/admin/adminusers/");
            // console.log(response.data.data);
            setAdminUsers(response.data.data);
            setFilteredAdminUsers(response.data.data);
            toast.update(loadingToast, {
                render: "Admin users loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching admin users",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handle password form input changes
    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({
            ...passwordData,
            [name]: value,
        });
    };

    // Open modal for adding new admin user
    const openAddModal = () => {
        setCurrentUser(null);
        setFormData({
            email: "",
            password: "",
            fullname: "",
            isLagosRole: false,
        });
        setIsModalOpen(true);
    };

    // Open modal for changing password
    const openPasswordModal = (user) => {
        setCurrentUser(user);
        setPasswordData({
            newPassword: "",
            confirmPassword: "",
        });
        setIsPasswordModalOpen(true);
    };

    // Submit form for adding new admin user
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading("Creating new admin user...");

        try {
            const payload = {
                email: formData.email,
                password: formData.password,
                fullname: formData.fullname,
            };

            // Add role if Lagos is selected
            if (formData.isLagosRole) {
                payload.role = "lagos";
            }

            await api.post("/admin/register", payload);
            toast.update(loadingToast, {
                render: "Admin user created successfully",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
            setIsModalOpen(false);
            getAdminUsers();
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error creating admin user",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    // Submit password change
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const loadingToast = toast.loading("Updating password...");

        try {
            await api.put(`/admin/adminusers/${currentUser._id}/change-password`, {
                newPassword: passwordData.newPassword,
            });
            toast.update(loadingToast, {
                render: "Password updated successfully",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
            setIsPasswordModalOpen(false);
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error updating password",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    // Delete admin user with confirmation
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
                const response = await api.delete(`/admin/adminusers/${id}/`);
                await Swal.fire("Deleted!", response.data.message || "Admin user deleted successfully.", "success");
                getAdminUsers();
            } catch (error) {
                Swal.fire("Error!", error.response?.data?.message || "Failed to delete admin user", "error");
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
                accessorKey: "fullname",
                header: "Full Name",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "role",
                header: "Role",
                cell: (info) => {
                    const role = info.getValue();
                    return (
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            role === "lagos" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-gray-100 text-gray-800"
                        }`}>
                            {role || "Admin"}
                        </span>
                    );
                },
            },
            {
                accessorKey: "createdAt",
                header: "Created At",
                cell: (info) => {
                    const date = new Date(info.getValue());
                    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
                },
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => openPasswordModal(row.original)} 
                            className="rounded-md bg-green-500 p-2 text-white hover:bg-green-600"
                            title="Change Password"
                        >
                            <Key size={16} />
                        </button>
                        <button 
                            onClick={() => handleDelete(row.original._id)} 
                            className="rounded-md bg-red-500 p-2 text-white hover:bg-red-600"
                            title="Delete User"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
                enableSorting: false,
            },
        ],
        []
    );

    // Initialize table
    const table = useReactTable({
        data: filteredAdminUsers,
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
        getAdminUsers();
    }, []);

    return (
        <div className="dashboard-content p-3 md:p-4">
            <div className="flex items-center justify-between">
                <p className="mb-4 pt-4 text-[24px] font-medium">Admin User Management</p>
                <button 
                    onClick={openAddModal} 
                    className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                >
                    <Plus size={16} />
                    Add New Admin
                </button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search admin users..."
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
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAdminUsers.length === 0 && <p className="p-4 text-center">No admin users found</p>}

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <span className="text-sm text-gray-700 dark:text-white">
                            Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of <span className="font-medium">{filteredAdminUsers.length}</span> results
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

            {/* Add Admin User Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-center">Add New Admin User</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Full Name</label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border dark:text-gray-700 border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                                placeholder="Enter full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border dark:text-gray-700 border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border dark:text-gray-700 border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                                placeholder="Enter secure password"
                                minLength="6"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="isLagosRole"
                                checked={formData.isLagosRole}
                                onChange={handleInputChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <label className="ml-2 text-sm font-medium text-gray-700 dark:text-white">
                                Lagos Role
                            </label>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md border border-transparent bg-primary-500 dark:bg-secondary-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                Create Admin
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Change Password Modal */}
            <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-center">Change Password</h3>
                    {currentUser && (
                        <p className="text-center text-gray-600">
                            Changing password for: <strong>{currentUser.fullname}</strong>
                        </p>
                    )}

                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordInputChange}
                                className="mt-1 block w-full rounded-md border dark:text-gray-700 border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                                placeholder="Enter new password"
                                minLength="6"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">Confirm New Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordInputChange}
                                className="mt-1 block w-full rounded-md border dark:text-gray-700 border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                                placeholder="Confirm new password"
                                minLength="6"
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-md border border-transparent bg-primary-500 dark:bg-secondary-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default AdminUserManagement;