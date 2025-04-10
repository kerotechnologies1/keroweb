export const getTableStyles = (theme) => ({
    table: {
        style: {
            backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#1e293b",
        },
    },
    head: {
        style: {
            backgroundColor: theme === "dark" ? "#0f172a" : "#f1f5f9",
            color: theme === "dark" ? "#ffffff" : "#1e293b",
            fontSize: "14px",
            fontWeight: 600,
        },
    },
    headRow: {
        style: {
            minHeight: "40px",
            backgroundColor: theme === "dark" ? "#0f172a" : "#f1f5f9",
            borderBottomWidth: "1px",
            borderBottomColor: theme === "dark" ? "#334155" : "#e2e8f0",
        },
    },
    headCells: {
        style: {
            paddingLeft: "16px",
            paddingRight: "16px",
        },
    },
    cells: {
        style: {
            paddingLeft: "16px",
            paddingRight: "16px",
        },
    },
    rows: {
        style: {
            backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#1e293b",
            fontSize: "14px",
            minHeight: "48px",
            "&:not(:last-of-type)": {
                borderBottomColor: theme === "dark" ? "#334155" : "#e2e8f0",
            },
            "&:hover": {
                backgroundColor: theme === "dark" ? "#334155" : "#f8fafc",
            },
        },
        stripedStyle: {
            backgroundColor: theme === "dark" ? "#0f172a" : "#f8fafc",
        },
    },
    pagination: {
        style: {
            backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
            color: theme === "dark" ? "#ffffff" : "#1e293b",
            borderTopColor: theme === "dark" ? "#334155" : "#e2e8f0",
        },
        pageButtonsStyle: {
            color: theme === "dark" ? "#ffffff" : "#1e293b",
            fill: theme === "dark" ? "#ffffff" : "#1e293b",
            "&:disabled": {
                color: theme === "dark" ? "#64748b" : "#94a3b8",
            },
            "&:hover:not(:disabled)": {
                backgroundColor: theme === "dark" ? "#334155" : "#e2e8f0",
            },
        },
    },
});
