import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { flexRender, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { User, UserCheck, UserX, FileCheck, ChevronUp, ChevronDown, Search, Loader2, Star, Mail } from "lucide-react";
import Modal from "@/components/modal";
import RideStatCard from "@/components/RideStatCard";
import api from "@/utils/api";

const Drivers = ({ showReview = true, showWalletBalance = true }) => {
    const [drivers, setDrivers] = useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [activeTab, setActiveTab] = useState("emailUnverified"); // 'emailUnverified', 'emailVerified', 'kycSubmitted', 'kycApproved'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    const getDrivers = async () => {
        const loadingToast = toast.loading("Fetching drivers data...");
        try {
            const response = await api.get("/admin/drivers/");
            // console.log(response.data.data);
            setDrivers(response.data.data.drivers);
            filterDrivers(response.data.data.drivers, "emailUnverified");
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
        if (tab === "emailUnverified") {
            // Not email verified
            setFilteredDrivers(driversList.filter((driver) => !driver.isVerified));
        } else if (tab === "emailVerified") {
            // Email verified but KYC not submitted
            setFilteredDrivers(driversList.filter((driver) => driver.isVerified && !driver.kycSubmitted));
        } else if (tab === "kycSubmitted") {
            // Email verified, KYC submitted but not approved
            setFilteredDrivers(driversList.filter((driver) => driver.isVerified && driver.kycSubmitted && !driver.kycVerified));
        } else if (tab === "kycApproved") {
            // All steps completed: email verified, KYC submitted and approved
            setFilteredDrivers(driversList.filter((driver) => driver.isVerified && driver.kycSubmitted && driver.kycVerified));
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

    const handleUnverifyDriver = async (driverId) => {
        setIsLoading(true);
        try {
            await api.put(`/admin/drivers/unverify/${driverId}`);
            toast.success("Driver unapproved successfully");
            getDrivers(); // Refresh the list
            setIsModalOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error unapproving driver");
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
        const emailUnverified = drivers.filter((driver) => !driver.isVerified).length;
        const emailVerified = drivers.filter((driver) => driver.isVerified && !driver.kycSubmitted).length;
        const kycSubmitted = drivers.filter((driver) => driver.isVerified && driver.kycSubmitted && !driver.kycVerified).length;
        const kycApproved = drivers.filter((driver) => driver.isVerified && driver.kycSubmitted && driver.kycVerified).length;

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
                title: "Email Unverified",
                value: emailUnverified,
                comparison: "0",
                icon: (
                    <UserX
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#dc2626]",
            },
            {
                title: "Email Verified",
                value: emailVerified,
                comparison: "0",
                icon: (
                    <Mail
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#f59e0b]",
            },
            {
                title: "KYC Submitted",
                value: kycSubmitted,
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
                title: "KYC Approved",
                value: kycApproved,
                comparison: "0",
                icon: (
                    <UserCheck
                        size={16}
                        color="white"
                    />
                ),
                iconBgColor: "bg-[#258D3F]",
            },
        ];
    }, [drivers]);

    const emailUnverifiedColumns = useMemo(
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
                accessorKey: "createdAt",
                header: "Registration Date",
                cell: (info) => new Date(info.getValue()).toLocaleDateString(),
            },
            {
                accessorKey: "isVerified",
                header: "Status",
                cell: () => <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">Email Unverified</span>,
            },
        ],
        [],
    );

    const emailVerifiedColumns = useMemo(
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
                accessorKey: "kycSubmitted",
                header: "KYC Status",
                cell: () => <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-800">Not Submitted</span>,
            },
        ],
        [],
    );

    const kycSubmittedColumns = useMemo(
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
                cell: (info) => `${info.getValue() || "N/A"} ${info.row.original.vehicle?.year || ""}`,
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
                accessorKey: "kycVerified",
                header: "KYC Status",
                cell: () => <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">On Review</span>,
            },
            ...(showReview
                ? [
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
                  ]
                : []),
        ],
        [showReview],
    );

    const kycApprovedColumns = useMemo(
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
                cell: (info) => `${info.getValue() || "N/A"} ${info.row.original.vehicle?.year || ""}`,
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
            ...(showWalletBalance
                ? [
                      {
                          accessorKey: "walletBalance",
                          header: "Wallet Balance",
                          cell: (info) => `₦${parseFloat(info.getValue() || 0).toFixed(2)}`,
                      },
                  ]
                : []),
            ...(showReview
                ? [
                      {
                          id: "actions",
                          header: "Actions",
                          cell: ({ row }) => (
                              <button
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm("Are you sure you want to unapprove this driver?")) {
                                          handleUnverifyDriver(row.original._id);
                                      }
                                  }}
                                  className="rounded-md bg-red-500 px-3 py-1 text-white transition hover:bg-red-600"
                              >
                                  Unapprove
                              </button>
                          ),
                      },
                  ]
                : []),
        ],
        [showWalletBalance, showReview],
    );

    const getColumns = () => {
        switch (activeTab) {
            case "emailUnverified":
                return emailUnverifiedColumns;
            case "emailVerified":
                return emailVerifiedColumns;
            case "kycSubmitted":
                return kycSubmittedColumns;
            case "kycApproved":
                return kycApprovedColumns;
            default:
                return emailUnverifiedColumns;
        }
    };

    const table = useReactTable({
        data: filteredDrivers,
        columns: getColumns(),
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
                pageSize: 25,
            },
        },
    });

    useEffect(() => {
        getDrivers();
    }, []);

    const getTabLabel = (tab) => {
        switch (tab) {
            case "emailUnverified":
                return "Email Unverified";
            case "emailVerified":
                return "Email Verified";
            case "kycSubmitted":
                return "KYC Submitted";
            case "kycApproved":
                return "KYC Approved";
            default:
                return tab;
        }
    };

    return (
        <div className="dashboard-content p-3 md:p-4">
            <p className="mb-4 pt-4 text-[24px] font-medium">Drivers</p>

            {/* Stats Cards */}
            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-5">
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
                        {["emailUnverified", "emailVerified", "kycSubmitted", "kycApproved"].map((tab) => (
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
                    style={{ maxHeight: "calc(100vh - 100px)" }}
                >
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            onClick={header.column.getToggleSortingHandler()}
                                            style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
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
                                    className={`hover:bg-gray-50 ${
                                        activeTab === "emailUnverified" || activeTab === "emailVerified" || activeTab === "kycApproved"
                                            ? "cursor-pointer"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        // Only open modal on row click for non-review tabs
                                        if (activeTab === "emailUnverified" || activeTab === "emailVerified" || activeTab === "kycApproved") {
                                            openDriverModal(row.original);
                                        }
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
                                            onClick={(e) => {
                                                // Prevent row click when clicking action buttons
                                                if (cell.column.id === "actions") {
                                                    e.stopPropagation();
                                                }
                                            }}
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
                        <span className="text-sm text-gray-700 dark:text-white">
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

                                {showWalletBalance && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm">Wallet Balance</p>
                                        <p className="text-md">₦{parseFloat(selectedDriver.walletBalance || 0).toFixed(2)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Only show document links if driver has submitted KYC */}
                        {selectedDriver.kycSubmitted && (
                            <>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm">Driver&apos;s License</p>
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
                            </>
                        )}

                        {/* Show review buttons only for KYC submitted drivers when showReview is true */}
                        {showReview && activeTab === "kycSubmitted" && (
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

                        {/* Show unapprove button for approved drivers when showReview is true */}
                        {showReview && activeTab === "kycApproved" && (
                            <div className="flex justify-center pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to unapprove this driver?")) {
                                            handleUnverifyDriver(selectedDriver._id);
                                        }
                                    }}
                                    disabled={isLoading}
                                    className="flex items-center gap-2 rounded-md bg-red-500 px-6 py-2 text-white transition hover:bg-red-600 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2
                                            className="animate-spin"
                                            size={18}
                                        />
                                    ) : null}
                                    Unapprove Driver
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};
Drivers.propTypes = {
    showReview: PropTypes.bool,
    showWalletBalance: PropTypes.bool,
};

export default Drivers;
