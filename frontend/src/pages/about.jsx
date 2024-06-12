import React from "react";
import Header from "../layouts/header";
import Footer from "../layouts/footer";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
        <p className="text-lg leading-relaxed mb-6">
          Welcome to <strong>Shopmitra</strong>, your number one source for all
          things shopping. I'm dedicated to giving you the very best of
          products, with a focus on quality, customer service, and uniqueness.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Founded in 2024 by Utkarsh Agrawal, Shopmitra has come a long way from
          its beginnings. When I first started out, my passion for providing
          top-notch products drove me to start my own business.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          I now serve customers all over the world, and am thrilled to turn my
          passion into a thriving online store.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          I hope you enjoy my products as much as I enjoy offering them to you.
          If you have any questions or comments, please don't hesitate to
          contact me.
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Sincerely,
          <br />
          Utkarsh Agrawal, Founder
        </p>
        <div className="border-t border-gray-200 mt-8 pt-4">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed mb-6">
            My mission is to provide the best products at an affordable price
            without compromising on quality. I strive to create a seamless and
            enjoyable shopping experience for my customers, ensuring their
            satisfaction with every purchase.
          </p>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-4">
          <h2 className="text-2xl font-bold mb-4">About Me</h2>
          <p className="text-lg leading-relaxed mb-6">
            I'm Utkarsh Agrawal, the sole developer behind Shopmitra. With a
            passion for e-commerce and a dedication to quality, I have built
            this platform to offer a wide range of products and an excellent
            shopping experience.
          </p>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="https://github.com/utkarshagrrawal"
            className="text-gray-500 hover:text-gray-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.486 2 12.006c0 4.424 2.87 8.165 6.839 9.487.5.09.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.455-1.156-1.11-1.465-1.11-1.465-.908-.621.069-.608.069-.608 1.004.07 1.533 1.03 1.533 1.03.892 1.528 2.341 1.087 2.911.831.09-.647.35-1.087.636-1.338-2.22-.253-4.555-1.112-4.555-4.944 0-1.092.39-1.985 1.03-2.682-.103-.253-.447-1.27.097-2.646 0 0 .84-.27 2.75 1.025a9.564 9.564 0 012.504-.337c.849.004 1.704.115 2.504.337 1.908-1.295 2.747-1.025 2.747-1.025.546 1.376.202 2.393.1 2.646.64.697 1.028 1.59 1.028 2.682 0 3.841-2.339 4.687-4.565 4.934.36.308.679.92.679 1.854 0 1.337-.012 2.417-.012 2.745 0 .268.18.576.688.478A10.007 10.007 0 0022 12.006C22 6.486 17.523 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/utkarsh-agrawal-a7a756200/"
            className="text-gray-500 hover:text-gray-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M20.451 2H3.55A1.552 1.552 0 002 3.55v16.902C2 21.32 2.68 22 3.55 22H20.45c.87 0 1.551-.68 1.551-1.55V3.55A1.552 1.552 0 0020.451 2zM8.472 19.424H5.727V9.083h2.745v10.34zm-1.371-11.8c-.857 0-1.55-.694-1.55-1.55 0-.857.693-1.55 1.55-1.55.856 0 1.55.693 1.55 1.55 0 .856-.693 1.55-1.55 1.55zm12.314 11.8h-2.745v-5.56c0-1.326-.473-2.231-1.652-2.231-.902 0-1.437.609-1.673 1.2-.086.21-.108.502-.108.795v5.796h-2.745v-6.544c0-1.195-.028-2.177-.057-3.061h2.387l.123 1.343h.028c.388-.594 1.348-1.438 2.877-1.438 2.105 0 3.682 1.372 3.682 4.324v5.377z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
