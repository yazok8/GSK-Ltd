"use client";

import React, { useState, useEffect } from "react";
import emailjs  from 'emailjs-com';
import { Button } from "@/components/ui/button";

interface FormData {
  name: string;
  email: string;
  product: string;
  productDetails: string;
  message: string;
}

export default function ContactPage() {
  const [subject, setSubject] = useState<string | null>(null); // Initially no subject selected
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    product: "",
    productDetails: "",
    message: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null); // To track submission
  const [error, setError] = useState<string | null>(null); // To track errors
  const [isLoading, setIsLoading] = useState<boolean>(false); // To track loading state

  // EmailJS credentials from environment variables
  const EMAILJS_USER_ID = process.env.NEXT_PUBLIC_EMAILJS_USER_ID!;
  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;

  // Initialize EmailJS
  useEffect(() => {
    console.log("Initializing EmailJS with User ID:", EMAILJS_USER_ID);
    emailjs.init(EMAILJS_USER_ID);
  }, [EMAILJS_USER_ID]);

  // Handler for form input changes (handles both input and textarea)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Handler for subject change
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSubject = e.target.value;
    setSubject(selectedSubject === "" ? null : selectedSubject);
    // Reset form data when subject changes
    setFormData({
      name: "",
      email: "",
      product: "",
      productDetails: "",
      message: "",
    });
    setSubmissionStatus(null); // Reset submission status
    setError(null); // Reset errors
  };

  // Handler for form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    // Prepare the template parameters
    const templateParams: { [key: string]: any } = {
      to_name: "GSK Team", // Replace with dynamic recipient name if applicable
      from_name: formData.name,
      email: formData.email,
      subject: subject,
      current_year: new Date().getFullYear(),
    };

    if (subject === "product related") {
      templateParams.product = formData.product;
      templateParams.productDetails = formData.productDetails;
    } else if (subject === "general query") {
      templateParams.message = formData.message;
    }

    // Send the email via EmailJS
    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          setSubmissionStatus("success");
          setError(null);
          // Reset form after successful submission
          setFormData({
            name: "",
            email: "",
            product: "",
            productDetails: "",
            message: "",
          });
          setIsLoading(false); // Stop loading
        },
        (err) => {
          console.error("FAILED...", err);
          setError("Failed to send the message. Please try again later.");
          setSubmissionStatus(null);
          setIsLoading(false); // Stop loading
        }
      );
  };

  // Handler to reset subject selection (optional)
  const handleReset = () => {
    setSubject(null);
    setFormData({
      name: "",
      email: "",
      product: "",
      productDetails: "",
      message: "",
    });
    setSubmissionStatus(null);
    setError(null);
  };

  return (
    <>
      {/* Header Section */}
      <div className="text-center mx-auto font-bold my-20 text-3xl">
        <p>
          We Know Food Best. Let GSK International Food Supplier be your trusted
          trading partner.
        </p>
        <br />
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-2 justify-center">
          <span>For general inquiries email:</span>
          <a
            className="underline"
            href="mailto:info@gsk.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>info@gsk.com</strong>
          </a>
        </div>
        <br />
        <p>Connect With Us!</p>
      </div>

      {/* Subject Selection Section */}
      {!subject && (
        <div className="mx-auto max-w-md p-4">
          <form
            onSubmit={(e) => e.preventDefault()} // Prevent form submission
            className="flex flex-col space-y-4"
          >
            <div>
              <label
                htmlFor="subjects"
                className="block text-sm font-medium text-gray-700"
              >
                Select Subject
              </label>
              <select
                id="subjects"
                value={subject || ""}
                onChange={handleSubjectChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                required
              >
                <option value="">-- Select a subject --</option>
                <option value="product related">Product Related</option>
                <option value="general query">General Query</option>
              </select>
            </div>
          </form>
        </div>
      )}

      {/* Form Section */}
      {subject && (
        <div className="mx-auto max-w-2xl p-4">
          {submissionStatus === "success" && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
              Your message has been successfully sent!
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          <form
            className="flex flex-col space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Common Fields */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Your Full Name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="you@example.com"
              />
            </div>

            {/* Conditional Fields */}
            {subject === "product related" && (
              <>
                <div>
                  <label
                    htmlFor="product"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="product"
                    value={formData.product}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Name of the Product"
                  />
                </div>
                <div>
                  <label
                    htmlFor="productDetails"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Product Details
                  </label>
                  <textarea
                    id="productDetails"
                    value={formData.productDetails}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-teal-500"
                    rows={4}
                    placeholder="Provide detailed information about the product."
                  ></textarea>
                </div>
              </>
            )}

            {subject === "general query" && (
              <>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    rows={4}
                    placeholder="Enter your query or message here."
                  ></textarea>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading} // Disable Button while loading
                className={`w-full py-2 px-4 bg-teal-500 text-white font-semibold rounded-md shadow ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-teal-500"
                } focus:outline-none focus:ring-2 focus:ring-teal-500`}
              >
                {isLoading ? "Sending..." : "Submit"}
              </Button>
            </div>
          </form>

          {/* Optional: Reset or Change Subject */}
          <div className="mt-4 text-center">
            <button
              onClick={handleReset}
              className="text-sm text-teal-600 hover:text-teal-800 underline"
            >
              Change Subject
            </button>
          </div>
        </div>
      )}
    </>
  );
}
