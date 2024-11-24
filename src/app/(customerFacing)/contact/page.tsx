import React from "react";

export default function ContactPage() {
  return (
    <>
      <div className="text-center mx-auto font-bold my-20 text-3xl">
        <p>
          We Know Food Best. Let GSK international Food Suppler be your trusted
          trading partner.
        </p>
        <br />
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-2 justify-center">
          {/* Replace <p> with <span> for inline text */}
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
        <p>CONNECT WITH US!</p>
      </div>
    </>
  );
}
