import axios from "axios";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, ChevronRight } from "lucide-react";
import stores from "~/data/stores.json";
import toast from "react-hot-toast";
import "~/styles/contact.css";
import { isValidEmail } from "~/utils/helpers";
import { Rating } from "@mui/material";
import { Star } from "@mui/icons-material";
import REQUEST_TYPES from "~/data/requestTypeContact.json";

export default function Contact() {
    const location = useLocation();
    const [selectedStore, setSelectedStore] = useState(stores[0]);
    const [loading, setLoading] = useState(false);

    // Update validation schema
    const validationSchema = Yup.object({
        requestType: Yup.string().required("Request type is required"),
        store: Yup.string().required("Please select a store"),
        name: Yup.string()
            .required("Name is required")
            .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
            .min(2, "Name must be at least 2 characters")
            .trim(),
        email: Yup.string()
            .required("Email is required")
            .email("Invalid email format")
            .test("is-valid-email", "Invalid email address", (value) => isValidEmail(value)),
        phone: Yup.string()
            .required("Phone number is required")
            .matches(/^[+\-()0-9\s]+$/, "Phone number can only contain numbers, +, -, (), and spaces")
            .min(10, "Phone number must be at least 10 digits")
            .max(15, "Phone number must not exceed 15 digits"),
        message: Yup.string()
            .required("Message is required")
            .min(10, "Message must be at least 10 characters")
            .max(5000, "Message must not exceed 5000 characters"),

        // Job Application specific fields
        resume: Yup.mixed().when("requestType", {
            is: REQUEST_TYPES.JOB,
            then: (schema) =>
                schema
                    .required("Resume is required for job applications")
                    .test("fileSize", "File too large (max 5MB)", (value) => !value || value.size <= 5 * 1024 * 1024)
                    .test(
                        "fileType",
                        "Only PDF/DOCX files allowed",
                        (value) =>
                            !value ||
                            [
                                "application/pdf",
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            ].includes(value?.type),
                    ),
            otherwise: (schema) => schema.nullable().optional(),
        }),

        // Partnership specific fields
        partnershipType: Yup.string().when("requestType", {
            is: REQUEST_TYPES.PARTNERSHIP,
            then: (schema) => schema.required("Partnership type is required"),
            otherwise: (schema) => schema.nullable(),
        }),
        partnershipDocs: Yup.mixed().when("requestType", {
            is: REQUEST_TYPES.PARTNERSHIP,
            then: (schema) => schema.nullable(),
            otherwise: (schema) => schema.nullable(),
        }),

        // Feedback specific fields
        rating: Yup.number().when("requestType", {
            is: REQUEST_TYPES.FEEDBACK,
            then: (schema) => schema.required("Rating is required"),
            otherwise: (schema) => schema.nullable(),
        }),
        feedbackDocs: Yup.mixed().when("requestType", {
            is: REQUEST_TYPES.FEEDBACK,
            then: (schema) => schema.nullable(),
            otherwise: (schema) => schema.nullable(),
        }),
    });

    const initialValues = {
        requestType: REQUEST_TYPES[location.state?.type] || REQUEST_TYPES.GENERAL,
        store: stores[0].name,
        name: "",
        email: "",
        phone: "",
        message: "",
        resume: null,
        partnershipType: "",
        partnershipDocs: null,
        rating: 4,
        feedbackDocs: null,
    };

    const handleSubmit = async (values, { resetForm, setSubmitting }) => {
        setLoading(true);
        try {
            let endpoint = "";
            let formData = new FormData();

            // Chuẩn bị dữ liệu cơ bản
            const baseData = {
                store: values.store,
                name: values.name,
                email: values.email,
                phone: values.phone,
                message: values.message,
            };

            switch (values.requestType) {
                case REQUEST_TYPES.JOB:
                    endpoint = "https://67b58bb007ba6e59083d4879.mockapi.io/api/v1/careers/apply";
                    // Gửi dữ liệu dạng JSON thay vì FormData vì API không hỗ trợ lưu file
                    const jobData = {
                        ...baseData,
                        resumeFileName: values.resume?.name || "",
                    };
                    // console.log("Job Application Data:", jobData);
                    await axios.post(endpoint, jobData);
                    break;

                case REQUEST_TYPES.FEEDBACK:
                    endpoint = "https://67a3bb0f31d0d3a6b78479f5.mockapi.io/api/v1/feedback";
                    const feedbackData = {
                        ...baseData,
                        rating: values.rating,
                        feedbackDocsFileName: values.feedbackDocs?.name || "",
                    };
                    // console.log("Feedback Data:", feedbackData);
                    await axios.post(endpoint, feedbackData);
                    break;

                case REQUEST_TYPES.PARTNERSHIP:
                case REQUEST_TYPES.GENERAL:
                default:
                    endpoint = "https://679c72d387618946e65238ce.mockapi.io/api/v1/contacts";
                    // Với contact và partnership, sử dụng FormData để gửi files
                    Object.entries(baseData).forEach(([key, value]) => {
                        formData.append(key, value);
                    });

                    if (values.requestType === REQUEST_TYPES.PARTNERSHIP) {
                        formData.append("partnershipType", values.partnershipType);
                        if (values.partnershipDocs) {
                            formData.append("partnershipDocs", values.partnershipDocs);
                        }
                    }

                    // console.log("Contact/Partnership Data:", Object.fromEntries(formData));
                    await axios.post(endpoint, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    break;
            }
            if (values.requestType !== REQUEST_TYPES.FEEDBACK) {
                toast.success(
                    `Your request has been successfully submitted to ${selectedStore.name}! We will get back to you as soon as possible.`,
                );
            } else {
                if (values.rating > 2) {
                    toast.success("Thank you for taking the time to rate our product.");
                } else {
                    toast.success(
                        `We are sorry for your experience. Our support team at ${selectedStore.name} is available to assist you. Please reach out to us for further help.`,
                    );
                }
            }
            resetForm();
        } catch (error) {
            console.error("Submit error:", error);
            // Log chi tiết lỗi
            if (error.response) {
                console.error("Error response:", error.response.data);
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);
            } else if (error.request) {
                console.error("Error request:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            toast.error(
                "An error occurred while submitting your request. Please check your information and try again.",
            );
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    // Thêm các variants cho animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };

    const handleStoreSelect = (store) => {
        setSelectedStore(store);
    };

    return (
        <>
            <motion.section
                className="contact"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container">
                    <motion.div
                        className="contact__grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Contact Info */}
                        <motion.div className="contact__info" variants={itemVariants}>
                            <h2 className="contact__title">Let's Collaborate</h2>
                            <p className="contact__text">
                                At <strong>{process.env.REACT_APP_BRAND_NAME}</strong>, we believe in the power of
                                collaboration to drive innovation and create exceptional experiences. Our mission is to
                                provide the best in uniform fashion, helping you look and feel your best in every
                                environment. Whether you're dressing for work, school, or special occasions, we offer
                                high-quality products designed to meet your needs.
                            </p>
                            <p className="contact__text">
                                We invite you to explore our collection and experience the difference. Let's work
                                together to bring your vision to life. Contact us today to discuss how we can
                                collaborate and create something extraordinary.
                            </p>

                            <motion.div className="contact__stores" variants={itemVariants}>
                                <h3 className="contact__stores-title">Our Stores</h3>
                                <div className="contact__stores-list">
                                    {stores.map((store) => (
                                        <motion.div
                                            key={store.id}
                                            className={`contact__store ${
                                                selectedStore.id === store.id ? "active" : ""
                                            }`}
                                            onClick={() => {
                                                handleStoreSelect(store);
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="contact__store-content">
                                                <h4 className="contact__store-name">{store.name}</h4>
                                                <div className="contact__store-details">
                                                    <div className="contact__store-detail">
                                                        <MapPin className="contact__store-icon" />
                                                        <a
                                                            className="contact__store-detail-link"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            href={`https://maps.google.com/?q=${store.coordinates.lat},${store.coordinates.lng}`}
                                                        >
                                                            {store.address}
                                                        </a>
                                                    </div>
                                                    <div className="contact__store-detail">
                                                        <Phone className="contact__store-icon" />
                                                        <a
                                                            className="contact__store-detail-link"
                                                            href={`tel:${store.phone}`}
                                                        >
                                                            {store.phone}
                                                        </a>
                                                    </div>
                                                    <div className="contact__store-detail">
                                                        <Mail className="contact__store-icon" />
                                                        <a
                                                            className="contact__store-detail-link"
                                                            href={`mailto:${store.email}`}
                                                        >
                                                            {store.email}
                                                        </a>
                                                    </div>
                                                    <div className="contact__store-detail">
                                                        <Clock className="contact__store-icon" />
                                                        <p>{store.hours}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <ChevronRight
                                                className={`contact__store-arrow ${
                                                    selectedStore.id === store.id ? "active" : ""
                                                }`}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Form Contact */}
                        <motion.div className="contact__form-wrapper" variants={itemVariants}>
                            <h2 className="contact__form-title">Contact</h2>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                                    <Form className="contact__form">
                                        <div className="contact__form-group">
                                            <label htmlFor="store" className="contact__form-label">
                                                Select Store:
                                            </label>
                                            <Field
                                                as="select"
                                                id="store"
                                                name="store"
                                                className={`contact__form-input ${
                                                    errors.store && touched.store ? "error" : ""
                                                }`}
                                                onChange={(e) => {
                                                    const selectedStoreName = e.target.value;
                                                    const store = stores.find((s) => s.name === selectedStoreName);
                                                    if (store) {
                                                        handleStoreSelect(store);
                                                    }
                                                    setFieldValue("store", selectedStoreName);
                                                }}
                                            >
                                                {stores.map((store) => (
                                                    <option key={store.id} value={store.name}>
                                                        {store.name}
                                                    </option>
                                                ))}
                                            </Field>
                                            {errors.store && touched.store && (
                                                <div className="error-message">{errors.store}</div>
                                            )}
                                        </div>

                                        <div className="contact__form-group">
                                            <label htmlFor="requestType" className="contact__form-label">
                                                Request Type:
                                            </label>
                                            <Field
                                                as="select"
                                                id="requestType"
                                                name="requestType"
                                                className={`contact__form-input ${
                                                    errors.requestType && touched.requestType ? "error" : ""
                                                }`}
                                            >
                                                {Object.values(REQUEST_TYPES).map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </Field>
                                            {errors.requestType && touched.requestType && (
                                                <div className="error-message">{errors.requestType}</div>
                                            )}
                                        </div>

                                        <div className="contact__form-group">
                                            <label htmlFor="name" className="contact__form-label">
                                                Name:
                                            </label>
                                            <Field
                                                type="text"
                                                id="name"
                                                name="name"
                                                className={`contact__form-input ${
                                                    errors.name && touched.name ? "error" : ""
                                                }`}
                                            />
                                            {errors.name && touched.name && (
                                                <div className="error-message">{errors.name}</div>
                                            )}
                                        </div>

                                        <div className="contact__form-group">
                                            <label htmlFor="email" className="contact__form-label">
                                                Email:
                                            </label>
                                            <Field
                                                type="email"
                                                id="email"
                                                name="email"
                                                className={`contact__form-input ${
                                                    errors.email && touched.email ? "error" : ""
                                                }`}
                                            />
                                            {errors.email && touched.email && (
                                                <div className="error-message">{errors.email}</div>
                                            )}
                                        </div>

                                        <div className="contact__form-group">
                                            <label htmlFor="phone" className="contact__form-label">
                                                Phone number:
                                            </label>
                                            <Field
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                className={`contact__form-input ${
                                                    errors.phone && touched.phone ? "error" : ""
                                                }`}
                                            />
                                            {errors.phone && touched.phone && (
                                                <div className="error-message">{errors.phone}</div>
                                            )}
                                        </div>

                                        <div className="contact__form-group">
                                            <label htmlFor="message" className="contact__form-label">
                                                Message:
                                            </label>
                                            <Field
                                                as="textarea"
                                                id="message"
                                                name="message"
                                                className={`contact__form-input contact__form-textarea ${
                                                    errors.message && touched.message ? "error" : ""
                                                }`}
                                            />
                                            {errors.message && touched.message && (
                                                <div className="error-message">{errors.message}</div>
                                            )}
                                        </div>

                                        {/* Conditional fields based on request type */}
                                        {values.requestType === REQUEST_TYPES.JOB && (
                                            <div className="contact__form-group">
                                                <label htmlFor="resume" className="contact__form-label">
                                                    Resume Upload (PDF/DOCX, Max 5MB):
                                                </label>
                                                <input
                                                    type="file"
                                                    id="resume"
                                                    name="resume"
                                                    accept=".pdf,.docx"
                                                    onChange={(event) => {
                                                        setFieldValue("resume", event.currentTarget.files[0]);
                                                    }}
                                                    className={`contact__form-input ${
                                                        errors.resume && touched.resume ? "error" : ""
                                                    }`}
                                                />
                                                {errors.resume && touched.resume && (
                                                    <div className="error-message">{errors.resume}</div>
                                                )}
                                            </div>
                                        )}

                                        {values.requestType === REQUEST_TYPES.PARTNERSHIP && (
                                            <>
                                                <div className="contact__form-group">
                                                    <label htmlFor="partnershipType" className="contact__form-label">
                                                        Partnership Type:
                                                    </label>
                                                    <Field
                                                        as="select"
                                                        id="partnershipType"
                                                        name="partnershipType"
                                                        className={`contact__form-input ${
                                                            errors.partnershipType && touched.partnershipType
                                                                ? "error"
                                                                : ""
                                                        }`}
                                                    >
                                                        <option value="">Select Partnership Type</option>
                                                        <option value="Supplier">Supplier</option>
                                                        <option value="Distributor">Distributor</option>
                                                        <option value="Reseller">Reseller</option>
                                                    </Field>
                                                    {errors.partnershipType && touched.partnershipType && (
                                                        <div className="error-message">{errors.partnershipType}</div>
                                                    )}
                                                </div>
                                                <div className="contact__form-group">
                                                    <label htmlFor="partnershipDocs" className="contact__form-label">
                                                        Upload Related Documents (Optional):
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id="partnershipDocs"
                                                        name="partnershipDocs"
                                                        accept=".pdf,.docx,.jpg,.png"
                                                        onChange={(event) => {
                                                            setFieldValue(
                                                                "partnershipDocs",
                                                                event.currentTarget.files[0],
                                                            );
                                                        }}
                                                        className="contact__form-input"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        {values.requestType === REQUEST_TYPES.FEEDBACK && (
                                            <>
                                                <div className="contact__form-group">
                                                    <label htmlFor="rating" className="contact__form-label">
                                                        Rating:
                                                    </label>
                                                    <Rating
                                                        name="rating"
                                                        value={values.rating}
                                                        onChange={(_, newValue) => {
                                                            setFieldValue("rating", newValue);
                                                        }}
                                                        precision={0.5}
                                                        defaultValue={4}
                                                        size="large"
                                                        emptyIcon={
                                                            <Star style={{ opacity: 0.55 }} fontSize="inherit" />
                                                        }
                                                    />
                                                    {errors.rating && touched.rating && (
                                                        <div className="error-message">{errors.rating}</div>
                                                    )}
                                                </div>
                                                <div className="contact__form-group">
                                                    <label htmlFor="feedbackDocs" className="contact__form-label">
                                                        Upload Supporting Documents (Optional):
                                                    </label>
                                                    <input
                                                        type="file"
                                                        id="feedbackDocs"
                                                        name="feedbackDocs"
                                                        accept=".pdf,.docx,.jpg,.png"
                                                        onChange={(event) => {
                                                            setFieldValue("feedbackDocs", event.currentTarget.files[0]);
                                                        }}
                                                        className="contact__form-input"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <motion.button
                                            type="submit"
                                            className="btn contact__form-submit"
                                            disabled={loading || isSubmitting}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {loading ? (
                                                <img
                                                    src={`${process.env.REACT_APP_BASE_URL}/assets/icon/loading.gif`}
                                                    className="contact__loading"
                                                    alt="Loading..."
                                                />
                                            ) : (
                                                "Send Now"
                                            )}
                                        </motion.button>
                                    </Form>
                                )}
                            </Formik>
                        </motion.div>
                    </motion.div>

                    {/* Google Map */}
                    <motion.div
                        className="contact__map"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <iframe
                            key={selectedStore.id}
                            title={`${selectedStore.name} location map`}
                            src={`https://maps.google.com/maps?q=${selectedStore.coordinates.lat},${selectedStore.coordinates.lng}&z=15&output=embed`}
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </motion.div>
                </div>
            </motion.section>
        </>
    );
}
