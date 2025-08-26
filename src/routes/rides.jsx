import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { CheckCircle, Clock, XCircle, Search, MapPin, ChevronUp, ChevronDown, Navigation } from "lucide-react";
import Modal from "@/components/modal";
import RideStatCard from "@/components/RideStatCard";
import api from "@/utils/api";
import RideMap from "@/components/RideMap";
import { formatCurrency } from "@/utils/cn";

const Rides = ({ showKeroCommission = true, showLagosCommission = true, showFare = true, showRideId = true }) => {
    const [rides, setRides] = useState([]);
    const [filteredRides, setFilteredRides] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [activeTab, setActiveTab] = useState("all"); // 'all', 'completed', 'pending', 'cancelled'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
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

    const openMapModal = (ride) => {
        setSelectedRide(ride);
        setIsMapModalOpen(true);
    };

    // Stats cards
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

    // Table Columns
    const columns = useMemo(() => {
        const baseColumns = [
            {
                accessorKey: "id",
                header: "S/N",
                cell: ({ row }) => row.index + 1,
                enableSorting: false,
            },
        ];

        if (showRideId) {
            baseColumns.push({
                accessorKey: "rideId",
                header: "Ride ID",
                cell: (info) => info.getValue().slice(0, 8) + "...",
            });
        }

        baseColumns.push(
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
        );

        if (showFare) {
            baseColumns.push({
                accessorKey: "fare",
                header: "Fare (₦)",
                cell: (info) => formatCurrency(info.getValue() || 0),
            });
        }

        if (showKeroCommission) {
            baseColumns.push({
                accessorKey: "keroCommission",
                header: "Kero Commission (₦)",
                cell: (info) => formatCurrency(info.getValue() || 0),
            });
        }

        if (showLagosCommission) {
            baseColumns.push({
                accessorKey: "lagosCommission",
                header: "Lagos Commission (₦)",
                cell: (info) => formatCurrency(info.getValue() || 0),
            });
        }

        baseColumns.push({
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
        });

        return baseColumns;
    }, [showRideId, showFare, showKeroCommission, showLagosCommission]);

    const table = useReactTable({
        data: filteredRides,
        columns,
        state: { globalFilter, sorting },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 25 },
        },
    });

    useEffect(() => {
        getRides();
    }, []);

    return (
        <div className="dashboard-content p-3 md:p-4">
            <p className="mb-4 pt-4 text-[24px] font-medium">Rides Management</p>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
                {statsCards.map((stat, index) => (
                    <RideStatCard
                        key={index}
                        {...stat}
                    />
                ))}
            </div>

            {/* Table */}
            <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex space-x-2">
                        {["all", "completed", "pending", "cancelled"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => filterRides(rides, tab)}
                                className={`rounded-md px-4 py-2 ${activeTab === tab ? "bg-primary-500 text-white" : "bg-gray-200"}`}
                            >
                                {tab === "all" ? "All Rides" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
                    style={{ maxHeight: "calc(100vh - 100px)" }}
                >
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-gray-50">
                            {table.getHeaderGroups().map((hg) => (
                                <tr key={hg.id}>
                                    {hg.headers.map((header) => (
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
                                    className="cursor-pointer hover:bg-gray-50"
                                    onClick={() => openRideModal(row.original)}
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
                                {/* Driver Selfie */}
                                {selectedRide.driverSelfie && (
                                    <div className="flex flex-col items-center space-y-2">
                                        <img
                                            src={selectedRide.driverSelfie}
                                            alt="Driver Selfie"
                                            className="h-20 w-20 rounded-full border-2 border-gray-300 object-cover"
                                        />
                                    </div>
                                )}

                                {showRideId && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Ride ID</p>
                                        <p className="text-md font-mono">{selectedRide.rideId}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Driver</p>
                                    <p className="text-md">{selectedRide.driverName || "N/A"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Rider</p>
                                    <p className="text-md">{selectedRide.riderName || "N/A"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Start Location</p>
                                    <p className="text-md">{selectedRide.startAddress || "N/A"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">End Location</p>
                                    <p className="text-md">{selectedRide.endAddress || "N/A"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Distance</p>
                                    <div className="flex items-center gap-1">
                                        <Navigation className="h-4 w-4 text-gray-500" />
                                        <p className="text-md">{selectedRide.distance.toLocaleString()} meters</p>
                                    </div>
                                </div>

                                {showFare && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Fare</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-md">{formatCurrency(selectedRide.fare)}</p>
                                        </div>
                                    </div>
                                )}

                                {showKeroCommission && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Kero Commission</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-md">{formatCurrency(selectedRide.keroCommission || 0)}</p>
                                        </div>
                                    </div>
                                )}

                                {showLagosCommission && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Lagos Commission</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-md">{formatCurrency(selectedRide.lagosCommission || 0)}</p>
                                        </div>
                                    </div>
                                )}

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

                                {selectedRide.rating && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Rating</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-md">{selectedRide.rating}/5 ⭐</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-4 text-center">
                            <h4 className="mb-2 font-medium">Additional Information</h4>
                            <p className="text-sm text-gray-600">
                                {selectedRide.status === "completed"
                                    ? "This ride was successfully completed."
                                    : selectedRide.status === "pending"
                                      ? "This ride is currently pending assignment or in progress."
                                      : "This ride was cancelled or rejected."}
                            </p>
                            <div className="flex justify-center pt-4">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        openMapModal(selectedRide);
                                    }}
                                    className="rounded-md bg-primary-500 px-4 py-2 text-white hover:bg-primary-800"
                                >
                                    View Ride on Map
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Map Modal */}
            <Modal
                isOpen={isMapModalOpen}
                onClose={() => {
                    setIsMapModalOpen(false);
                    setIsModalOpen(true);
                }}
                size="xl"
            >
                {selectedRide && (
                    <div className="h-[500px]">
                        <h3 className="mb-4 text-center text-xl font-bold">Ride Path</h3>
                        <RideMap
                            startLocation={selectedRide.startLocation}
                            endLocation={selectedRide.endLocation}
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Rides;
