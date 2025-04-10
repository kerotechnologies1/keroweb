import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Search, Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import Modal from "@/components/Modal";
import api from "@/utils/api";

const PricingManagement = () => {
    const [pricing, setPricing] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [filteredPricing, setFilteredPricing] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPricing, setCurrentPricing] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [formData, setFormData] = useState({
        pricePerKm: "",
        keroCommission: "",
        vehicleType: "",
    });

    // Fetch pricing data
    const getPricing = async () => {
        const loadingToast = toast.loading("Fetching pricing data...");
        try {
            const response = await api.get("/admin/pricing");
            console.log(response.data.data);
            setPricing(response.data.data);
            setFilteredPricing(response.data.data);
            toast.update(loadingToast, {
                render: "Pricing data loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching pricing data",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    // Fetch vehicle types
    const getVehicleTypes = async () => {
        const loadingToast = toast.loading("Fetching Vehicle Type...");
        try {
            const response = await api.get("/admin/vehicletypes");
            setVehicleTypes(response.data.data);
            console.log(response.data);
            toast.update(loadingToast, {
                render: "Vehicle Type loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching pricing data",
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

    // Open modal for adding new pricing
    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentPricing(null);
        setFormData({
            pricePerKm: "",
            keroCommission: "",
            vehicleType: "",
        });
        setIsModalOpen(true);
    };

    // Open modal for editing pricing
    const openEditModal = (pricing) => {
        setIsEditMode(true);
        setCurrentPricing(pricing);
        setFormData({
            pricePerKm: pricing.pricePerKm,
            keroCommission: pricing.keroCommission,
            vehicleType: pricing.vehicleType,
        });
        setIsModalOpen(true);
    };

    // Submit form (both add and edit)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(isEditMode ? "Updating pricing..." : "Creating new pricing...");

        try {
            if (isEditMode) {
                await api.put(`/admin/pricing/${currentPricing._id}`, formData);
                toast.update(loadingToast, {
                    render: "Pricing updated successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                await api.post("/admin/pricing", formData);
                toast.update(loadingToast, {
                    render: "Pricing created successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            }
            setIsModalOpen(false);
            getPricing();
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error processing request",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    // Delete pricing with confirmation
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
                const response = await api.delete(`/admin/pricing/${id}`);
                await Swal.fire("Deleted!", response.data.message || "Pricing deleted successfully.", "success");
                getPricing();
            } catch (error) {
                Swal.fire("Error!", error.response?.data?.message || "Failed to delete pricing", "error");
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
                accessorKey: "vehicleType",
                header: "Vehicle Type",
            },
            {
                accessorKey: "pricePerKm",
                header: "Price Per Km (₦)",
                cell: (info) => `₦${info.getValue()}`,
            },
            {
                accessorKey: "keroCommission",
                header: "Commission (₦)",
                cell: (info) => `₦${info.getValue()}`,
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button onClick={() => openEditModal(row.original)} className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(row.original._id)} className="rounded-md bg-red-500 p-2 text-white hover:bg-red-600">
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
        data: filteredPricing,
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
        getPricing();
        getVehicleTypes();
    }, []);

    useEffect(() => {
        console.log("vehicleTypes:", vehicleTypes);
    }, [vehicleTypes]);

    return (
        <div className="dashboard-content p-3 md:p-4">
            <div className="flex items-center justify-between">
                <p className="mb-4 pt-4 text-[24px] font-medium">Pricing Management</p>
                <button onClick={openAddModal} className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600">
                    <Plus size={16} />
                    Add New Pricing
                </button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search pricing..."
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

                {filteredPricing.length === 0 && <p className="p-4 text-center">No pricing data found</p>}

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of <span className="font-medium">{filteredPricing.length}</span> results
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="rounded-md border px-3 py-1 text-sm font-medium disabled:opacity-50">
                            Previous
                        </button>
                        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded-md border px-3 py-1 text-sm font-medium disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Pricing Form Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-center">{isEditMode ? "Edit Pricing" : "Add New Pricing"}</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                            <select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                                disabled={isEditMode}
                            >
                                <option value="">Select Vehicle Type</option>
                                {vehicleTypes.map((type) => (
                                    <option key={type._id} value={type._id}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price Per Km (₦)</label>
                            <input
                                type="number"
                                name="pricePerKm"
                                value={formData.pricePerKm}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Kero Commission (₦)</label>
                            <input
                                type="number"
                                name="keroCommission"
                                value={formData.keroCommission}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                                required
                                min="0"
                                step="0.01"
                            />
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
                                className="rounded-md border border-transparent bg-primary-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
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

export default PricingManagement;
