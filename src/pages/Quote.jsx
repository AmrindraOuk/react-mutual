import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Car,
  Home,
  Heart,
  Shield,
  Calculator,
  Download,
  Save,
} from "lucide-react";
import { createQuote } from "../store/quotesSlice";
import { quoteSchema } from "../utils/validationSchemas";
import { formatCurrency } from "../utils/helpers";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Alert from "../components/common/Alert";
import toast from "react-hot-toast";

const Quote = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [calculatedQuote, setCalculatedQuote] = useState(null);
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "auto"
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.quotes);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(quoteSchema),
    defaultValues: {
      type: selectedType,
      personalInfo: isAuthenticated
        ? {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            dateOfBirth: user?.dateOfBirth || "",
            address: user?.address || {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "USA",
            },
          }
        : {},
      coverageDetails: {
        coverageType: "",
        coverageAmount: 100000,
        deductible: 1000,
      },
    },
  });

  useEffect(() => {
    setValue("type", selectedType);
  }, [selectedType, setValue]);

  const insuranceTypes = [
    {
      id: "auto",
      name: "Auto Insurance",
      icon: Car,
      description: "Comprehensive coverage for your vehicle",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "home",
      name: "Home Insurance",
      icon: Home,
      description: "Protect your home and belongings",
      color: "bg-green-100 text-green-600",
    },
    {
      id: "life",
      name: "Life Insurance",
      icon: Heart,
      description: "Secure your family's financial future",
      color: "bg-red-100 text-red-600",
    },
    {
      id: "health",
      name: "Health Insurance",
      icon: Shield,
      description: "Healthcare coverage for you and your family",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const calculatePremium = (formData) => {
    let basePremium = 500;

    switch (formData.type) {
      case "auto":
        basePremium = 800;
        if (formData.vehicleInfo?.year < 2010) basePremium += 200;
        if (formData.vehicleInfo?.mileage > 100000) basePremium += 150;
        break;
      case "home":
        basePremium = 1200;
        if (formData.homeInfo?.yearBuilt < 1990) basePremium += 300;
        if (formData.homeInfo?.squareFootage > 3000) basePremium += 400;
        break;
      case "life":
        basePremium = 600;
        break;
      case "health":
        basePremium = 400;
        break;
      default:
        basePremium = 500;
    }

    if (formData.coverageDetails?.coverageAmount > 100000) {
      basePremium +=
        Math.floor(formData.coverageDetails.coverageAmount / 100000) * 50;
    }

    if (formData.coverageDetails?.deductible > 1000) {
      basePremium -= 100;
    }

    return Math.max(basePremium, 200);
  };

  const onSubmit = async (data) => {
    const premium = calculatePremium(data);
    const quote = {
      ...data,
      premium,
      userId: user?.id || null,
    };

    setCalculatedQuote(quote);
    setStep(3);
  };

  const handleSaveQuote = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save your quote");
      navigate("/login");
      return;
    }

    try {
      await dispatch(createQuote(calculatedQuote)).unwrap();
      toast.success("Quote saved successfully!");
      navigate("/dashboard/quotes");
    } catch (error) {
      toast.error("Failed to save quote");
    }
  };

  const handleDownloadQuote = () => {
    const quoteData = {
      type: calculatedQuote.type,
      premium: calculatedQuote.premium,
      coverageAmount: calculatedQuote.coverageDetails.coverageAmount,
      deductible: calculatedQuote.coverageDetails.deductible,
      generatedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(quoteData, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `insurance-quote-${Date.now()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Quote downloaded successfully!");
  };

  const renderPersonalInfoForm = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            {...register("personalInfo.firstName")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.personalInfo?.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.firstName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            {...register("personalInfo.lastName")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.personalInfo?.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register("personalInfo.email")}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.personalInfo?.email && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.email.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            {...register("personalInfo.phone")}
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.personalInfo?.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.phone.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          {...register("personalInfo.dateOfBirth")}
          type="date"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.personalInfo?.dateOfBirth && (
          <p className="mt-1 text-sm text-red-600">
            {errors.personalInfo.dateOfBirth.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Address</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street Address
          </label>
          <input
            {...register("personalInfo.address.street")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.personalInfo?.address?.street && (
            <p className="mt-1 text-sm text-red-600">
              {errors.personalInfo.address.street.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              {...register("personalInfo.address.city")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.personalInfo?.address?.city && (
              <p className="mt-1 text-sm text-red-600">
                {errors.personalInfo.address.city.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              {...register("personalInfo.address.state")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select State</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
              <option value="IL">Illinois</option>
            </select>
            {errors.personalInfo?.address?.state && (
              <p className="mt-1 text-sm text-red-600">
                {errors.personalInfo.address.state.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code
            </label>
            <input
              {...register("personalInfo.address.zipCode")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.personalInfo?.address?.zipCode && (
              <p className="mt-1 text-sm text-red-600">
                {errors.personalInfo.address.zipCode.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCoverageForm = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Coverage Type
        </label>
        <select
          {...register("coverageDetails.coverageType")}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Coverage Type</option>
          {selectedType === "auto" && (
            <>
              <option value="liability">Liability Only</option>
              <option value="full">Full Coverage</option>
              <option value="comprehensive">Comprehensive</option>
            </>
          )}
          {selectedType === "home" && (
            <>
              <option value="basic">Basic Coverage</option>
              <option value="broad">Broad Coverage</option>
              <option value="special">Special Coverage</option>
            </>
          )}
          {selectedType === "life" && (
            <>
              <option value="term">Term Life</option>
              <option value="whole">Whole Life</option>
              <option value="universal">Universal Life</option>
            </>
          )}
          {selectedType === "health" && (
            <>
              <option value="bronze">Bronze Plan</option>
              <option value="silver">Silver Plan</option>
              <option value="gold">Gold Plan</option>
              <option value="platinum">Platinum Plan</option>
            </>
          )}
        </select>
        {errors.coverageDetails?.coverageType && (
          <p className="mt-1 text-sm text-red-600">
            {errors.coverageDetails.coverageType.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Coverage Amount
        </label>
        <select
          {...register("coverageDetails.coverageAmount", {
            valueAsNumber: true,
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={50000}>$50,000</option>
          <option value={100000}>$100,000</option>
          <option value={250000}>$250,000</option>
          <option value={500000}>$500,000</option>
          <option value={1000000}>$1,000,000</option>
        </select>
        {errors.coverageDetails?.coverageAmount && (
          <p className="mt-1 text-sm text-red-600">
            {errors.coverageDetails.coverageAmount.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deductible
        </label>
        <select
          {...register("coverageDetails.deductible", { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={250}>$250</option>
          <option value={500}>$500</option>
          <option value={1000}>$1,000</option>
          <option value={2500}>$2,500</option>
          <option value={5000}>$5,000</option>
        </select>
        {errors.coverageDetails?.deductible && (
          <p className="mt-1 text-sm text-red-600">
            {errors.coverageDetails.deductible.message}
          </p>
        )}
      </div>

      {selectedType === "auto" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Vehicle Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Make
              </label>
              <input
                {...register("vehicleInfo.make")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Toyota"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <input
                {...register("vehicleInfo.model")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Camry"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                {...register("vehicleInfo.year", { valueAsNumber: true })}
                type="number"
                min="1990"
                max="2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2020"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mileage
              </label>
              <input
                {...register("vehicleInfo.mileage", { valueAsNumber: true })}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="25000"
              />
            </div>
          </div>
        </div>
      )}

      {selectedType === "home" && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Home Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                {...register("homeInfo.propertyType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Built
              </label>
              <input
                {...register("homeInfo.yearBuilt", { valueAsNumber: true })}
                type="number"
                min="1900"
                max="2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2005"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Square Footage
            </label>
            <input
              {...register("homeInfo.squareFootage", { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="2400"
            />
          </div>
        </div>
      )}
    </div>
  );

  const renderQuoteResult = () => (
    <div className="text-center space-y-6">
      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8">
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Your Quote is Ready!
        </h3>
        <div className="text-4xl font-bold text-green-600 mb-4">
          {formatCurrency(calculatedQuote?.premium)}
          <span className="text-lg text-gray-600 font-normal">/month</span>
        </div>
        <p className="text-gray-600">
          {calculatedQuote?.type.charAt(0).toUpperCase() +
            calculatedQuote?.type.slice(1)}{" "}
          Insurance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Coverage Details</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>
              Coverage:{" "}
              {formatCurrency(calculatedQuote?.coverageDetails.coverageAmount)}
            </li>
            <li>
              Deductible:{" "}
              {formatCurrency(calculatedQuote?.coverageDetails.deductible)}
            </li>
            <li>Type: {calculatedQuote?.coverageDetails.coverageType}</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Save your quote</li>
            <li>• Download for your records</li>
            <li>• Contact an agent</li>
            <li>• Purchase online</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleSaveQuote} disabled={!isAuthenticated}>
          <Save className="w-4 h-4 mr-2" />
          Save Quote
        </Button>
        <Button variant="outline" onClick={handleDownloadQuote}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {!isAuthenticated && (
        <Alert type="info">
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Sign in
          </Link>{" "}
          to save your quote and access additional features.
        </Alert>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Your Insurance Quote
          </h1>
          <p className="text-xl text-gray-600">
            Compare rates and find the perfect coverage for your needs
          </p>
        </div>

        {step === 1 && (
          <Card>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Choose Your Insurance Type
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insuranceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setSelectedType(type.id);
                    setStep(2);
                  }}
                  className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg text-left ${
                    selectedType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${type.color}`}
                  >
                    <type.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {type.name}
                  </h3>
                  <p className="text-gray-600">{type.description}</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {insuranceTypes.find((t) => t.id === selectedType)?.name}{" "}
                    Quote
                  </h2>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    size="sm"
                  >
                    Change Type
                  </Button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-2/3"></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Step 2 of 3</p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  {renderPersonalInfoForm()}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Coverage Options
                  </h3>
                  {renderCoverageForm()}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" loading={loading}>
                  Calculate Quote
                </Button>
              </div>
            </Card>
          </form>
        )}

        {step === 3 && calculatedQuote && (
          <Card>
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full w-full"></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Step 3 of 3 - Complete!
              </p>
            </div>
            {renderQuoteResult()}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Quote;
