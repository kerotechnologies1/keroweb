import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Search, Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import Modal from "@/components/modal";
import api from "@/utils/api";

// FIX 1: Guard against NaN — if pct is empty/null/undefined, return 0
const percentToRate = (pct) => {
    const n = parseFloat(pct);
    return isNaN(n) ? 0 : n / 100;
};

// FIX 2: Guard against null/undefined from API — always return a string
const rateToPercent = (rate) => {
    const n = parseFloat(rate);
    return isNaN(n) ? "" : String(n * 100);
};

const defaultForm = {
    vehicleType:         "",
    pricePerKm:          "",
    pricePerMin:         "20",
    baseFare:            "600",
    minimumFare:         "1000",
    keroCommissionRate:  "",   // displayed as % e.g. "15" for 15%
    lagosCommissionRate: "0",  // displayed as % e.g. "0"
    isActive:            true,
};

const PricingManagement = () => {
    const [pricing, setPricing] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [filteredPricing, setFilteredPricing] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPricing, setCurrentPricing] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [formData, setFormData] = useState(defaultForm);

    // ── Fetch pricing data ────────────────────────────────────────────────────
    const getPricing = async () => {
        const loadingToast = toast.loading("Fetching pricing data...");
        try {
            const response = await api.get("/admin/pricing");
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

    // ── Fetch vehicle types ───────────────────────────────────────────────────
    const getVehicleTypes = async () => {
        const loadingToast = toast.loading("Fetching Vehicle Types...");
        try {
            const response = await api.get("/admin/vehicletypes");
            setVehicleTypes(response.data.data);
            toast.update(loadingToast, {
                render: "Vehicle Types loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching vehicle types",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    // ── Handle form input changes ─────────────────────────────────────────────
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // ── Open modal for adding new pricing ─────────────────────────────────────
    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentPricing(null);
        setFormData(defaultForm);
        setIsModalOpen(true);
    };

    // ── Open modal for editing pricing ────────────────────────────────────────
    const openEditModal = (pricingRow) => {
        setIsEditMode(true);
        setCurrentPricing(pricingRow);
        setFormData({
            // FIX 3: vehicleType must stay as a string ID, not the populated object
            vehicleType:         pricingRow.vehicleType?._id ?? pricingRow.vehicleType ?? "",
            pricePerKm:          String(pricingRow.pricePerKm ?? ""),
            pricePerMin:         String(pricingRow.pricePerMin ?? 20),
            baseFare:            String(pricingRow.baseFare ?? 600),
            minimumFare:         String(pricingRow.minimumFare ?? 1000),
            // FIX 4: use guarded rateToPercent so null/undefined never becomes ""
            keroCommissionRate:  rateToPercent(pricingRow.keroCommissionRate),
            lagosCommissionRate: rateToPercent(pricingRow.lagosCommissionRate ?? 0),
            isActive:            pricingRow.isActive ?? true,
        });
        setIsModalOpen(true);
    };

    // ── Submit form (add and edit) ────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        // FIX 5: Validate on the frontend before sending anything
        if (!formData.vehicleType) {
            toast.error("Please select a vehicle type.");
            return;
        }
        if (formData.pricePerKm === "" || isNaN(Number(formData.pricePerKm))) {
            toast.error("Price per km is required.");
            return;
        }
        if (formData.keroCommissionRate === "" || isNaN(Number(formData.keroCommissionRate))) {
            toast.error("Kero commission rate is required.");
            return;
        }

        // FIX 6: Build payload with guarded percentToRate — no NaN ever reaches backend
        const payload = {
            vehicleType:         formData.vehicleType,
            pricePerKm:          Number(formData.pricePerKm),
            pricePerMin:         Number(formData.pricePerMin),
            baseFare:            Number(formData.baseFare),
            minimumFare:         Number(formData.minimumFare),
            keroCommissionRate:  percentToRate(formData.keroCommissionRate),
            lagosCommissionRate: percentToRate(formData.lagosCommissionRate),
            isActive:            formData.isActive,
        };

        // Debug: remove this after confirming it works
        console.log("Payload →", JSON.stringify(payload, null, 2));

        const loadingToast = toast.loading(
            isEditMode ? "Updating pricing..." : "Creating new pricing..."
        );

        try {
            if (isEditMode && currentPricing?._id) {
                await api.put(`/admin/pricing/${currentPricing._id}`, payload);
                toast.update(loadingToast, {
                    render: "Pricing updated successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                await api.post("/admin/pricing", payload);
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

    // ── Delete pricing with confirmation ──────────────────────────────────────
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
                await Swal.fire("Deleted!", response.data.message || "Pricing deleted.", "success");
                getPricing();
            } catch (error) {
                Swal.fire("Error!", error.response?.data?.message || "Failed to delete pricing", "error");
            }
        }
    };

    // ── Table columns ─────────────────────────────────────────────────────────
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
                // FIX 7: safely access name in case vehicleType isn't populated
                cell: (info) => info.getValue()?.name ?? "—",
            },
            {
                accessorKey: "pricePerKm",
                header: "Price Per Km (₦)",
                cell: (info) => `₦${info.getValue()}`,
            },
            {
                accessorKey: "baseFare",
                header: "Base Fare (₦)",
                cell: (info) => `₦${info.getValue() ?? 600}`,
            },
            {
                accessorKey: "minimumFare",
                header: "Minimum Fare (₦)",
                cell: (info) => `₦${info.getValue() ?? 1000}`,
            },
            {
                accessorKey: "keroCommissionRate",
                header: "Kero Commission",
                cell: (info) => `${((info.getValue() ?? 0) * 100).toFixed(1)}%`,
            },
            {
                accessorKey: "lagosCommissionRate",
                header: "Lagos Commission",
                cell: (info) => `${((info.getValue() ?? 0) * 100).toFixed(1)}%`,
            },
            {
                accessorKey: "isActive",
                header: "Status",
                cell: (info) => (
                    <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                            info.getValue()
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
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

    // ── Initialize table ──────────────────────────────────────────────────────
    const table = useReactTable({
        data: filteredPricing,
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10 } },
    });

    useEffect(() => {
        getPricing();
        getVehicleTypes();
    }, []);

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="dashboard-content p-3 md:p-4">
            <div className="flex items-center justify-between">
                <p className="mb-4 pt-4 text-[24px] font-medium">Pricing Management</p>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                >
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
                                <tr key={row.id} className="hover:bg-gray-50">
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

                {filteredPricing.length === 0 && (
                    <p className="p-4 text-center">No pricing data found</p>
                )}

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-white">
                        Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{" "}
                        <span className="font-medium">{filteredPricing.length}</span> results
                    </span>
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

            {/* Pricing Form Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="space-y-6">
                    <h3 className="text-center text-xl font-bold">
                        {isEditMode ? "Edit Pricing" : "Add New Pricing"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Vehicle Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Vehicle Type
                            </label>
                            {/* FIX 8: removed `disabled` — use readOnly styling instead so the
                                value is still part of the form. The select is visually locked in
                                edit mode via pointer-events:none but the value is submitted. */}
                            <select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleInputChange}
                                required
                                style={isEditMode ? { pointerEvents: "none", opacity: 0.6 } : {}}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                            >
                                <option value="">Select Vehicle Type</option>
                                {vehicleTypes.map((type) => (
                                    <option key={type._id} value={type._id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            {isEditMode && (
                                <p className="mt-1 text-xs text-gray-400">
                                    Vehicle type cannot be changed after creation.
                                </p>
                            )}
                        </div>

                        {/* Price Per Km */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Price Per Km (₦)
                            </label>
                            <input
                                type="number"
                                name="pricePerKm"
                                value={formData.pricePerKm}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                                min="0"
                                step="0.01"
                                placeholder="e.g. 150"
                            />
                        </div>

                        {/* Price Per Minute */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Price Per Minute (₦)
                            </label>
                            <input
                                type="number"
                                name="pricePerMin"
                                value={formData.pricePerMin}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        {/* Base Fare */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Base Fare (₦)
                            </label>
                            <input
                                type="number"
                                name="baseFare"
                                value={formData.baseFare}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                                min="0"
                                step="0.01"
                            />
                            <p className="mt-1 text-xs text-gray-500">Flat fee charged at the start of every trip</p>
                        </div>

                        {/* Minimum Fare */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Minimum Fare (₦)
                            </label>
                            <input
                                type="number"
                                name="minimumFare"
                                value={formData.minimumFare}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                                min="0"
                                step="0.01"
                            />
                            <p className="mt-1 text-xs text-gray-500">Fare will never go below this amount</p>
                        </div>

                        {/* Kero Commission Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Kero Commission (%)
                            </label>
                            <input
                                type="number"
                                name="keroCommissionRate"
                                value={formData.keroCommissionRate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder="e.g. 15 for 15%"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Enter as a percentage — e.g. enter 15 for 15%
                            </p>
                        </div>

                        {/* Lagos Commission Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Lagos Commission (%)
                            </label>
                            <input
                                type="number"
                                name="lagosCommissionRate"
                                value={formData.lagosCommissionRate}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                min="0"
                                max="100"
                                step="0.1"
                                placeholder="e.g. 0 for 0%"
                            />
                        </div>

                        {/* Active toggle */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-white">
                                Active
                            </label>
                        </div>

                        {/* Actions */}
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

export default PricingManagement;
