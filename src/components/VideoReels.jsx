import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Slider from "react-slick";
import API_DOMAIN from "../config/config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./VideoReels.css";

const VideoReels = () => {
  const [videos, setVideos] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    dots: !isMobile,
    infinite: !isMobile,
    speed: 500, // Reduced for smoother, battery-friendly transitions
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: 1,
    autoplay: true, // Autoplay everywhere
    autoplaySpeed: 3000, // Pause duration between slides
    pauseOnHover: true,
    arrows: !isMobile,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          autoplay: true,
          infinite: true,
          arrows: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // Single video on mobile for performance
          centerMode: true,
          centerPadding: "10px",
          arrows: false,
          autoplay: true,
          infinite: false, // No infinite to avoid cloning heavy iframes
          swipeToSlide: true, // Enable swipe gestures
          dots: false,
          pauseOnHover: false, // Continuous play on mobile swipe
        },
      },
    ],
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
    // Enable autoplay (muted for mobile compliance), inline play, no controls/share, minimal UI
    return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1&origin=${window.location.origin}&autoplay=1&mute=1&controls=0&showinfo=0&iv_load_policy=3&fs=0`;
  };

  if (videos.length === 0) {
    return null; // Hide section if no videos
  }

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
                    allowFullScreen={false} // Disable fullscreen to keep inline
                  />
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
