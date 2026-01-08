import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Container } from "react-bootstrap";
import Slider from "react-slick";
import API_DOMAIN from "../config/config";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./VideoReels.css";

const VideoReels = () => {
  const [videos, setVideos] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const sliderRef = useRef(null);
  const playerRefs = useRef([]); // Track players by index for slide resumption

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

  // Dynamic slider settings based on video count
  const videoSliderSettings = useMemo(() => {
    const videoCount = videos.length;
    const baseSlidesToShow = isMobile ? 1 : Math.min(4, videoCount);
    const tabletSlidesToShow = Math.min(3, videoCount);
    const mobileSlidesToShow = Math.min(1, videoCount);

    const baseInfinite = !isMobile && videoCount > baseSlidesToShow;
    const tabletInfinite = videoCount > tabletSlidesToShow;

    return {
      dots: false, // Disabled completely - no ellipsis/pagination
      infinite: baseInfinite,
      speed: 500,
      slidesToShow: baseSlidesToShow,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: true,
      arrows: !isMobile,
      afterChange: (current) => {
        // Resume playback on current slide after transition (handles policy pauses)
        const timeoutId = setTimeout(() => {
          const player = playerRefs.current[current];
          if (player && player.getPlayerState() !== 1) {
            // Not playing
            player.seekTo(0); // Ensure at start if needed
            player.playVideo();
          }
        }, 100); // Debounce for smooth settle
        return () => clearTimeout(timeoutId);
      },
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: tabletSlidesToShow,
            autoplay: true,
            infinite: tabletInfinite,
            arrows: true,
            dots: false, // No dots
            afterChange: (current) => {
              const timeoutId = setTimeout(() => {
                const player = playerRefs.current[current];
                if (player && player.getPlayerState() !== 1) {
                  player.seekTo(0);
                  player.playVideo();
                }
              }, 100);
              return () => clearTimeout(timeoutId);
            },
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: mobileSlidesToShow,
            centerMode: true,
            centerPadding: "10px",
            arrows: false,
            autoplay: true,
            infinite: false, // Always false on mobile
            swipeToSlide: true,
            dots: false, // No dots
            pauseOnHover: false,
            afterChange: (current) => {
              const timeoutId = setTimeout(() => {
                const player = playerRefs.current[current];
                if (player && player.getPlayerState() !== 1) {
                  player.seekTo(0);
                  player.playVideo();
                }
              }, 100);
              return () => clearTimeout(timeoutId);
            },
          },
        },
      ],
    };
  }, [videos.length, isMobile]);

  const VideoItem = ({ video, index }) => {
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
            widget_referrer: window.location.origin, // Stabilize embedding
            autoplay: 1,
            mute: 1,
            controls: 0,
            iv_load_policy: 3,
            fs: 0,
            loop: 1,
            playlist: videoId,
            enablejsapi: 1,
            disablekb: 1,
          },
          events: {
            onReady: (event) => {
              clearTimeout(readyTimeoutRef.current);
              event.target.mute();
              playerRef.current = event.target;
              // Register player in parent array
              playerRefs.current[index] = event.target;
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
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.ENDED) {
                // Seamless loop: Seek to 0 first (no gap), then play
                const p = playerRef.current;
                if (p) {
                  p.seekTo(0);
                  const timeoutId = setTimeout(() => p.playVideo(), 10); // Micro-debounce for seek settle
                  return () => clearTimeout(timeoutId);
                }
              }
            },
            onAutoplayBlocked: (event) => {
              console.warn(`Autoplay blocked for video ${video.id}`);
            },
          },
        });
      });

      return () => {
        clearTimeout(readyTimeoutRef.current);
        if (player && typeof player.destroy === "function") {
          player.destroy();
        }
        // Clean up ref
        if (playerRefs.current[index]) {
          playerRefs.current[index] = null;
        }
      };
    }, [video.id, videoId, loadYouTubeAPI, isReady, isLoading, index]);

    const toggleMute = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const player = playerRef.current;
      if (!player || !isReady) return;

      if (isMuted) {
        player.unMute();
        const state = player.getPlayerState();
        if (state !== 1) {
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

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="py-5 video-section overflow-hidden">
      <Container>
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="body-font">FEATURED VIDEOS</h2>
        </div>
        <Slider ref={sliderRef} {...videoSliderSettings}>
          {videos.map((video, index) => (
            <VideoItem key={video.id} video={video} index={index} />
          ))}
        </Slider>
      </Container>
    </section>
  );
};

export default VideoReels;
