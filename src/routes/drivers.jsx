import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { User, UserCheck, UserX, FileCheck,  ChevronUp, ChevronDown, Search, Loader2, Star } from "lucide-react";
import Modal from "@/components/modal";
import RideStatCard from "@/components/RideStatCard";
import api from "@/utils/api";

const Drivers = () => {
    const [drivers, setDrivers] = useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]);
	const [sorting, setSorting] = useState([]);
    const [activeTab, setActiveTab] = useState("kycVerified"); // 'kycVerified', 'fullyVerified', 'kycUnverified'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    const getDrivers = async () => {
        const loadingToast = toast.loading("Fetching drivers data...");
        try {
            const response = await api.get("/admin/drivers/");
            setDrivers(response.data.data.drivers);
            filterDrivers(response.data.data.drivers, "kycVerified");
            toast.update(loadingToast, {
                render: "Drivers data loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching drivers data",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    const filterDrivers = (driversList, tab) => {
        if (tab === "fullyVerified") {
            setFilteredDrivers(driversList.filter((driver) => driver.kycVerified && driver.isVerified));
        } else if (tab === "kycVerified") {
            setFilteredDrivers(driversList.filter((driver) => driver.kycVerified && !driver.isVerified));
        } else {
            setFilteredDrivers(driversList.filter((driver) => !driver.kycVerified));
        }
        setActiveTab(tab);
    };

    const handleVerifyDriver = async (status) => {
        setIsLoading(true);
        try {
            await api.put(`/admin/drivers/verify/${selectedDriver._id}`, { status });
            toast.success(`Driver ${status ? "approved" : "rejected"} successfully`);
            getDrivers(); // Refresh the list
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error processing verification");
        } finally {
            setIsLoading(false);
        }
    };

    const openDriverModal = (driver) => {
        setSelectedDriver(driver);
        setIsModalOpen(true);
    };

    // Stats calculation
    const stats = useMemo(() => {
        const total = drivers.length;
        const fullyVerified = drivers.filter((driver) => driver.isVerified && driver.kycVerified).length;
        const kycVerified = drivers.filter((driver) => driver.kycVerified && !driver.isVerified).length;
        const kycUnverified = drivers.filter((driver) => !driver.kycVerified).length;

        return [
            {
                title: "Total Drivers",
                value: total,
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
                title: "Fully Verified",
                value: fullyVerified,
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
                title: "KYC Verified",
                value: kycVerified,
                comparison: "0",
                icon: (
                    <FileCheck
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#3b82f6]",
            },
            {
                title: "KYC Unverified",
                value: kycUnverified,
                comparison: "0",
                icon: (
                    <UserX
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#856833]",
            },
        ];
    }, [drivers]);

    const fullyVerifiedColumns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "S/N",
                cell: ({ row }) => row.index + 1,
				enableSorting: false,
            },
            {
                accessorKey: "vehicle.licensePlate",
                header: "Vehicle No",
            },
            {
                accessorKey: "vehicle.model",
                header: "Vehicle Type",
                cell: (info) => `${info.getValue()} ${info.row.original.vehicle?.year || ""}`,
            },
            {
                accessorKey: "firstname",
                header: "Driver Name",
                cell: (info) => `${info.getValue()} ${info.row.original.lastname || ""}`,
            },
            {
                accessorKey: "email",
                header: "Email Address",
            },
            {
                accessorKey: "phone",
                header: "Phone No",
            },
            {
                accessorKey: "tripsCount",
                header: "No of Trip",
                cell: (info) => info.getValue() || 0,
            },
            {
                accessorKey: "rating",
                header: "Rating",
                cell: (info) => (
                    <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                        {info.getValue() || 0}
                    </div>
                ),
            },
            {
                accessorKey: "earnings",
                header: "Earning",
                cell: (info) => `₦${parseFloat(info.getValue() || 0).toFixed(2)}`,
            },
        ],
        [],
    );

    const kycVerifiedColumns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "S/N",
                cell: ({ row }) => row.index + 1,
				enableSorting: false,
            },
            {
                accessorKey: "vehicle.licensePlate",
                header: "Vehicle No",
            },
            {
                accessorKey: "vehicle.model",
                header: "Vehicle Type",
                cell: (info) => `${info.getValue()} ${info.row.original.vehicle?.year || ""}`,
            },
            {
                accessorKey: "firstname",
                header: "Driver Name",
                cell: (info) => `${info.getValue()} ${info.row.original.lastname || ""}`,
            },
            {
                accessorKey: "email",
                header: "Email Address",
            },
            {
                accessorKey: "phone",
                header: "Phone No",
            },
            {
                accessorKey: "vehicle.inspectionStatus",
                header: "Vehicle Inspection",
                cell: (info) => (
                    <span
                        className={`rounded-full px-2 py-1 text-xs ${
                            info.getValue() === "approved"
                                ? "bg-green-100 text-green-800"
                                : info.getValue() === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                        }`}
                    >
                        {info.getValue() || "Not inspected"}
                    </span>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <button
                        onClick={() => openDriverModal(row.original)}
                        className="rounded-md bg-secondary-500 px-3 py-1 text-white transition hover:bg-secondary-600"
                    >
                        Review
                    </button>
                ),
            },
        ],
        [],
    );

    const kycUnverifiedColumns = useMemo(
        () => [
            {
                accessorKey: "id",
                header: "S/N",
                cell: ({ row }) => row.index + 1,
				enableSorting: false,
            },
            {
                accessorKey: "firstname",
                header: "Driver Name",
                cell: (info) => `${info.getValue()} ${info.row.original.lastname || ""}`,
            },
            {
                accessorKey: "email",
                header: "Email Address",
            },
            {
                accessorKey: "phone",
                header: "Phone No",
            },
            {
                accessorKey: "vehicle.licensePlate",
                header: "Vehicle No",
                cell: (info) => info.getValue() || "Not provided",
            },
            {
                accessorKey: "vehicle.model",
                header: "Vehicle Type",
                cell: (info) => (info.getValue() ? `${info.getValue()} ${info.row.original.vehicle?.year || ""}` : "Not provided"),
            },
            {
                accessorKey: "kycStatus",
                header: "KYC Status",
                cell: () => <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">Not Submitted</span>,
            },
        ],
        [],
    );

    const getColumns = () => {
        switch (activeTab) {
            case "fullyVerified":
                return fullyVerifiedColumns;
            case "kycVerified":
                return kycVerifiedColumns;
            case "kycUnverified":
                return kycUnverifiedColumns;
            default:
                return fullyVerifiedColumns;
        }
    };

    const table = useReactTable({
        data: filteredDrivers,
        columns: getColumns(),
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
        getDrivers();
    }, []);

    const getTabLabel = (tab) => {
        switch (tab) {
            case "fullyVerified":
                return "Fully Verified";
            case "kycVerified":
                return "KYC Verified";
            case "kycUnverified":
                return "KYC Unverified";
            default:
                return tab;
        }
    };

    return (
        <div className="dashboard-content p-3 md:p-4">
            <p className="mb-4 pt-4 text-[24px] font-medium">Drivers</p>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
                {stats.map((stat, index) => (
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
                        {["kycVerified", "fullyVerified", "kycUnverified"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => filterDrivers(drivers, tab)}
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
                            placeholder="Search drivers..."
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
											{flexRender(header.column.columnDef.header, header.getContext())}
											{{
												asc: <ChevronUp className="ml-1 h-4 w-4" />,
												desc: <ChevronDown className="ml-1 h-4 w-4" />,
											}[header.column.getIsSorted()] ?? null}
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

				{filteredDrivers.length === 0 && <p className="p-4 text-center">No {getTabLabel(activeTab).toLowerCase()} drivers found</p>}

				{/* Pagination */}
				<div className="mt-4 flex items-center justify-between">
					<div>
						<span className="text-sm text-gray-700">
							Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{" "}
							<span className="font-medium">{filteredDrivers.length}</span> results
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



            {/* Verification Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                {selectedDriver && (
                    <div className="space-y-6">
                        <h3 className="mb-6 text-center text-xl font-bold">Driver Details</h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Vehicle No</p>
                                    <p className="text-md">{selectedDriver.vehicle?.licensePlate || "N/A"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Vehicle Type</p>
                                    <p className="text-md">
                                        {selectedDriver.vehicle?.model || "N/A"} {selectedDriver.vehicle?.year || ""}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Driver Name</p>
                                    <div className="flex items-center gap-2">
                                        <img
                                            src="/assets/img/user.png"
                                            className="h-6 w-6 rounded-full"
                                            alt="Driver"
                                        />
                                        <p className="text-md">
                                            {selectedDriver.firstname || ""} {selectedDriver.lastname || ""}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Email Address</p>
                                    <p className="text-md">{selectedDriver.email || "N/A"}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Phone Number</p>
                                    <p className="text-md">{selectedDriver.phone || "N/A"}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">No of Trip</p>
                                    <p className="text-md">{selectedDriver.tripsCount || 0}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Ratings</p>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-5 w-5 text-yellow-500" />
                                        <p className="text-md">{selectedDriver.rating || 0}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Earning</p>
                                    <p className="text-md">₦{parseFloat(selectedDriver.earnings || 0).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm">Driver's License</p>
                            {selectedDriver.vehicle?.driverLicense ? (
                                <a
                                    href={selectedDriver.vehicle.driverLicense}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View Image
                                </a>
                            ) : (
                                <p className="text-md">N/A</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <p className="text-sm">Hackney Permit</p>
                            {selectedDriver.vehicle?.hackneyPermit ? (
                                <a
                                    href={selectedDriver.vehicle.hackneyPermit}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View Image
                                </a>
                            ) : (
                                <p className="text-md">N/A</p>
                            )}
                        </div>

                        {activeTab === "kycVerified" && (
                            <div className="flex justify-center space-x-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => handleVerifyDriver(false)}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 rounded-md bg-red-500 px-6 py-2 text-white transition hover:bg-red-600 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2
                                            className="animate-spin"
                                            size={18}
                                        />
                                    ) : null}
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleVerifyDriver(true)}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 rounded-md bg-green-500 px-6 py-2 text-white transition hover:bg-green-600 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2
                                            className="animate-spin"
                                            size={18}
                                        />
                                    ) : null}
                                    Approve
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Drivers;
