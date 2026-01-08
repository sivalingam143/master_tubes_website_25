import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Slider from "react-slick";
import API_DOMAIN from "../config/config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./VideoReels.css";

const VideoReels = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await fetch(`${API_DOMAIN}/banner_video.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ search_text: "" }),
                });
                const data = await response.json();
                if (data.head.code === 200) {
                    setVideos(data.body.videos);
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };
        fetchVideos();
    }, []);

    const videoSliderSettings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false, // Prevents automatic sliding
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3, autoplay: false }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3, // Show 3 videos on mobile
                    centerMode: true,
                    centerPadding: '5px',
                    arrows: false,
                    autoplay: false
                }
            }
        ]
    };

    const getEmbedUrl = (link) => {
        if (!link) return "";
        let videoId = "";
        if (link.includes("shorts/")) {
            videoId = link.split("shorts/")[1]?.split("?")[0];
        } else if (link.includes("v=")) {
            videoId = link.split("v=")[1]?.split("&")[0];
        } else if (link.includes("youtu.be/")) {
            videoId = link.split("youtu.be/")[1]?.split("?")[0];
        }
        // Added playsinline and origin to fix mobile playback stability
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}`;
    };

    return (
        <section className="py-5 video-section overflow-hidden">
            <Container>
                <div className="text-center mb-5" data-aos="fade-up">
                    <h2 className="body-font">FEATURED VIDEOS</h2>
                </div>

                <Slider {...videoSliderSettings}>
                    {videos.map((video) => (
                        <div key={video.id} className="mobile-video-slide">
                            <div className="video-card shadow-sm">
                                <div className="video-responsive-container">
                                    <iframe
                                        src={getEmbedUrl(video.video_link)}
                                        title={`Video ${video.id}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                {/* Shop button container - hidden via CSS on mobile */}
                                <div className="video-hover-overlay">
                                    <button className="shop_now_btn_mobile">Shop</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </Container>
        </section>
    );
};

export default VideoReels;