import React from "react";
import { PhoneIcon } from "../components/phoneIcon";
import { InboxIcon } from "../components/inboxIcon";
import { LocateIcon } from "../components/locateIcon";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 md:py-12">
      <div className="mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div className="space-y-4">
          <h3 className="text-lg font-bold">About Shopmitra</h3>
          <p className="text-gray-400">
            Shopmitra is a premium fashion retailer offering a curated selection
            of high-quality apparel and accessories.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <nav className="space-y-2 flex flex-col">
            <a
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Home
            </a>
            <a
              href="/results?q=shirts"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Shop
            </a>
            <a
              href="/about"
              className="text-gray-400 hover:text-white transition-colors"
            >
              About
            </a>
          </nav>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Contact Us</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <PhoneIcon />
              <span className="text-gray-400">+91 63505 55537</span>
            </div>
            <div className="flex items-center space-x-2">
              <InboxIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400">
                utkarshagrawal09jan@gmail.com
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <LocateIcon className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400">India</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 md:mt-12 border-t border-gray-800 pt-4 md:pt-6 text-center text-gray-400">
        &copy; 2024 Shopmitra. All rights reserved.
      </div>
    </footer>
  );
}
