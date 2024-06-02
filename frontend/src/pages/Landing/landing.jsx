import React from "react";
import Header from "../../layouts/header";
import { TrendingProducts } from "./trendingProducts";
import { ProductCards } from "./cards";

export default function Landing() {
  return (
    <>
      <Header />
      <TrendingProducts />
    </>
  );
}
