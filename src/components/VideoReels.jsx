import React, { useEffect, useState, useRef, useCallback } from "react";
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

  const loadYouTubeAPI = useCallback(() => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
        return;
      }
      window.onYouTubeIframeAPIReady = () => {
        resolve(window.YT);
      };
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
  }, []);

  useEffect(() => {
    loadYouTubeAPI();
  }, [loadYouTubeAPI]);

  const VideoItem = ({ video }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorCode, setErrorCode] = useState(null);
    const playerRef = useRef(null);
    const containerRef = useRef(null);
    const readyTimeoutRef = useRef(null);

    const extractVideoId = (link) => {
      if (!link) return "";
      if (link.includes("shorts/")) {
        return link.split("shorts/")[1]?.split("?")[0];
      } else if (link.includes("v=")) {
        return link.split("v=")[1]?.split("&")[0];
      } else if (link.includes("youtu.be/")) {
        return link.split("youtu.be/")[1]?.split("?")[0];
      }
      return "";
    };

    const videoId = extractVideoId(video.video_link);
    const thumbnailUrl = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null;

    useEffect(() => {
      if (!videoId) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      // Timeout for ready state
      readyTimeoutRef.current = setTimeout(() => {
        if (!isReady) {
          console.warn(`Player timeout for video ${video.id}`);
          setIsReady(false);
          setIsLoading(false);
        }
      }, 5000);

      let player;
      loadYouTubeAPI().then((YT) => {
        player = new YT.Player(`player-${video.id}`, {
          height: "100%",
          width: "100%",
          videoId: videoId,
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            origin: window.location.origin,
            autoplay: 1,
            mute: 1,
            controls: 0,
            iv_load_policy: 3,
            fs: 0,
            loop: 1,
            playlist: videoId,
            enablejsapi: 1, // Explicit for reliability
            disablekb: 1,
          },
          events: {
            onReady: (event) => {
              clearTimeout(readyTimeoutRef.current);
              event.target.mute(); // Reinforce initial mute
              playerRef.current = event.target;
              setIsReady(true);
              setIsLoading(false);
              setHasError(false);
            },
            onError: (event) => {
              clearTimeout(readyTimeoutRef.current);
              console.error(`Player error for video ${video.id}:`, event.data);
              setErrorCode(event.data);
              setHasError(true);
              setIsLoading(false);
              setIsReady(false);
              // Common codes: 100 (private), 101 (no embed), 2 (invalid ID), 5 (HTML5 fail)
            },
            onStateChange: (event) => {
              // Manual loop to prevent flash
              if (event.data === YT.PlayerState.ENDED) {
                const p = playerRef.current;
                if (p) p.playVideo();
              }
            },
            onAutoplayBlocked: (event) => {
              console.warn(`Autoplay blocked for video ${video.id}`);
              // Optional: Pause or prompt user; here, just log (muted should prevent)
            },
          },
        });
      });

      return () => {
        clearTimeout(readyTimeoutRef.current);
        if (player && typeof player.destroy === "function") {
          player.destroy();
        }
      };
    }, [video.id, videoId, loadYouTubeAPI, isReady, isLoading]);

    const toggleMute = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const player = playerRef.current;
      if (!player || !isReady) return;

      if (isMuted) {
        // Unmute + resume play if needed (handles policy pauses)
        player.unMute();
        const state = player.getPlayerState();
        if (state !== 1) {
          // Not playing
          player.playVideo();
        }
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    };

    if (!videoId) {
      return (
        <div className="mobile-video-slide">
          <div className="video-card shadow-sm">
            <div className="video-responsive-container">
              <div className="error-fallback">Invalid Video Link</div>
            </div>
          </div>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="mobile-video-slide">
          <div className="video-card shadow-sm">
            <div className="video-responsive-container">
              {thumbnailUrl && (
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              <div className="error-fallback">
                Embed Unavailable (Code: {errorCode || "Unknown"})<br />
                <small>Video may be private or restricted.</small>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mobile-video-slide">
        <div className="video-card shadow-sm">
          <div className="video-responsive-container" ref={containerRef}>
            {isLoading && (
              <div className="loading-overlay">
                <div className="spinner">⏳</div>
              </div>
            )}
            <div id={`player-${video.id}`} />
            <div
              className="speaker-icon"
              onClick={toggleMute}
              style={{
                opacity: isReady ? 1 : 0.5,
                pointerEvents: isReady ? "auto" : "none",
              }}
            >
              {isMuted ? "🔇" : "🔊"}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const videoSliderSettings = {
    dots: !isMobile,
    infinite: !isMobile,
    speed: 500,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "10px",
          arrows: false,
          autoplay: true,
          infinite: false,
          swipeToSlide: true,
          dots: false,
          pauseOnHover: false,
        },
      },
    ],
  };

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="py-5 video-section overflow-hidden">
      <Container>
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="body-font">FEATURED VIDEOS</h2>
        </div>
        <Slider {...videoSliderSettings}>
          {videos.map((video) => (
            <VideoItem key={video.id} video={video} />
          ))}
        </Slider>
      </Container>
    </section>
  );
};

export default VideoReels;
