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
import { Search, Plus, Edit, Trash2, ChevronUp, ChevronDown, Zap, ZapOff } from "lucide-react";
import Modal from "@/components/modal";
import api from "@/utils/api";

const TIER_LABELS = {
    Normal:   { bg: "bg-green-100",  text: "text-green-700"  },
    Moderate: { bg: "bg-yellow-100", text: "text-yellow-700" },
    Peak:     { bg: "bg-orange-100", text: "text-orange-700" },
    Custom:   { bg: "bg-purple-100", text: "text-purple-700" },
};

const getTierLabel = (multiplier, tiers = []) => {
    const match = tiers.find(
        (t) => multiplier >= t.minMultiplier && multiplier <= t.maxMultiplier,
    );
    return match ? match.label : "Custom";
};

const defaultForm = {
    pricingId:         "",
    currentMultiplier: "1.0",
    maxMultiplier:     "1.5",
    reason:            "",
    expiresAt:         "",
};

const SurgeManagement = () => {
    const [surges, setSurges] = useState([]);
    const [pricing, setPricing] = useState([]);
    const [filteredSurges, setFilteredSurges] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSurge, setCurrentSurge] = useState(null);
    const [formData, setFormData] = useState(defaultForm);
    // For the inline multiplier quick-edit on active surges
    const [liveMultiplier, setLiveMultiplier] = useState({});

    // ── Fetch all surges ──────────────────────────────────────────────────────
    const getSurges = async () => {
        const loadingToast = toast.loading("Fetching surge configs...");
        try {
            const res = await api.get("/admin/surge");
            setSurges(res.data.data);
            setFilteredSurges(res.data.data);
            // Seed liveMultiplier map
            const map = {};
            res.data.data.forEach((s) => { map[s._id] = String(s.currentMultiplier); });
            setLiveMultiplier(map);
            toast.update(loadingToast, {
                render: "Surge configs loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching surge configs",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    // ── Fetch all pricing configs (for the pricingId dropdown) ────────────────
    const getPricing = async () => {
        try {
            const res = await api.get("/admin/pricing");
            setPricing(res.data.data);
        } catch {
            // silent — pricing list is supplementary
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ── Open modal: add ───────────────────────────────────────────────────────
    const openAddModal = () => {
        setIsEditMode(false);
        setCurrentSurge(null);
        setFormData(defaultForm);
        setIsModalOpen(true);
    };

    // ── Open modal: edit ──────────────────────────────────────────────────────
    const openEditModal = (surge) => {
        setIsEditMode(true);
        setCurrentSurge(surge);
        setFormData({
            pricingId:         surge.pricing?._id ?? surge.pricing ?? "",
            currentMultiplier: String(surge.currentMultiplier ?? 1.0),
            maxMultiplier:     String(surge.maxMultiplier ?? 1.5),
            reason:            surge.reason ?? "",
            expiresAt:         surge.expiresAt
                ? new Date(surge.expiresAt).toISOString().slice(0, 16)
                : "",
        });
        setIsModalOpen(true);
    };

    // ── Submit: create or update ──────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        const cur = Number(formData.currentMultiplier);
        const max = Number(formData.maxMultiplier);

        if (!formData.pricingId) {
            toast.error("Please select a pricing config.");
            return;
        }
        if (isNaN(cur) || cur < 1) {
            toast.error("Current multiplier must be at least 1.0.");
            return;
        }
        if (isNaN(max) || max < cur) {
            toast.error("Max multiplier must be ≥ current multiplier.");
            return;
        }

        const payload = {
            pricingId:         formData.pricingId,
            currentMultiplier: cur,
            maxMultiplier:     max,
            reason:            formData.reason || null,
            expiresAt:         formData.expiresAt || null,
        };

        const loadingToast = toast.loading(
            isEditMode ? "Updating surge..." : "Creating surge config..."
        );

        try {
            if (isEditMode && currentSurge?._id) {
                // PUT only accepts multiplier/reason/expiry — not pricingId
                const { pricingId, ...updatePayload } = payload;
                await api.put(`/admin/surge/${currentSurge._id}`, updatePayload);
                toast.update(loadingToast, {
                    render: "Surge updated successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            } else {
                await api.post("/admin/surge", payload);
                toast.update(loadingToast, {
                    render: "Surge config created. Activate it to go live.",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
            setIsModalOpen(false);
            getSurges();
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error processing request",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    // ── Activate ──────────────────────────────────────────────────────────────
    const handleActivate = async (surge) => {
        const result = await Swal.fire({
            title: `Activate surge at ${surge.currentMultiplier}x?`,
            text: `This will go live immediately for ${surge.vehicleType?.name ?? "this vehicle type"}. Any other active surge for the same type will be deactivated.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, activate",
        });
        if (!result.isConfirmed) return;

        try {
            await api.patch(`/admin/surge/${surge._id}/activate`);
            toast.success(`Surge activated at ${surge.currentMultiplier}x`);
            getSurges();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to activate surge");
        }
    };

    // ── Deactivate ────────────────────────────────────────────────────────────
    const handleDeactivate = async (surge) => {
        const result = await Swal.fire({
            title: "Deactivate surge?",
            text: "Fares will return to 1.0× immediately.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, deactivate",
        });
        if (!result.isConfirmed) return;

        try {
            await api.patch(`/admin/surge/${surge._id}/deactivate`);
            toast.success("Surge deactivated. Fares are back to 1.0×");
            getSurges();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to deactivate surge");
        }
    };

    // ── Update live multiplier on active surge ────────────────────────────────
    const handleUpdateMultiplier = async (surge) => {
        const val = Number(liveMultiplier[surge._id]);
        if (isNaN(val) || val < 1) {
            toast.error("Multiplier must be at least 1.0");
            return;
        }
        if (val > surge.maxMultiplier) {
            toast.error(`Multiplier cannot exceed max of ${surge.maxMultiplier}×`);
            return;
        }
        try {
            await api.patch(`/admin/surge/${surge._id}/multiplier`, {
                currentMultiplier: val,
            });
            toast.success(`Multiplier updated to ${val}×`);
            getSurges();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update multiplier");
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async (surge) => {
        if (surge.isActive) {
            toast.error("Deactivate the surge before deleting it.");
            return;
        }
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });
        if (!result.isConfirmed) return;

        try {
            await api.delete(`/admin/surge/${surge._id}`);
            await Swal.fire("Deleted!", "Surge config deleted.", "success");
            getSurges();
        } catch (error) {
            Swal.fire("Error!", error.response?.data?.message || "Failed to delete surge", "error");
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
                cell: (info) => info.getValue()?.name ?? "—",
            },
            {
                accessorKey: "pricing",
                header: "Pricing Config",
                cell: (info) => {
                    const p = info.getValue();
                    return p ? `₦${p.pricePerKm}/km` : "—";
                },
            },
            {
                accessorKey: "currentMultiplier",
                header: "Current Multiplier",
                cell: ({ row }) => {
                    const surge = row.original;
                    const tierLabel = getTierLabel(surge.currentMultiplier, surge.surgeTiers);
                    const style = TIER_LABELS[tierLabel] ?? TIER_LABELS.Custom;
                    return (
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{surge.currentMultiplier}×</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
                                {tierLabel}
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "maxMultiplier",
                header: "Max Cap",
                cell: (info) => `${info.getValue()}×`,
            },
            {
                accessorKey: "reason",
                header: "Reason",
                cell: (info) => info.getValue() ?? <span className="text-gray-400">—</span>,
            },
            {
                accessorKey: "expiresAt",
                header: "Expires",
                cell: (info) => {
                    const val = info.getValue();
                    if (!val) return <span className="text-gray-400">No expiry</span>;
                    const d = new Date(val);
                    const expired = d < new Date();
                    return (
                        <span className={expired ? "text-red-500" : "text-gray-700"}>
                            {d.toLocaleString("en-NG", {
                                day: "2-digit", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit",
                            })}
                            {expired && " (expired)"}
                        </span>
                    );
                },
            },
            {
                accessorKey: "isActive",
                header: "Status",
                cell: (info) => (
                    <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                            info.getValue()
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {info.getValue() ? "Live" : "Inactive"}
                    </span>
                ),
            },
            {
                id: "liveControl",
                header: "Live Multiplier",
                cell: ({ row }) => {
                    const surge = row.original;
                    if (!surge.isActive) return <span className="text-gray-400 text-xs">Not active</span>;
                    return (
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={liveMultiplier[surge._id] ?? surge.currentMultiplier}
                                onChange={(e) =>
                                    setLiveMultiplier((prev) => ({
                                        ...prev,
                                        [surge._id]: e.target.value,
                                    }))
                                }
                                className="w-16 rounded border border-gray-300 px-1 py-1 text-sm dark:text-gray-700"
                                min="1"
                                max={surge.maxMultiplier}
                                step="0.1"
                            />
                            <button
                                onClick={() => handleUpdateMultiplier(surge)}
                                className="rounded bg-primary-500 px-2 py-1 text-xs text-white hover:bg-primary-600"
                            >
                                Set
                            </button>
                        </div>
                    );
                },
                enableSorting: false,
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const surge = row.original;
                    return (
                        <div className="flex items-center space-x-2">
                            {/* Activate / Deactivate toggle */}
                            {surge.isActive ? (
                                <button
                                    onClick={() => handleDeactivate(surge)}
                                    title="Deactivate"
                                    className="rounded-md bg-yellow-500 p-2 text-white hover:bg-yellow-600"
                                >
                                    <ZapOff size={16} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleActivate(surge)}
                                    title="Activate"
                                    className="rounded-md bg-green-500 p-2 text-white hover:bg-green-600"
                                >
                                    <Zap size={16} />
                                </button>
                            )}
                            {/* Edit */}
                            <button
                                onClick={() => openEditModal(surge)}
                                className="rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
                            >
                                <Edit size={16} />
                            </button>
                            {/* Delete */}
                            <button
                                onClick={() => handleDelete(surge)}
                                disabled={surge.isActive}
                                title={surge.isActive ? "Deactivate before deleting" : "Delete"}
                                className="rounded-md bg-red-500 p-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                },
                enableSorting: false,
            },
        ],
        [liveMultiplier],
    );

    const table = useReactTable({
        data: filteredSurges,
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
        getSurges();
        getPricing();
    }, []);

    const activeSurgeCount = surges.filter((s) => s.isActive).length;

    return (
        <div className="dashboard-content p-3 md:p-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="mb-1 pt-4 text-[24px] font-medium">Surge Management</p>
                    {activeSurgeCount > 0 && (
                        <p className="mb-4 text-sm text-yellow-600 font-medium">
                            {activeSurgeCount} surge{activeSurgeCount > 1 ? "s" : ""} currently live
                        </p>
                    )}
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
                >
                    <Plus size={16} />
                    Add Surge Config
                </button>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
                {/* Search */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search surges..."
                            className="w-full rounded-lg border py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
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
                                <tr
                                    key={row.id}
                                    className={`hover:bg-gray-50 ${
                                        row.original.isActive ? "bg-yellow-50" : ""
                                    }`}
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

                {filteredSurges.length === 0 && (
                    <p className="p-4 text-center">No surge configs found</p>
                )}

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-white">
                        Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{" "}
                        <span className="font-medium">{filteredSurges.length}</span> results
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

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="space-y-6">
                    <h3 className="text-center text-xl font-bold">
                        {isEditMode ? "Edit Surge Config" : "Add Surge Config"}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Pricing Config — disabled in edit mode */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Pricing Config
                            </label>
                            <select
                                name="pricingId"
                                value={formData.pricingId}
                                onChange={handleInputChange}
                                required
                                style={isEditMode ? { pointerEvents: "none", opacity: 0.6 } : {}}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                            >
                                <option value="">Select Pricing Config</option>
                                {pricing.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.vehicleType?.name ?? p._id} — ₦{p.pricePerKm}/km
                                    </option>
                                ))}
                            </select>
                            {isEditMode && (
                                <p className="mt-1 text-xs text-gray-400">
                                    Pricing config cannot be changed after creation.
                                </p>
                            )}
                        </div>

                        {/* Current Multiplier */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Current Multiplier
                            </label>
                            <input
                                type="number"
                                name="currentMultiplier"
                                value={formData.currentMultiplier}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                                min="1"
                                step="0.1"
                                placeholder="e.g. 1.3"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                1.0 = normal fare · 1.3 = 30% more · 1.5 = 50% more
                            </p>
                        </div>

                        {/* Max Multiplier */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Max Multiplier Cap
                            </label>
                            <input
                                type="number"
                                name="maxMultiplier"
                                value={formData.maxMultiplier}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                required
                                min="1"
                                step="0.1"
                                placeholder="e.g. 1.5"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Hard ceiling — the live multiplier can never exceed this value
                            </p>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Reason <span className="text-gray-400">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="reason"
                                value={formData.reason}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                                placeholder="e.g. Rush hour, Eko Atlantic concert, Rain"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Shown to the rider on the fare screen if surge is active
                            </p>
                        </div>

                        {/* Expires At */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                Auto-expire at <span className="text-gray-400">(optional)</span>
                            </label>
                            <input
                                type="datetime-local"
                                name="expiresAt"
                                value={formData.expiresAt}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:text-gray-700 sm:text-sm"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Leave empty for no automatic expiry — deactivate manually
                            </p>
                        </div>

                        {/* Tier preview */}
                        <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                                Surge tiers (default)
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {[
                                    { label: "Normal",   range: "1.0×",       style: TIER_LABELS.Normal   },
                                    { label: "Moderate", range: "1.1× – 1.3×", style: TIER_LABELS.Moderate },
                                    { label: "Peak",     range: "1.3× – 1.5×", style: TIER_LABELS.Peak     },
                                ].map((t) => (
                                    <span
                                        key={t.label}
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${t.style.bg} ${t.style.text}`}
                                    >
                                        {t.label} ({t.range})
                                    </span>
                                ))}
                            </div>
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

export default SurgeManagement;
