/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import image1 from "../assets/images/category/copier.png";
import image2 from "../assets/images/category/custom.webp";
import image3 from "../assets/images/category/gift.webp";
import image4 from "../assets/images/category/paper.webp";
import image5 from "../assets/images/category/gift.webp";
import image6 from "../assets/images/category/paper.webp";
import image7 from "../assets/images/category/gift.webp";
import image8 from "../assets/images/category/paper.webp";
const slides = [
  {
    id: 1,
    name: " Copier Box",
    image: image1,
    // radius: "60% 40% 70% 30% / 40% 60% 30% 70%",
   bgColor:" red",
    textColor: "#fff",
  },
  {
    id: 2,
    name: "Custom Box",
    image: image2,
    // radius: "20px 80px 40px 100px",
   bgColor:"red",
   
    textColor: "#fff",
  },
  {
    id: 3,
    name: "Gift Box",
    image: image3,
    // radius: "100px 30px 120px 50px",
bgColor:"red",
    textColor: "#fff",
  },
  {
    id: 4,
    name: "PaperBox",
    image: image4,
    // radius: "50% 50% 30% 70% / 60% 40% 70% 30%",
   bgColor:"red",
    textColor: "#fff",
  },
  {
    id: 5,
    name: "PaperBox",
    image: image5,
    // radius: "50% 50% 30% 70% / 60% 40% 70% 30%",
 bgColor:"#red",
    textColor: "#fff",
  },
  {
    id: 6,
    name: "PaperBox",
    image: image6,
    // radius: "50% 50% 30% 70% / 60% 40% 70% 30%",
bgColor:"red",
    textColor: "#fff",
  },
    {
    id: 7,
    name: "PaperBox",
    image: image7,
    // radius: "50% 50% 30% 70% / 60% 40% 70% 30%",
  bgColor:"red",
    textColor: "#fff",
  },
  {
    id: 8,
    name: "PaperBox",
    image: image8,
    // radius: "50% 50% 30% 70% / 60% 40% 70% 30%",
   bgColor:"red",
    textColor: "#fff",
  },
];

export default function HeroSlider() {
  return (
    <section className="slider-wrapper1">
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        loop={true}
        slidesPerView={'auto'} // Allows the slides to take the width defined in CSS
        coverflowEffect={{
          rotate: 50,    // Tilt of the side slides
          stretch: 0,   // Space between slides
          depth: 100,   // Depth offset (3D look)
          modifier: 1,  // Effect multiplier
          slideShadows: true, // Adds shadows to side slides
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {slides.map((item) => (
          <SwiperSlide key={item.id} className="custom-swiper-slide">
            <div className="slider-image-wrapper1">
              <img src={item.image} alt={item.name} className="slider-image" />
            </div>
            <p className="slider-name1" style={{ background: item.bgColor, color: item.textColor }}>
              {item.name}
            </p>
          
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}