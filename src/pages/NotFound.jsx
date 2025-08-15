import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Popular Pages
            </h3>
            <div className="space-y-2">
              <Link
                to="/quote"
                className="block text-blue-600 hover:text-blue-500 text-sm"
              >
                Get Insurance Quote
              </Link>
              <Link
                to="/about"
                className="block text-blue-600 hover:text-blue-500 text-sm"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block text-blue-600 hover:text-blue-500 text-sm"
              >
                Contact Support
              </Link>
              <Link
                to="/help"
                className="block text-blue-600 hover:text-blue-500 text-sm"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
