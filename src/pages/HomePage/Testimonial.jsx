import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "~/styles/testimonial.css"; // Import CSS Module
import { Rating } from "@mui/material";
import testimonials from "~/data/testimonials.json"; // Import file JSON

export default function Testimonial() {
    return (
        <section className="testimonial">
            <div className="container">
                <div className="section-top">
                    <h2 className="section-title">Testimonial</h2>
                    <p className="section-subtitle">
                        Read customer testimonials sharing how our school uniforms combine comfort, style, and
                        durability for everyday wear.
                    </p>
                </div>
                <div className="testimonial__list">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {testimonials.map((testimonial) => (
                            <SwiperSlide key={testimonial.id}>
                                <div className="testimonial__card">
                                    <img
                                        src={`${process.env.REACT_APP_BASE_URL}${testimonial.avatar}`}
                                        alt={testimonial.name}
                                        loading="lazy"
                                        className="testimonial__avatar"
                                    />
                                    <p className="testimonial__name">{testimonial.name}</p>
                                    <span className="testimonial__role">{testimonial.role}</span>
                                    <div className="testimonial__stars">
                                        <Rating
                                            name="read-only"
                                            value={testimonial.rating}
                                            precision={0.1}
                                            readOnly
                                            size="small"
                                            sx={{
                                                fontSize: "1.8rem",
                                                color: "#ffd700",
                                            }}
                                        />
                                    </div>
                                    <p className="testimonial__text">{testimonial.quote}</p>
                                    <p className="testimonial__date">{testimonial.date}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
