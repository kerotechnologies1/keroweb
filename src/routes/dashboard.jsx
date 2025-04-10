import { useState } from "react";
import { Car, Check, Clock, X } from "lucide-react";
import StatCard from "@/components/StatCard";
import RideStatCard from "@/components/RideStatCard";
import LocationStat from "@/components/LocationStat";

const Dashboard = () => {
    const [totalDrivers, setTotalDrivers] = useState(100);
    const [weeklyAdded, setWeeklyAdded] = useState(20);

    const statsData = [
        { title: "Approved Driver", value: "3", comparison: "0" },
        { title: "Unapproved Driver", value: "99", comparison: "0" },
        { title: "Active Driver", value: "0", comparison: "0" },
        { title: "Earnings Driver", value: "₦0.00", comparison: "₦0.00" },
    ];

    // Data for ride statistics
    const rideStatsData = [
        {
            title: "Total Ride",
            value: "0",
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
            title: "Completed Ride",
            value: "0",
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
            title: "Running Ride",
            value: "0",
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
            title: "Canceled Ride",
            value: "0",
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

    // Data for driver locations
    const locationsData = [
        { city: "Ibadan", drivers: "100", percentage: 25 },
        { city: "Lagos", drivers: "100", percentage: 25 },
        { city: "Abeokuta", drivers: "100", percentage: 25 },
        { city: "Ilorin", drivers: "100", percentage: 25 },
    ];

    return (
        <div className="dashboard-content p-3 md:p-4">
            <p className="mb-4 pt-4 text-[24px] font-medium">Dashboard</p>

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

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-7">
                <div className="md:col-span-7 lg:col-span-4">
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
                </div>
                <div className="md:col-span-7 lg:col-span-3">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <p className="mb-6 text-lg">Driver Statistics</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-3xl">{totalDrivers}</p>
                                <p className="text-sm">{weeklyAdded} drivers added this week</p>
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
            </div>
        </div>
    );
};

export default Dashboard;
