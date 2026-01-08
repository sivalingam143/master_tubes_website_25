import React, { useEffect, useState, useRef, useCallback } from "react";
import { Container } from "react-bootstrap";
import API_DOMAIN from "../config/config";
import "./VideoReels.css";

const VideoReels = () => {
  const [videos, setVideos] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const playerRefs = useRef([]); // Store players by index

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
      window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    });
  }, []);

  useEffect(() => {
    loadYouTubeAPI();
  }, [loadYouTubeAPI]);

  const VideoItem = ({ video, index }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [errorCode, setErrorCode] = useState(null);
    const playerRef = useRef(null);

    const extractVideoId = (link) => {
      if (!link) return "";
      if (link.includes("shorts/")) return link.split("shorts/")[1]?.split("?")[0];
      if (link.includes("v=")) return link.split("v=")[1]?.split("&")[0];
      if (link.includes("youtu.be/")) return link.split("youtu.be/")[1]?.split("?")[0];
      return "";
    };

    const videoId = extractVideoId(video.video_link);
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

    useEffect(() => {
      if (!videoId) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      let player;
      loadYouTubeAPI().then((YT) => {
        player = new YT.Player(`player-${video.id}`, {
          height: "100%",
          width: "100%",
          videoId,
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
            enablejsapi: 1,
            disablekb: 1,
          },
          events: {
            onReady: (event) => {
              event.target.mute();
              playerRef.current = event.target;
              playerRefs.current[index] = event.target;
              setIsReady(true);
              setIsLoading(false);
            },
            onError: (event) => {
              console.error(`Player error ${video.id}:`, event.data);
              setErrorCode(event.data);
              setHasError(true);
              setIsLoading(false);
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.ENDED) {
                event.target.seekTo(0);
                setTimeout(() => event.target.playVideo(), 10);
              }
            },
          },
        });
      });

      return () => {
        if (player && player.destroy) player.destroy();
        playerRefs.current[index] = null;
      };
    }, [video.id, videoId, index]);

    const toggleMute = (e) => {
      e.stopPropagation();
      if (!playerRef.current || !isReady) return;
      if (isMuted) {
        playerRef.current.unMute();
        if (playerRef.current.getPlayerState() !== 1) playerRef.current.playVideo();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    };

    if (!videoId) {
      return (
        <div className="video-card shadow-sm">
          <div className="video-responsive-container">
            <div className="error-fallback">Invalid Video Link</div>
          </div>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="video-card shadow-sm">
          <div className="video-responsive-container">
            {thumbnailUrl && <img src={thumbnailUrl} alt="Thumbnail" className="thumbnail-bg" />}
            <div className="error-fallback">
              Embed Unavailable<br />
              <small>Code: {errorCode || "Unknown"}</small>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="video-card shadow-sm">
        <div className="video-responsive-container">
          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner">⏳</div>
            </div>
          )}
          <div id={`player-${video.id}`} />
          <div className="speaker-icon" onClick={toggleMute}>
            {isMuted ? "🔇" : "🔊"}
          </div>
        </div>
      </div>
    );
  };

  if (videos.length === 0) return null;

  return (
    <section className="py-5 video-section">
      <Container>
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="body-font">FEATURED VIDEOS</h2>
        </div>

        {/* Desktop: Grid of 4 videos */}
        {!isMobile ? (
          <div className="desktop-video-grid">
            {videos.slice(0, 4).map((video, index) => (
              <VideoItem key={video.id} video={video} index={index} />
            ))}
          </div>
        ) : (
          /* Mobile: Horizontal scroll with snap */
          <div className="mobile-video-scroll">
            {videos.map((video, index) => (
              <div key={video.id} className="mobile-video-wrapper">
                <VideoItem video={video} index={index} />
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default VideoReels;