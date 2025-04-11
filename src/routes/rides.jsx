import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { CheckCircle, Clock, XCircle, Search, MapPin, ChevronUp, ChevronDown, DollarSign, Navigation } from "lucide-react";
import Modal from "@/components/modal";
import RideStatCard from "@/components/RideStatCard";
import api from "@/utils/api";

const Rides = () => {
    const [rides, setRides] = useState([]);
    const [filteredRides, setFilteredRides] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [activeTab, setActiveTab] = useState("all"); // 'all', 'completed', 'pending', 'cancelled'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRide, setSelectedRide] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [stats, setStats] = useState({
        totalTrips: 0,
        completedTrips: 0,
        runningTrips: 0,
        canceledTrips: 0,
    });

    const getRides = async () => {
        const loadingToast = toast.loading("Fetching rides data...");
        try {
            const response = await api.get("/admin/get-all-trips");
            console.log(response.data)
            setRides(response.data.trips);
            setStats({
                totalTrips: response.data.totalTrips,
                completedTrips: response.data.completedTrips,
                runningTrips: response.data.runningTrips,
                canceledTrips: response.data.canceledTrips,
            });
            filterRides(response.data.trips, "all");
            toast.update(loadingToast, {
                render: "Rides data loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching rides data",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    const filterRides = (ridesList, tab) => {
        if (tab === "all") {
            setFilteredRides(ridesList);
        } else {
            setFilteredRides(ridesList.filter((ride) => ride.status === tab));
        }
        setActiveTab(tab);
    };

    const openRideModal = (ride) => {
        setSelectedRide(ride);
        setIsModalOpen(true);
    };

    // Stats cards data
    const statsCards = useMemo(
        () => [
            {
                title: "Total Rides",
                value: stats.totalTrips,
                comparison: "0",
                icon: (
                    <MapPin
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#605D55]",
            },
            {
                title: "Completed Rides",
                value: stats.completedTrips,
                comparison: "0",
                icon: (
                    <CheckCircle
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#258D3F]",
            },
            {
                title: "Pending Rides",
                value: rides.filter((ride) => ride.status === "pending").length,
                comparison: "0",
                icon: (
                    <Clock
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#856833]",
            },
            {
                title: "Cancelled Rides",
                value: stats.canceledTrips,
                comparison: "0",
                icon: (
                    <XCircle
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#dc2626]",
            },
        ],
        [rides, stats],
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "S/N",
                cell: ({ row }) => row.index + 1,
                enableSorting: false, // Disable sorting for this column
            },
            {
                accessorKey: "rideId",
                header: "Ride ID",
                cell: (info) => info.getValue().slice(0, 8) + "...",
            },
            {
                accessorKey: "driverName",
                header: "Driver",
                cell: (info) => info.getValue() || "N/A",
            },
            {
                accessorKey: "riderName",
                header: "Rider",
                cell: (info) => info.getValue() || "N/A",
            },
            {
                accessorKey: "distance",
                header: "Distance (m)",
                cell: (info) => info.getValue().toLocaleString(),
            },
            {
                accessorKey: "fare",
                header: "Fare (₦)",
                cell: (info) => `₦${parseFloat(info.getValue()).toFixed(2)}`,
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: (info) => {
                    const status = info.getValue();
                    let bgColor, textColor;

                    switch (status) {
                        case "completed":
                            bgColor = "bg-green-100";
                            textColor = "text-green-800";
                            break;
                        case "pending":
                            bgColor = "bg-yellow-100";
                            textColor = "text-yellow-800";
                            break;
                        case "cancelled":
                        case "rejected":
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
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <button
                        onClick={() => openRideModal(row.original)}
                        className="rounded-md bg-secondary-500 px-3 py-1 text-white transition hover:bg-secondary-600"
                    >
                        Details
                    </button>
                ),
                enableSorting: false, // Disable sorting for this column
            },
        ],
        [],
    );

    const table = useReactTable({
        data: filteredRides,
        columns,
        state: {
            globalFilter,
            sorting, // Add sorting state
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting, // Add sorting change handler
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(), // Add sorted row model
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 25,
            },
        },
    });

    useEffect(() => {
        getRides();
    }, []);

    const getTabLabel = (tab) => {
        switch (tab) {
            case "all":
                return "All Rides";
            case "completed":
                return "Completed";
            case "pending":
                return "Pending";
            case "cancelled":
                return "Cancelled";
            default:
                return tab;
        }
    };

    return (
        <div className="dashboard-content p-3 md:p-4">
            <p className="mb-4 pt-4 text-[24px] font-medium">Rides Management</p>

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
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                        {["all", "completed", "pending", "cancelled"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => filterRides(rides, tab)}
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
                            placeholder="Search rides..."
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
                                            onClick={header.column.getToggleSortingHandler()} // Add click handler
                                            style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }} // Change cursor if sortable
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

                {filteredRides.length === 0 && <p className="p-4 text-center">No {getTabLabel(activeTab).toLowerCase()} found</p>}

                {/* Pagination */}
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <span className="text-sm text-gray-700">
                            Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{" "}
                            <span className="font-medium">{filteredRides.length}</span> results
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

            {/* Ride Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedRide && (
                    <div className="space-y-6">
                        <h3 className="mb-6 text-center text-xl font-bold">Ride Details</h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Ride ID</p>
                                    <p className="text-md font-mono">{selectedRide.rideId}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Driver</p>
                                    <p className="text-md">{selectedRide.driverName || "N/A"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Rider</p>
                                    <p className="text-md">{selectedRide.riderName || "N/A"}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Distance</p>
                                    <div className="flex items-center gap-1">
                                        <Navigation className="h-4 w-4 text-gray-500" />
                                        <p className="text-md">{selectedRide.distance.toLocaleString()} meters</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Fare</p>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-4 w-4 text-gray-500" />
                                        <p className="text-md">₦{parseFloat(selectedRide.fare).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Status</p>
                                    <span
                                        className={`rounded-full px-2 py-1 text-xs ${
                                            selectedRide.status === "completed"
                                                ? "bg-green-100 text-green-800"
                                                : selectedRide.status === "pending"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {selectedRide.status.charAt(0).toUpperCase() + selectedRide.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="mb-2 font-medium">Additional Information</h4>
                            <p className="text-sm text-gray-600">
                                {selectedRide.status === "completed"
                                    ? "This ride was successfully completed."
                                    : selectedRide.status === "pending"
                                      ? "This ride is currently pending assignment or in progress."
                                      : "This ride was cancelled or rejected."}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Rides;
