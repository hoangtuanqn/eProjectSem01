import React, { useState } from "react";
import { CirclePlay } from "lucide-react";
import "~/styles/videoPromo.css"; // Import CSS Module

export default function VideoPromo() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <>
            <section className="video-promo">
                <div className="container">
                    <div className="video-promo__inner">
                        {/* Video */}
                        <div className="video-promo__video" data-aos="fade-up-right" onClick={() => setIsPlaying(true)}>
                            {!isPlaying ? (
                                <>
                                    <img
                                        src={`${process.env.REACT_APP_BASE_URL}/assets/imgs/video-promo.webp`}
                                        alt="Video Thumbnail"
                                        className="video-promo__thumbnail"
                                    />
                                    <div
                                        className="video-promo__icon-play"
                                        onClick={() => setIsPlaying(true)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <CirclePlay
                                            size={102}
                                            className="video-promo__icon"
                                            strokeWidth={1}
                                            color="#fff"
                                        />
                                    </div>
                                </>
                            ) : (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/aPAp0h9FD1w?autoplay=1"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </div>

                        {/* Content */}
                        <div className="video-promo__content" data-aos="fade-up-left">
                            <h2 className="video-promo__title">Discover Our Product</h2>
                            <a
                                href="https://www.youtube.com/@MOMOGIRLFASHION"
                                target="_blank"
                                rel="noreferrer"
                                className="video-promo__subtitle"
                            >
                                FOLLOW US ON YOUTUBE
                                <img
                                    src={`${process.env.REACT_APP_BASE_URL}/assets/icon/youtube.svg`}
                                    alt="YouTube Icon"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
