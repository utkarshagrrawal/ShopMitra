import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export function TrendingProducts() {
  return (
    <Carousel
      showIndicators={false}
      autoPlay={true}
      interval={2400}
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
    >
      <div>
        <img
          src="https://dlcdnwebimgs.asus.com/gain/385EAFDA-2556-4274-BC01-F05CF4EB585E/fwebp"
          className="w-auto h-[34rem]"
        />
      </div>
      <div>
        <img
          src="https://images-eu.ssl-images-amazon.com/images/G/31/img21/OHL_HMT/HSS21_sep/Header/image110.png"
          className="w-auto h-[34rem]"
        />
      </div>
      <div>
        <img
          src="https://sslimages.shoppersstop.com/sys-master/root/h4b/h0b/32627981975582/Static-Web-Stop-Life_06052024hu.jpg"
          className="w-auto h-[34rem]"
        />
      </div>
    </Carousel>
  );
}
