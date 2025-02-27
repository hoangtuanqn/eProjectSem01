import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Github, Twitter, Linkedin, Instagram, X } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import teamMembers from "~/data/team.json";
import "~/styles/team.css";

export default function Team() {
    const [selectedMember, setSelectedMember] = useState(null);

    const openModal = (member) => {
        setSelectedMember(member);
    };

    const closeModal = () => {
        setSelectedMember(null);
    };

    return (
        <section className="creative-team">
            <div className="container">
                <h2 className="creative-team__title">Meet Our Creative Team</h2>
                <p className="creative-team__description">
                    Our diverse team of experts brings passion and innovation to every project.
                </p>
                <div className="creative-team__list">
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
                            1200: { slidesPerView: 4 },
                        }}
                    >
                        {teamMembers.map((member) => (
                            <SwiperSlide key={member.id}>
                                <article className="creative-team__item" onClick={() => openModal(member)}>
                                    <div className="creative-team__image-wrapper">
                                        <img
                                            src={`${process.env.REACT_APP_BASE_URL}${member.image}`}
                                            alt={member.name}
                                            className="creative-team__image"
                                        />
                                        <div className="creative-team__overlay">
                                            <div className="creative-team__social" onClick={(e) => e.stopPropagation()}>
                                                <a
                                                    href={member.social.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="creative-team__social-link"
                                                >
                                                    <Github size={20} />
                                                </a>
                                                <a
                                                    href={member.social.twitter}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="creative-team__social-link"
                                                >
                                                    <Twitter size={20} />
                                                </a>
                                                <a
                                                    href={member.social.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="creative-team__social-link"
                                                >
                                                    <Linkedin size={20} />
                                                </a>

                                                <a
                                                    href={member.social.instagram}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="creative-team__social-link"
                                                >
                                                    <Instagram size={20} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="creative-team__content">
                                        <h3 className="creative-team__name">{member.name}</h3>
                                        <p className="creative-team__role">{member.role}</p>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            {selectedMember && (
                <div className="team-modal" onClick={closeModal}>
                    <div className="team-modal__content" onClick={(e) => e.stopPropagation()}>
                        <button className="team-modal__close" onClick={closeModal}>
                            <X size={24} />
                        </button>
                        <img
                            src={`${process.env.REACT_APP_BASE_URL}${selectedMember.image}`}
                            alt={selectedMember.name}
                            className="team-modal__image"
                        />
                        <h3 className="team-modal__name">{selectedMember.name}</h3>
                        <p className="team-modal__role">{selectedMember.role}</p>
                        <p className="team-modal__bio">{selectedMember.bio}</p>
                        <blockquote className="team-modal__quote">"{selectedMember.quote}"</blockquote>
                        <div className="team-modal__skills">
                            <h4>Skills:</h4>
                            <ul>
                                {selectedMember.skills.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="team-modal__social">
                            <a
                                href={selectedMember.social.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="team-modal__social-link"
                            >
                                <Github size={24} />
                            </a>

                            <a
                                href={selectedMember.social.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="team-modal__social-link"
                            >
                                <Twitter size={24} />
                            </a>
                            <a
                                href={selectedMember.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="team-modal__social-link"
                            >
                                <Linkedin size={24} />
                            </a>
                            <a
                                href={selectedMember.social.instagram}
                                rel="noopener noreferrer"
                                target="_blank"
                                className="team-modal__social-link"
                            >
                                <Instagram size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
