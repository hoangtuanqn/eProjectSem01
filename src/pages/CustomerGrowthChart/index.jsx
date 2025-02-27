import React from "react";
import CustomerGrowthChart from "./CustomerGrowthChart";
import Breadcrumb from "~/components/Breadcrumb";
import useTitle from "~/hooks/useTitle";
export default function Index() {
    useTitle("Customer Growth Chart");
    const breadcrumbItems = [
        { label: "Home", url: "/" },
        { label: "Customer Growth Chart", url: "/pages/customer-growth-chart" },
    ];
    return (
        <>
            <main className="main">
                <Breadcrumb title="" items={breadcrumbItems} style={{alignItems: "flex-start"}} />
                <CustomerGrowthChart />
            </main>
        </>
    );
}
