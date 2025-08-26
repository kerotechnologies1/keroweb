import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Car, Check, Clock, X } from "lucide-react";
import StatCard from "@/components/StatCard";
import RideStatCard from "@/components/RideStatCard";
// import LocationStat from "@/components/LocationStat";
import api from "@/utils/api";

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState({
        drivers: {
            approved: 0,
            unapproved: 0,
            joinedThisWeek: 0,
        },
        rides: {
            total: 0,
            completed: 0,
            active: 0,
            pending: 0,
            canceled: 0,
        },
        weeklyRides: {
            total: 0,
            completed: 0,
            active: 0,
            canceled: 0,
        },
    });

    const getDashboardData = async () => {
        const loadingToast = toast.loading("Fetching dashboard data...");
        try {
            const response = await api.get("/admin/dashboard");
            // console.log(response.data);
            setDashboardData(response.data.data);
            toast.update(loadingToast, {
                render: "Dashboard data loaded",
                type: "success",
                isLoading: false,
                autoClose: 2000,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching dashboard data",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        }
    };

    useEffect(() => {
        getDashboardData();
    }, []);

    const statsData = [
        { title: "Approved Drivers", value: dashboardData.drivers.approved.toString(), comparison: "0" },
        { title: "Unapproved Drivers", value: dashboardData.drivers.unapproved.toString(), comparison: "0" },
        { title: "Active Drivers", value: dashboardData.drivers.approved.toString(), comparison: "0" },
        { title: "New Drivers This Week", value: dashboardData.drivers.joinedThisWeek.toString(), comparison: "0" },
    ];

    // Data for ride statistics
    const rideStatsData = [
        {
            title: "Total Rides",
            value: dashboardData.rides.total.toString(),
            comparison: "0",
            icon: (
                <Car
                    size={12}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#605D55]",
        },
        {
            title: "Completed Rides",
            value: dashboardData.rides.completed.toString(),
            comparison: "0",
            icon: (
                <Check
                    size={12}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#258D3F]",
        },
        {
            title: "Active Rides",
            value: dashboardData.rides.active.toString(),
            comparison: "0",
            icon: (
                <Clock
                    size={12}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#856833]",
        },
        {
            title: "Canceled Rides",
            value: dashboardData.rides.canceled.toString(),
            comparison: "0",
            icon: (
                <X
                    size={12}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#8C0000]",
        },
    ];

    // Data for weekly ride statistics
    const weeklyRideStatsData = [
        {
            title: "Total This Week",
            value: dashboardData.weeklyRides.total.toString(),
            comparison: "0",
            icon: (
                <Car
                    size={12}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#605D55]",
        },
        {
            title: "Completed This Week",
            value: dashboardData.weeklyRides.completed.toString(),
            comparison: "0",
            icon: (
                <Check
                    size={12}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#258D3F]",
        },
        {
            title: "Active This Week",
            value: dashboardData.weeklyRides.active.toString(),
            comparison: "0",
            icon: (
                <Clock
                    size={12}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#856833]",
        },
        {
            title: "Canceled This Week",
            value: dashboardData.weeklyRides.canceled.toString(),
            comparison: "0",
            icon: (
                <X
                    size={12}
                    color="white"
                />
            ),
            iconBgColor: "bg-[#8C0000]",
        },
    ];

    // Commented out driver locations data
    // const locationsData = [
    //     { city: "Ibadan", drivers: "100", percentage: 25 },
    //     { city: "Lagos", drivers: "100", percentage: 25 },
    //     { city: "Abeokuta", drivers: "100", percentage: 25 },
    //     { city: "Ilorin", drivers: "100", percentage: 25 },
    // ];

    return (
        <div className="dashboard-content p-3 md:p-4">
            <p className="mb-4 pt-4 text-[24px] font-medium">Dashboard</p>

            {/* Driver Statistics Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
                {statsData.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        comparison={stat.comparison}
                    />
                ))}
            </div>

            {/* Ride Statistics Section */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Ride Statistics */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-xl">Ride Statistics</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {rideStatsData.map((stat, index) => (
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
                </div>

                {/* This Week Statistics */}
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-xl">This Week Statistics</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {weeklyRideStatsData.map((stat, index) => (
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
                </div>
            </div>

            {/* Commented out Driver Statistics section */}
            {/* 
            <div className="mt-8">
                <div className="rounded-lg bg-white p-6 shadow-sm">
                    <p className="mb-6 text-lg">Driver Statistics</p>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl">{dashboardData.drivers.approved + dashboardData.drivers.unapproved}</p>
                            <p className="text-sm">{dashboardData.drivers.joinedThisWeek} drivers added this week</p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        {locationsData.map((location, index) => (
                            <LocationStat
                                key={index}
                                city={location.city}
                                driverCount={location.drivers}
                                percentage={location.percentage}
                            />
                        ))}
                    </div>
                </div>
            </div>
            */}
        </div>
    );
};

export default Dashboard;
