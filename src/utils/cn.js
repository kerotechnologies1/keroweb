import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Currency formatting utility function
export const formatCurrency = (amount) => {
    const formattedAmount = (parseFloat(amount || 0) / 100).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `₦${formattedAmount}`;
};