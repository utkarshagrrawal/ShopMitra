import React from "react";
import Header from "../layouts/header";
import Footer from "../layouts/footer";

export function LearnMorePage() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header />
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Learn More</h1>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">What is Shopmitra?</h2>
          <p className="text-lg leading-relaxed mb-6">
            <strong>Shopmitra</strong> is an advanced e-commerce platform
            designed to provide a seamless online shopping experience. From
            user-friendly interfaces to powerful features, Shopmitra aims to be
            your go-to destination for all your shopping needs.
          </p>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside text-lg leading-relaxed mb-6">
            <li>User Authentication and Authorization (JWT)</li>
            <li>Product Listing and Search</li>
            <li>Shopping Cart</li>
            <li>Wishlist</li>
            <li>Order Management</li>
            <li>User Profile Management</li>
            <li>Responsive Design</li>
            <li>Admin Dashboard for Managing Products and Orders</li>
          </ul>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">How to Use Shopmitra</h2>
          <p className="text-lg leading-relaxed mb-4">
            Using Shopmitra is simple and intuitive. Here<span>&rsquo;</span>s a
            quick guide to help you get started:
          </p>
          <ol className="list-decimal list-inside text-lg leading-relaxed mb-6">
            <li>Register an account or log in if you already have one.</li>
            <li>Browse our extensive collection of products.</li>
            <li>Add your favorite items to your shopping cart or wishlist.</li>
            <li>Proceed to checkout to complete your purchase.</li>
            <li>Track your order from your profile dashboard.</li>
          </ol>
        </section>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Why Choose Shopmitra?</h2>
          <p className="text-lg leading-relaxed mb-6">
            Shopmitra is not just another e-commerce platform. Here
            <span>&rsquo;</span>s why you should choose us:
          </p>
          <ul className="list-disc list-inside text-lg leading-relaxed mb-6">
            <li>High-quality products from trusted vendors.</li>
            <li>Secure payment methods.</li>
            <li>Exceptional customer service.</li>
            <li>Regular updates and new features.</li>
            <li>User-centric design for a better shopping experience.</li>
          </ul>
        </section>
        <section className="border-t border-gray-200 pt-8">
          <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-lg leading-relaxed mb-6">
            Have questions or need support? Feel free to reach out to me:
          </p>
          <ul className="list-none text-lg leading-relaxed mb-6">
            <li>
              Email:{" "}
              <a
                href="mailto:utkarshagrawal09jan@gmail.com"
                className="text-blue-600 hover:underline"
              >
                utkarshagrawal09jan@gmail.com
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/utkarshagrrawal"
                className="text-blue-600 hover:underline"
              >
                github.com/utkarshagrrawal
              </a>
            </li>
            <li>
              LinkedIn:{" "}
              <a
                href="https://www.linkedin.com/in/utkarsh-agrawal-a7a756200/"
                className="text-blue-600 hover:underline"
              >
                linkedin.com/in/utkarsh-agrawal-a7a756200/
              </a>
            </li>
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
}
