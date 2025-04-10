import React from "react";
import images from "../assets/images";

const LocationStat = ({ city, driverCount, percentage }) => (
    <div className="flex items-center justify-between gap-5">
        <div className="flex flex-grow items-center gap-2">
            <img src={images.nigeriaFlag} />
            <div className="flex-grow">
                <p className="mb-1 text-sm font-medium">{city}</p>
                <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                        className="h-2 rounded-full bg-secondary-500"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
        <p className="text-sm font-medium">{driverCount} drivers</p>
    </div>
);

export default LocationStat;
