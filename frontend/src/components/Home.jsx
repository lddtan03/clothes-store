import React from "react";
import LastestProducts from "./common/LastestProducts";
import FeaturedProducts from "./common/FeaturedProducts";
import Hero from "./common/Hero";
import Layout from "./common/Layout";

function Home() {
  return (
    <div>
      <Layout>
        <Hero />
        <LastestProducts />
        <FeaturedProducts />
      </Layout>
    </div>
  );
}

export default Home;
