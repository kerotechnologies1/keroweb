import React from "react";

const RideStatCard = ({ title, value, comparison, icon, iconBgColor }) => (
    <div className="rounded-lg border bg-white p-6 pb-7">
        <div className="flex items-center">
            <div className={`h-5 w-5 rounded-full ${iconBgColor} mr-2 flex items-center justify-center`}>{icon}</div>
            <p className="text-xs text-[#c2c2c2]">{title}</p>
        </div>
        <p className="mt-5 text-3xl font-medium">{value}</p>
        <p className="mt-1 text-xs text-[#c2c2c2]">
            vs last 24hrs: <span className="text-sm text-[#353535]">{comparison}</span>
        </p>
    </div>
);

export default RideStatCard;
