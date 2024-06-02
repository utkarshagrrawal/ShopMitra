import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export function TrendingProducts() {
  return (
    <Carousel
      showIndicators={false}
      autoPlay={true}
      interval={3000}
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
      showArrows={false}
    >
      <div>
        <img
          src="https://f.media-amazon.com/images/G/31/img24/Beauty/GW/WRS/Deals_on_skincare-PC._CB556127883_.jpg"
          className="w-auto h-auto"
        />
      </div>
      <div>
        <img
          src="https://f.media-amazon.com/images/G/31/img23/Wireless/nbshagun/5g/GW/new/MAY/D119951047_WLD_5Grevamp_March2024_Tall_hero_3000x1200_3._CB557823283_.jpg"
          className="w-auto h-auto"
        />
      </div>
      <div>
        <img
          src="https://f.media-amazon.com/images/G/31/AmazonBusiness/BVD_B2C/Banner_5_3000_1200_2105._CB557675082_.jpg"
          className="w-auto h-auto"
        />
      </div>
    </Carousel>
  );
}
