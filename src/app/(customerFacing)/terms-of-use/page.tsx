// src/components/TermsAndConditions.jsx

import React from 'react';

const TermsOfUse = () => {
  return (
    <div className="prose max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center">Terms and Conditions for GSK Limited</h1>
      <p className="italic text-center">Last Updated: January 21, 2025</p>
      
      <p>
        Welcome to <a href="https://gsk-international.com" className="text-blue-600 hover:underline">gsk-international.com</a> (the &quot;Site&quot;). These Terms and Conditions (&quot;Terms&quot;) govern your use of our website and services provided by GSK Limited (&quot;we,&quot; &quot;our,&quot; &quot;us&quot;). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please do not use the Site.
      </p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using the Site, you accept and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must not use the Site.
      </p>
      
      <h2>2. Changes to Terms</h2>
      <p>
        We reserve the right to modify or replace these Terms at any time. Any changes will be effective immediately upon posting on the Site. Your continued use of the Site after such changes constitutes your acceptance of the new Terms.
      </p>
      
      <h2>3. Use of the Site</h2>
      <h3>a. Eligibility</h3>
      <p>
        You must be at least 18 years old to use our Site. By using the Site, you represent and warrant that you meet this age requirement.
      </p>
      
      <h3>b. License</h3>
      <p>
        We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Site for your personal, non-commercial use, subject to these Terms.
      </p>
      
      <h3>c. Prohibited Activities</h3>
      <p>You agree not to:</p>
      <ul className="list-disc list-inside">
        <li>Use the Site for any unlawful purpose.</li>
        <li>Violate any applicable local, state, national, or international law.</li>
        <li>Infringe upon our intellectual property rights.</li>
        <li>Transmit any harmful code or viruses.</li>
        <li>Attempt to gain unauthorized access to our systems or data.</li>
      </ul>
      
      {/* Continue adding sections similarly */}
      
      <h2>16. Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us at:</p>
      <address className="not-italic">
        <strong>GSK Limited</strong><br />
        Email: <a href="mailto:info@goldenwaves.com" className="text-blue-600 hover:underline">info@goldenwaves.com</a>
      </address>
      
      <hr className="my-8" />
      <p>
        <strong>Disclaimer:</strong> The above Terms and Conditions are provided as a general template and may not cover all legal requirements applicable to your specific business or jurisdiction. It is strongly recommended that you consult with a qualified legal professional to tailor this document to your needs and ensure compliance with all relevant laws and regulations.
      </p>
    </div>
  );
};

export default TermsOfUse;
