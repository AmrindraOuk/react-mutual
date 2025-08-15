import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "Comprehensive Coverage",
      description:
        "Protect what matters most with our wide range of insurance products tailored to your needs.",
    },
    {
      icon: Users,
      title: "Expert Support",
      description:
        "Our experienced agents are here to guide you through every step of your insurance journey.",
    },
    {
      icon: Clock,
      title: "24/7 Claims Service",
      description:
        "File and track claims anytime, anywhere with our responsive customer support team.",
    },
    {
      icon: Award,
      title: "Trusted by Thousands",
      description:
        "Join over 50,000 satisfied customers who trust us to protect their most valuable assets.",
    },
  ];

  const benefits = [
    "Instant online quotes",
    "Competitive rates",
    "Fast claim processing",
    "No hidden fees",
    "Expert advice",
    "Multi-policy discounts",
  ];

  const insuranceTypes = [
    {
      title: "Auto Insurance",
      description: "Comprehensive coverage for your vehicle",
      image:
        "https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=500",
      link: "/quote?type=auto",
    },
    {
      title: "Home Insurance",
      description: "Protect your home and belongings",
      image:
        "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=500",
      link: "/quote?type=home",
    },
    {
      title: "Life Insurance",
      description: "Secure your family's financial future",
      image:
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=500",
      link: "/quote?type=life",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Protect What
                <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  {" "}
                  Matters Most
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Get comprehensive insurance coverage with competitive rates and
                exceptional service. Start with a free quote in just 5 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/quote">
                  <Button
                    size="xl"
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Get Free Quote
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="outline"
                    size="xl"
                    className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3584996/pexels-photo-3584996.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Happy family protected by insurance"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-xl shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">50,000+</p>
                    <p className="text-sm text-gray-600">Happy Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose React Mutual?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with personalized service to
              deliver the best insurance experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Types Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Insurance Solutions for Every Need
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive coverage options to protect all aspects of your life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insuranceTypes.map((type, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-xl transition-shadow"
                padding={false}
              >
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <Link to={type.link}>
                    <Button variant="outline" size="sm" className="w-full">
                      Get Quote
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Experience the React Mutual Advantage
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We've streamlined the insurance process to make it simple, fast,
                and transparent. Here's what you can expect when you choose us.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Customer service representative"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Protected?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and get your personalized
            quote today. It only takes a few minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quote">
              <Button
                size="xl"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Start Your Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="xl"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Speak to an Agent
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
