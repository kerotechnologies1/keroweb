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

const PricingManagement = () => {
  const [pricing, setPricing] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPricing, setCurrentPricing] = useState(null);
  const [formData, setFormData] = useState({
    vehicleType: "",
    baseFare: 600,
    pricePerKm: "",
    pricePerMin: 20,
    minimumFare: 1000,
    keroCommissionRate: 0.3,
    lagosCommissionRate: 30,
  });

  // Fetch all pricing
  const getPricing = async () => {
    const loading = toast.loading("Fetching pricing data...");
    try {
      const { data } = await api.get("/admin/pricing");
      setPricing(data.data);
      toast.update(loading, { render: "Pricing loaded", type: "success", isLoading: false, autoClose: 2000 });
    } catch (err) {
      toast.update(loading, { render: err.response?.data?.message || "Error fetching pricing", type: "error", isLoading: false, autoClose: 2000 });
    }
  };

  // Fetch vehicle types
  const getVehicleTypes = async () => {
    try {
      const { data } = await api.get("/admin/vehicle-types");
      setVehicleTypes(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load vehicle types");
    }
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Add Modal
  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentPricing(null);
    setFormData({ vehicleType: "", baseFare: 600, pricePerKm: "", pricePerMin: 20, minimumFare: 1000, keroCommissionRate: 0.3, lagosCommissionRate: 30 });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setIsEditMode(true);
    setCurrentPricing(item);
    setFormData({
      vehicleType: item.vehicleType._id,
      baseFare: item.baseFare,
      pricePerKm: item.pricePerKm,
      pricePerMin: item.pricePerMin,
      minimumFare: item.minimumFare,
      keroCommissionRate: item.keroCommissionRate,
      lagosCommissionRate: item.lagosCommissionRate,
    });
    setIsModalOpen(true);
  };

  // Create/Update Pricing
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loading = toast.loading(isEditMode ? "Updating pricing..." : "Creating pricing...");
    try {
      if (isEditMode && currentPricing?._id) {
        await api.put(`/admin/pricing/${currentPricing._id}`, formData);
        toast.update(loading, { render: "Pricing updated successfully", type: "success", isLoading: false, autoClose: 2000 });
      } else {
        await api.post("/admin/pricing", formData);
        toast.update(loading, { render: "Pricing created successfully", type: "success", isLoading: false, autoClose: 2000 });
      }
      setIsModalOpen(false);
      getPricing();
    } catch (err) {
      toast.update(loading, { render: err.response?.data?.message || "Error processing request", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  // Delete pricing
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete pricing and linked surge data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/admin/pricing/${id}`);
        Swal.fire("Deleted!", "Pricing deleted successfully.", "success");
        getPricing();
      } catch (err) {
        Swal.fire("Error!", err.response?.data?.message || "Failed to delete pricing", "error");
      }
    }
  };

  // Toggle pricing isActive
  const handleToggle = async (id) => {
    try {
      await api.patch(`/admin/pricing/${id}/toggle`);
      getPricing();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle pricing");
    }
  };

  // Table columns
  const columns = useMemo(() => [
    { accessorKey: "_id", header: "S/N", cell: ({ row }) => row.index + 1 },
    { accessorKey: "vehicleType", header: "Vehicle", cell: (info) => info.getValue().name },
    { accessorKey: "baseFare", header: "Base Fare (₦)", cell: (info) => `₦${info.getValue()}` },
    { accessorKey: "pricePerKm", header: "Price Per Km (₦)", cell: (info) => `₦${info.getValue()}` },
    { accessorKey: "pricePerMin", header: "Price Per Min (₦)", cell: (info) => `₦${info.getValue()}` },
    { accessorKey: "minimumFare", header: "Minimum Fare (₦)", cell: (info) => `₦${info.getValue()}` },
    { accessorKey: "keroCommissionRate", header: "Kero (%)", cell: (info) => `${info.getValue() * 100}%` },
    { accessorKey: "lagosCommissionRate", header: "Lagos (₦)", cell: (info) => `₦${info.getValue()}` },
    {
      accessorKey: "isActive",
      header: "Active",
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.original.isActive}
          onChange={() => handleToggle(row.original._id)}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button onClick={() => openEditModal(row.original)} className="bg-blue-500 text-white p-2 rounded"><Edit size={16} /></button>
          <button onClick={() => handleDelete(row.original._id)} className="bg-red-500 text-white p-2 rounded"><Trash2 size={16} /></button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: pricing,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => { getPricing(); getVehicleTypes(); }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Pricing Management</h2>
        <button onClick={openAddModal} className="bg-primary-500 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={16}/> Add Pricing
        </button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            type="text"
            placeholder="Search pricing..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded border py-2 pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 border cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{asc: <ChevronUp size={16}/>, desc: <ChevronDown size={16}/>}[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-2">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-bold">{isEditMode ? "Edit Pricing" : "Add Pricing"}</h3>

          <div>
            <label>Vehicle Type</label>
            <select name="vehicleType" value={formData.vehicleType} onChange={handleInputChange} required disabled={isEditMode} className="w-full border rounded px-3 py-2">
              <option value="">Select Vehicle</option>
              {vehicleTypes.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
            </select>
          </div>

          <div>
            <label>Base Fare (₦)</label>
            <input type="number" name="baseFare" value={formData.baseFare} onChange={handleInputChange} className="w-full border rounded px-3 py-2"/>
          </div>

          <div>
            <label>Price per Km (₦)</label>
            <input type="number" name="pricePerKm" value={formData.pricePerKm} onChange={handleInputChange} required className="w-full border rounded px-3 py-2"/>
          </div>

          <div>
            <label>Price per Min (₦)</label>
            <input type="number" name="pricePerMin" value={formData.pricePerMin} onChange={handleInputChange} className="w-full border rounded px-3 py-2"/>
          </div>

          <div>
            <label>Minimum Fare (₦)</label>
            <input type="number" name="minimumFare" value={formData.minimumFare} onChange={handleInputChange} className="w-full border rounded px-3 py-2"/>
          </div>

          <div>
            <label>Kero Commission (%)</label>
            <input type="number" name="keroCommissionRate" value={formData.keroCommissionRate} onChange={handleInputChange} step="0.01" min="0" max="1" className="w-full border rounded px-3 py-2"/>
          </div>

          <div>
            <label>Lagos Commission (₦)</label>
            <input type="number" name="lagosCommissionRate" value={formData.lagosCommissionRate} disabled className="w-full border rounded px-3 py-2 bg-gray-100"/>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary-500 text-white rounded">{isEditMode ? "Update" : "Create"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PricingManagement;
