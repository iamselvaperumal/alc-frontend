import {
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const carouselImages = [
    "dying.png",
    "loom.png",
    "packing.png",
    "quality.png",
    "rawmeterial.png",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredStage, setHoveredStage] = useState(null);

  const productionStages = [
    {
      name: "Raw Material",
      description:
        "Electronically cleared, spliced and autoconed cotton combed / compact yarn from 5s to 80s and 2/20s to 2/100s are our major and regular raw materials. We also use special yarns like Melange yarns, Organic cotton yarns, cotton / polyester blend yarn, cotton / viscose blend yarn, Lycra yarn, Modal yarn, Flax yarn, Metallic yarn, Indigo dyed yarn, Sulphur dyed yarn.",
    },
    {
      name: "Color",
      description:
        "Dyeing is our spinal cord. We have State of the Art yarn dyeing plant with a capacity of 400 Tons per month for Yarn Dyeing & 100 Tons per month for Denim Dyeing.  FONG'S yarn dyeing machines. LAIP sample dyeing machine. Automatic lab dispensing system. Automatic chemical dispensing. Automatic dye kitchen. Automatic dye dispensing. DETTIN Hydro Extractors. STALAM RF Dryers. MORISSON Rope dyeing machine.",
    },
    {
      name: "Prepare",
      description:
        "Our Preparatory comprises of  Soft package Winding machines. SSM Winding machines. SAVIO Autoconer. BENNINGER Direct warper. BENNINGER Sectional warper. KARL MAYER Sizing machine. ROTAL Sizing machine. SUCKER MULLER Sizing machine.",
    },
    {
      name: "Weave",
      description:
        "Our mordern Weave Room has installation of 290 Airjet Looms with monthly weaving capacity of 2 Million metres  Toyota JAT 710. Picanol Omni Plus Picanol Omni. Picanol Omnijet.  Upto to 6 colours weft. Dobby & Cam box. Fancy Beam attachments. Plain, Twill, Satin weaves, combination weaves, Dobby designs.",
    },
    {
      name: "Process",
      description:
        "Hi-Tech fabric processing machines, capable of handling 3 Million metres every month.  Osthoff Singeing. Benninger continuous washing and drying. Benninger Merceriser. Monfort Stenter. Dhall Sanferizer.",
    },
    {
      name: "Shine",
      description:
        "Top brand special finish machines cater the speciality finish requirments of our customers.  LAFER Brushing. LAFER Diamond Sueding. LAFER Raising. LAFER Shearing. ANZINI Calendering. MONFORT Indigo Finishing. SWASTIK Polymerizer Heat Setting For Spandex.",
    },
    {
      name: "Inspect",
      description:
        "Metre to Metre fabric inspection of all fabrics ensure Quality Level higher than customers' expectations and satisfactions.  On-Process Quality Moniterning. Loom stage fabric inspection. Finished fabric inspection. 4 Point grading system.",
    },
    {
      name: "Dispatch",
      description:
        "Final Packing in Roll Form. Shrink Wrapped. Each Roll Quality Report. Designwise Stacking. On-Time Delivery.",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselImages.length) % carouselImages.length,
    );
  };

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
  };

  return (
    <>
      <div className="relative w-full bg-white pt-6">
        <div className="relative h-56 overflow-hidden md:h-96">
          {carouselImages.map((image, idx) => (
            <div
              key={idx}
              className={`absolute w-full h-full transition-opacity duration-700 ${
                idx === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={`/${image}`}
                className="w-full h-full object-cover"
                alt={image}
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentSlide
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-current={idx === currentSlide}
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>

        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
            <span className="sr-only">Previous</span>
          </span>
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors">
            <ChevronRight className="w-5 h-5 text-white" />
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>

      <div className="bg-white">
        {/* Hero Section */}
        <section className="relative isolate px-6 pt-14 lg:px-8">
          <div className="bg-sky-200 rounded-3xl -mx-6 -mb-6 lg:rounded-none">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center text-blue-600 px-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Arthanari Loom Center Textile
              </h1>
              <p className="mt-6 text-lg leading-8 text-black">
                Excellence in textile manufacturing in Salem, Tamil Nadu.
                Delivering high-quality fabrics with precision and care.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/contact"
                  className="rounded-md bg-white text-indigo-600 px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-indigo-50 transition"
                >
                  Inquire Now
                </Link>
                <Link
                  to="/about"
                  className="text-sm font-semibold leading-6 text-lime-700 hover:text-green-600"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose ALC?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition">
                <Briefcase className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Industry Expertise
                </h3>
                <p className="text-gray-600">
                  Decades of experience in textile manufacturing with
                  cutting-edge technology and skilled workforce.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition">
                <Users className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Expert Team</h3>
                <p className="text-gray-600">
                  Dedicated professionals across all departments ensuring
                  quality and timely delivery.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-lg transition">
                <TrendingUp className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Quality Assurance
                </h3>
                <p className="text-gray-600">
                  Rigorous quality control at every stage of production for
                  premium textile products.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Production Process */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Production Process
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {productionStages.map((stage, idx) => (
                <div
                  key={idx}
                  className="relative text-center"
                  onMouseEnter={() => setHoveredStage(idx)}
                  onMouseLeave={() => setHoveredStage(null)}
                >
                  <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto font-bold mb-4 cursor-pointer hover:bg-indigo-700 transition-colors">
                    {idx + 1}
                  </div>
                  <p className="font-semibold text-gray-700">{stage.name}</p>

                  {/* Hover Tooltip */}
                  {hoveredStage === idx && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 z-50 bg-green-200 text-black p-4 rounded-lg shadow-xl w-80 text-m leading-relaxed pointer-events-none">
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-green-200"></div>
                      {stage.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        <hr />
        <br />
        <section className="py-16 px-6 bg-transparent">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Products
            </h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                "Yarn Dyed Stripes",
                "Rayon",
                "Jaspees (Grindles)",
                "Indigo Reactive Checks",
                "Flannels",
                "Checks",
                "Yarn Dyed Lycra",
                "Voiles",
                "100% Tencel",
                "CVC (Chief Value Cotton)",
                "Patchworks",
                "100% Modal",
                "Melanges",
                "Denims (5oz - 14oz)",
                "Slubs",
                "Weft Indigo",
                "Indigos",
                "Dobby",
                "Tencel Blends",
                "PC Blends",
                "Stripes",
                "Lycra Shirt Weft",
                "100% Cotton",
                "Cotton Modal",
                "Cotton Poly",
                "Oxfords",
                "YD Checks",
                "Fake Knit Denim",
                "YD Chambray",
                "Lycra Flannels",
                "Seer Suckers",
              ].map((product, idx) => (
                <button
                  key={idx}
                  className="px-6 py-2 bg-gray-600 text-white rounded-full hover:bg-orange-200
                  hover:text-black transition-colors font-medium text-sm shadow-md hover:shadow-lg"
                >
                  {product}
                </button>
              ))}
            </div>
          </div>
        </section>
        <br />
        <br />
        {/* CTA Section */}
        <section className="bg-indigo-600 text-white py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Partner with Us?
            </h2>
            <p className="text-lg mb-8 text-indigo-100">
              Place your order today and experience premium quality textile
              products.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Contact Us <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};
export default Home;
