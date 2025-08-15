import { Link } from "react-router-dom";
import { Shield, Home, ArrowLeft } from "lucide-react";
import Button from "../components/common/Button";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page. This area is
            restricted to authorized users only.
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
              Need Access?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>If you believe you should have access to this page, please:</p>
              <ul className="space-y-1">
                <li>• Check that you're signed in to the correct account</li>
                <li>
                  • Verify your account permissions with your administrator
                </li>
                <li>• Contact support if you continue to have issues</li>
              </ul>
            </div>

            <div className="mt-6">
              <Link
                to="/contact"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
