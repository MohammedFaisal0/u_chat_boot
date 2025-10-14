import React from "react";
import {
  Hero,
  About,
  Contact,
  Features,
  TeamSection,
} from "@/components/landing";

const HomePage = () => (
  <div className="pt-20">
    <Hero />
    <Features />
    <About />
    <TeamSection />
    <Contact />
  </div>
);

export default HomePage;
