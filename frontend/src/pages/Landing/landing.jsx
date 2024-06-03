import React from "react";
import Header from "../../layouts/header";
import { CircleCheckIcon } from "../../components/circleCheckIcon";
import { ProductCard } from "./productCard";
import { ReviewCard } from "./reviewCard";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
      <Header />
      <main className="flex flex-col mt-4">
        <section className="grid md:grid-cols-2 gap-8 place-items-center px-4 lg:px-8">
          <div className="px-8">
            <h1 className="text-4xl font-semibold text-gray-800 mb-4">
              Discover the perfect products for you
            </h1>
            <p className="text-gray-500">
              Shopmitra offers a curated selection of high-quality products to
              elevate your lifestyle. Explore our collection and find your new
              favorites.
            </p>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded-md">
              Explore Products
            </button>
            <button className="mt-4 px-4 py-2 border text-black rounded-md ml-4">
              Learn More
            </button>
          </div>
          <div>
            <img
              src="https://i.pinimg.com/originals/c7/d0/d5/c7d0d5e3c79ae4b06ffd944430f3fc94.gif"
              alt="landing"
              width={550}
              height={550}
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
            />
          </div>
        </section>
        <section className="w-full py-12 bg-gray-100">
          <div className="grid items-center justify-center gap-4 px-4 md:px-6">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Elevate Your Style
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Discover our curated collection of high-quality products that
                will transform your everyday life.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <ProductCard
                productName={"Apple Macbook Pro"}
                productPrice={"999"}
                productImage={
                  "https://www.apple.com/v/macbook-pro/ak/images/overview/welcome/welcome_hero_endframe__66ipqm3o5gyu_large_2x.jpg"
                }
              />
              <ProductCard
                productName={"Samsung Galaxy S24"}
                productPrice={"899"}
                productImage={
                  "https://f.media-amazon.com/images/I/71yliZMICyL._SX679_.jpg"
                }
              />
              <ProductCard
                productName={"H&M T-shirt"}
                productPrice={"100"}
                productImage={
                  "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/28097534/2024/4/5/ae488804-3387-4d5e-8e11-cc5d215a37191712302483540HMMenPureCottonRegularFitT-shirt1.jpg"
                }
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12">
          <div className="grid items-center justify-center gap-4 px-4 md:px-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex justify-center">
              <img
                src="https://dtlive.s3.ap-south-1.amazonaws.com/16607/E-Commerce-Shopping-Animated-GIF-Icon-1.gif"
                width="400"
                height="400"
                alt="Features"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-contain sm:w-full"
              />
            </div>
            <div className="space-y-4 lg:px-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Thoughtfully Designed
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our products are carefully crafted with attention to detail
                  and quality, ensuring they enhance your everyday life.
                </p>
              </div>
              <ul className="grid gap-4">
                <li className="flex items-start gap-4">
                  <CircleCheckIcon className="h-6 w-6 flex-shrink-0 text-gray-900" />
                  <div>
                    <h3 className="text-lg font-semibold">Premium Materials</h3>
                    <p className="text-gray-500">
                      Our products are made with high-quality materials that are
                      built to last.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CircleCheckIcon className="h-6 w-6 flex-shrink-0 text-gray-900" />
                  <div>
                    <h3 className="text-lg font-semibold">Timeless Design</h3>
                    <p className="text-gray-500">
                      Our products are designed to be both functional and
                      aesthetically pleasing.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <CircleCheckIcon className="h-6 w-6 flex-shrink-0 text-gray-900" />
                  <div>
                    <h3 className="text-lg font-semibold">
                      Exceptional Service
                    </h3>
                    <p className="text-gray-500">
                      Our dedicated team is here to provide you with
                      personalized support.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="w-full py-24 lg:py-32 bg-gray-100">
          <div className="grid items-center justify-center gap-4 px-4 md:px-6">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                What Our Customers Say
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from our satisfied customers and see why they love
                Shopmitra.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <ReviewCard
                customerName={"Aditya"}
                customerReview={
                  "I'm absolutely in love with the products I've purchased from Shopmitra. The quality is exceptional and the customer service is top-notch."
                }
              />
              <ReviewCard
                customerName={"Priya"}
                customerReview={
                  "Shopmitra has become my go-to destination for all my home decor needs. The selection is incredible, and the prices are unbeatable."
                }
              />
              <ReviewCard
                customerName={"Rohan"}
                customerReview={
                  "I'm so impressed with the quality and attention to detail in every product I've purchased from Shopmitra. Highly recommended!"
                }
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-8 md:py-12">
        <div className="mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">About Shopmitra</h3>
            <p className="text-gray-400">
              Shopmitra is a premium fashion retailer offering a curated
              selection of high-quality apparel and accessories.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <nav className="space-y-2 flex flex-col">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Shop
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {/* <PhoneIcon className="h-5 w-5 text-gray-400" /> */}
                <span className="text-gray-400">+91 63505 55537</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* <InboxIcon className="h-5 w-5 text-gray-400" /> */}
                <span className="text-gray-400">
                  utkarshagrawal09jan@gmail.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* <LocateIcon className="h-5 w-5 text-gray-400" /> */}
                <span className="text-gray-400">India</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-12 border-t border-gray-800 pt-4 md:pt-6 text-center text-gray-400">
          &copy; 2024 Shopmitra. All rights reserved.
        </div>
      </footer>
    </>
  );
}
