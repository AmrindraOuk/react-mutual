import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MessageCircle,
  FileText,
} from "lucide-react";
import { mockFAQs } from "../data/mockData";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { Link } from "react-router-dom";

const Help = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = [
    "All",
    "General",
    "Billing",
    "Coverage",
    "Claims",
    "Account",
  ];

  const filteredFAQs = mockFAQs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const helpTopics = [
    {
      icon: FileText,
      title: "Getting Started",
      description:
        "Learn how to create an account, get quotes, and purchase policies",
      articles: 8,
    },
    {
      icon: Phone,
      title: "Filing Claims",
      description:
        "Step-by-step guide to filing and tracking your insurance claims",
      articles: 12,
    },
    {
      icon: Mail,
      title: "Managing Policies",
      description: "How to view, update, and renew your insurance policies",
      articles: 6,
    },
    {
      icon: MessageCircle,
      title: "Billing & Payments",
      description:
        "Understanding your bills, payment methods, and billing cycles",
      articles: 10,
    },
  ];

  const quickActions = [
    {
      title: "File a Claim",
      description: "Report an incident and start your claim",
      link: "/claims/new",
    },
    {
      title: "Make a Payment",
      description: "Pay your premium or outstanding balance",
      link: "/payments",
    },
    {
      title: "Update Profile",
      description: "Change your contact information or preferences",
      link: "/dashboard/profile",
    },
    {
      title: "Download Documents",
      description: "Access your policy documents and ID cards",
      link: "/dashboard/policies",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              How Can We Help?
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find answers to common questions, browse our help articles, or
              contact our support team.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Topics */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Browse Help Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpTopics.map((topic, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <topic.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {topic.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {topic.description}
                </p>
                <p className="text-blue-600 text-sm font-medium">
                  {topic.articles} articles
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <Card
                  key={faq.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded mb-2">
                        {faq.category}
                      </span>
                      <h3 className="font-semibold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 ml-4" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No FAQs found matching your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
          <p className="text-blue-100 mb-6">
            Can't find what you're looking for? Our support team is here to help
            you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </Link>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Phone className="w-4 h-4 mr-2" />
              Call 1-800-INSURE-MAX
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Help;
