// src/components/PrivacyPolicy.jsx

import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="prose max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center">Privacy Policy for GSK Limited</h1>
      <p className="italic text-center">Last Updated: January 21, 2025</p>
      
      <p>
        Welcome to GSK Limited (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://gsk-international.com" className="text-blue-600 hover:underline">gsk-international.com</a> (the &quot;Site&quot;). Please read this policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Site.
      </p>
      
      <h2>1. Information We Collect</h2>
      
      <h3>a. Personal Information</h3>
      <p>We may collect personally identifiable information that you voluntarily provide to us when you:</p>
      <ul className="list-disc list-inside">
        <li>Register an account</li>
        <li>Place an order</li>
        <li>Subscribe to our newsletter</li>
        <li>Contact our customer service</li>
        <li>Fill out a form</li>
      </ul>
      
      <p><strong>Types of Personal Information:</strong></p>
      <ul className="list-disc list-inside">
        <li><strong>Contact Information:</strong> Name, email address, phone number, mailing address.</li>
      </ul>
      
      <h3 className="mt-5">b. Non-Personal Information</h3>
      <p>We may collect non-personally identifiable information about you whenever you interact with our Site. This includes:</p>
      <ul className="list-disc list-inside">
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>IP address</li>
        <li>Pages visited</li>
        <li>Time and date of visit</li>
        <li>Referring website addresses</li>
      </ul>
      
      <h3 className="mt-5">c. Cookies and Tracking Technologies</h3>
      <p>
        We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and personalize content. You can control the use of cookies through your browser settings.
      </p>
      
      {/* Continue adding sections similarly */}
      
      <h2 className="mt-5">8. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at:</p>
      <address className="not-italic">
        <strong>GSK Limited</strong><br />
        Email: <a href="mailto:info@goldenwaves.com" className="text-blue-600 hover:underline">info@goldenwaves.com</a><br />
      </address>
      
      <hr className="my-8" />
      <p>
        <strong>Disclaimer:</strong> The above Privacy Policy is provided as a general template and may not cover all legal requirements applicable to your specific business or jurisdiction. It is strongly recommended that you consult with a qualified legal professional to tailor this document to your needs and ensure compliance with all relevant laws and regulations.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
