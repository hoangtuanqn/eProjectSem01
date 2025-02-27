import React from "react";
import {
    ComposedChart,
    Line,
    Area,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import "~/styles/customerGrowthChart.css";
import data from "~/data/customerGrowthChart.json";

export default function CustomerGrowthChart() {
    return (
        <section className="chart-section">
            <div className="container">
                <div className="chart-container">
                    <h2 className="chart-title">Customer Growth Analysis</h2>
                    <p className="chart-description">
                        Comprehensive view of our customer base growth and acquisition metrics
                    </p>

                    <div className="chart-overview">
                        <div className="overview-content">
                            <h3>Our Growth Story</h3>
                            <p>
                                Since our establishment in 2018, we've demonstrated consistent and remarkable growth in
                                our customer base, reflecting our commitment to excellence and customer satisfaction:
                            </p>

                            <div className="highlight-points">
                                <div className="highlight-item">
                                    <span className="highlight-icon">📈</span>
                                    <p>
                                        <strong>Exceptional Growth:</strong> From 1,200 customers in 2018 to over 12,000
                                        in 2024, representing a remarkable 900% increase.
                                    </p>
                                </div>

                                <div className="highlight-item">
                                    <span className="highlight-icon">🎯</span>
                                    <p>
                                        <strong>Consistent Acquisition:</strong> Successfully onboarding an average of
                                        1,800+ new customers annually, with peak acquisition of 2,600 customers in 2022.
                                    </p>
                                </div>

                                <div className="highlight-item">
                                    <span className="highlight-icon">💪</span>
                                    <p>
                                        <strong>Sustainable Growth:</strong> Maintaining a healthy average growth rate
                                        of 48.8% year-over-year, demonstrating our market stability and customer
                                        retention strength.
                                    </p>
                                </div>

                                <div className="highlight-item">
                                    <span className="highlight-icon">🤝</span>
                                    <p>
                                        <strong>Customer Trust:</strong> Our expanding customer base reflects the trust
                                        and satisfaction of businesses who choose us as their preferred partner.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="chart-wrapper">
                        <ResponsiveContainer width="100%" height={window.innerWidth <= 768 ? 300 : 500}>
                            <ComposedChart
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 20,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" tick={{ fill: "#333333" }} tickLine={{ stroke: "#333333" }} />
                                <YAxis
                                    yAxisId="left"
                                    tick={{ fill: "#333333" }}
                                    tickLine={{ stroke: "#333333" }}
                                    label={{
                                        value: "Number of Customers",
                                        angle: -90,
                                        position: "insideLeft",
                                        style: { fill: "#333333" },
                                    }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fill: "#333333" }}
                                    tickLine={{ stroke: "#333333" }}
                                    label={{
                                        value: "Growth Rate (%)",
                                        angle: 90,
                                        position: "insideRight",
                                        style: { fill: "#333333" },
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #333333",
                                        borderRadius: "4px",
                                    }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="totalCustomers"
                                    name="Total Customers"
                                    fill="#8884d8"
                                    stroke="#8884d8"
                                    fillOpacity={0.3}
                                    yAxisId="left"
                                />
                                <Bar dataKey="newCustomers" name="New Customers" fill="#82ca9d" yAxisId="left" />
                                <Line
                                    type="monotone"
                                    dataKey="growthRate"
                                    name="Growth Rate (%)"
                                    stroke="#ff7300"
                                    strokeWidth={2}
                                    dot={{ fill: "#ff7300", strokeWidth: 2 }}
                                    yAxisId="right"
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-stats">
                        <div className="stat-item">
                            <h3>Total Customers</h3>
                            <p>12,000+</p>
                            <span className="stat-subtitle">Current customer base</span>
                        </div>
                        <div className="stat-item">
                            <h3>Total Growth</h3>
                            <p>900%</p>
                            <span className="stat-subtitle">Since 2018</span>
                        </div>
                        <div className="stat-item">
                            <h3>New Customers</h3>
                            <p>2,400</p>
                            <span className="stat-subtitle">Added in 2024</span>
                        </div>
                        <div className="stat-item">
                            <h3>Average Growth</h3>
                            <p>48.8%</p>
                            <span className="stat-subtitle">Per year</span>
                        </div>
                    </div>

                    <div className="chart-conclusion">
                        <h3>Looking Forward</h3>
                        <p>
                            Our consistent growth trajectory and strong customer relationships position us well for
                            future expansion. We remain committed to:
                        </p>
                        <ul>
                            <li>Maintaining our high standards of service excellence</li>
                            <li>Innovating our solutions to meet evolving customer needs</li>
                            <li>Building lasting partnerships with our growing customer base</li>
                            <li>Expanding our market presence while ensuring quality service delivery</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
