const StatCard = ({ title, value, comparison, icon, iconBgColor }) => (
    <div className="h-full rounded-lg bg-white p-[30px] shadow-sm">
        <div className="flex items-center">
            {icon && <div className={`h-10 w-10 rounded-full ${iconBgColor} mr-2 flex items-center justify-center`}>{icon}</div>}
            <p className="text-sm">{title}</p>
        </div>
        <p className="my-3 text-4xl font-medium">{value}</p>
        <p className="mt-1 text-xs text-[#c2c2c2]">
            vs last 24hrs: <span className="text-sm text-[#353535]">{comparison}</span>
        </p>
    </div>
);

export default StatCard;
