import React, { useState } from "react";
import CountUp from "react-countup";
import jobListings from "~/data/jobListings.json";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Briefcase, Plus, Minus } from "lucide-react";
import "~/styles/careers.css";
import { useNavigate } from "react-router-dom";

export default function CareersPage() {
    const navigate = useNavigate();
    const [expandedJob, setExpandedJob] = useState(null);

    const toggleJob = (id) => {
        setExpandedJob(expandedJob === id ? null : id);
    };

    const handleApplyNow = () => {
        navigate("/pages/contact", {
            state: { type: "JOB" },
        });
    };

    return (
        <section className="careers">
            <div className="container">
                <motion.div
                    className="careers__hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1>Join Our Mission to Provide Quality School Uniforms</h1>
                    <p>
                        Be a part of our journey to deliver high-quality uniforms for students across the nation, from
                        preschool to university.
                    </p>

                    <div className="careers__stats">
                        <div className="careers__stat-item">
                            <span className="careers__stat-number">
                                <CountUp end={50} duration={2} />
                            </span>
                            <span className="careers__stat-label">Team Members</span>
                        </div>
                        <div className="careers__stat-item">
                            <span className="careers__stat-number">
                                <CountUp end={jobListings.length} duration={2} />
                            </span>
                            <span className="careers__stat-label">Office Locations</span>
                        </div>
                        <div className="careers__stat-item">
                            <span className="careers__stat-number">
                                <CountUp end={20} duration={2} decimals={1} suffix="M+" />
                            </span>
                            <span className="careers__stat-label">Students Impacted</span>
                        </div>
                    </div>
                </motion.div>

                <div className="careers__content">
                    <motion.div
                        className="careers__benefits"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2>Why Join Us?</h2>
                        <div className="careers__benefits-grid">
                            {[
                                {
                                    title: "Innovation First",
                                    desc: "Work with cutting-edge technologies and creative solutions",
                                },
                                {
                                    title: "Growth & Development",
                                    desc: "Continuous learning opportunities and career advancement",
                                },
                                {
                                    title: "Work-Life Balance",
                                    desc: "Flexible schedules and remote work options",
                                },
                                {
                                    title: "Quality and Comfort",
                                    desc: "Design uniforms that are comfortable and durable for students of all ages.",
                                },
                                {
                                    title: "Creative Opportunities",
                                    desc: "Work with a team that values creativity in uniform design and production.",
                                },
                                {
                                    title: "Team Collaboration",
                                    desc: "Collaborate with a diverse team to achieve common goals.",
                                },
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    className="careers__benefit-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                >
                                    <h3>{benefit.title}</h3>
                                    <p>{benefit.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="careers__positions">
                        <h2>Open Positions in School Uniforms</h2>
                        <div className="careers__positions-grid">
                            {jobListings.map((job) => (
                                <motion.div
                                    key={job.id}
                                    className="careers__job-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div
                                        className={`careers__job-header ${expandedJob === job.id ? "active" : ""}`}
                                        onClick={() => toggleJob(job.id)}
                                    >
                                        <div className="careers__job-info">
                                            <h3>{job.title}</h3>
                                            <div className="careers__job-meta">
                                                <span>
                                                    <Briefcase size={16} /> {job.department}
                                                </span>
                                                <span>
                                                    <MapPin size={16} /> {job.location}
                                                </span>
                                                <span>
                                                    <Clock size={16} /> {job.type}
                                                </span>
                                            </div>
                                        </div>
                                        {expandedJob === job.id ? <Minus size={20} /> : <Plus size={20} />}
                                    </div>

                                    <AnimatePresence>
                                        {expandedJob === job.id && (
                                            <motion.div
                                                className="careers__job-details"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <p>{job.description}</p>
                                                <div className="careers__job-requirements">
                                                    <h4>Requirements:</h4>
                                                    <ul>
                                                        {job.requirements.map((req, index) => (
                                                            <li key={index}>{req}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <button className="btn careers__apply-btn" onClick={handleApplyNow}>
                                                    Apply Now
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        className="careers__cta"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2>Don't See Your Perfect Role?</h2>
                        <p>We're always looking for talented people to join our team.</p>
                        <button className="btn careers__apply-btn careers__footer-btn" onClick={handleApplyNow}>
                            Send Your CV
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
