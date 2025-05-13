"use client";

import React from 'react';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-soft py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h1 className="text-3xl font-bold text-secondary mb-6 border-b pb-4">
            Privacy Policy & Terms of Service
          </h1>

          <div className="space-y-8 text-black">
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Refund Policy
              </h2>
              <div className="space-y-4">
                <div className="bg-soft/30 p-4 rounded-lg border border-accent/20">
                  <h3 className="text-lg font-semibold text-secondary mb-2">Subscription Refunds</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>
                      <strong>Trial Period:</strong> Cancel before end to avoid charges. Payments non-refundable after trial.
                    </li>
                    <li>
                      <strong>Monthly & Yearly Plans:</strong> Non-refundable once processed. No refunds for unused time.
                    </li>
                    <li>
                      <strong>Accidental Charges:</strong> Contact within 7 days for review.
                    </li>
                  </ul>
                </div>

                <div className="bg-highlight/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-secondary mb-2">Refund Eligibility</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Duplicate charges due to technical errors</li>
                    <li>System malfunctions preventing core functionality</li>
                    <li>Failure to provide promised core features</li>
                  </ul>
                </div>

                <div className="flex items-center bg-primary/10 p-4 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-accent mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 13l-3-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2l-3 3" />
                    <path d="M13 10l3 3v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3l3-3" />
                  </svg>
                  <div>
                    <p className="font-semibold">Refund Requests</p>
                    <Link
                      href="mailto:support@smartbill.com"
                      className="text-primary hover:underline"
                    >
                      support@smartbill.com
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Privacy Policy Section (from previous design) */}
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Information We Collect
              </h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-accent mr-2 mt-1 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <polyline points="17 11 19 13 23 9" />
                  </svg>
                  <p>
                    <strong>Personal Information:</strong> We collect your name, email, phone number, and billing details to provide and manage our services.
                  </p>
                </div>
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-accent mr-2 mt-1 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  <p>
                    <strong>Payment Information:</strong> Securely processed by trusted third-party payment processors.
                  </p>
                </div>
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-accent mr-2 mt-1 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 13c0 5-3 7-7 7-4 0-7-2-7-7s3-7 7-7c4 0 7 2 7 7Z" />
                    <path d="M10 13 2 7" />
                    <path d="M22 7l-8 6" />
                  </svg>
                  <p>
                    <strong>Usage Data:</strong> We collect IP addresses, device type, and browsing activity to improve our platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Terms & Conditions Section */}
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Terms & Conditions
              </h2>
              <div className="space-y-4">
                <div className="bg-soft/30 p-4 rounded-lg border border-accent/20">
                  <h3 className="text-lg font-semibold text-secondary mb-2">Account Usage</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Must be at least 18 years old</li>
                    <li>Responsible for account security</li>
                    <li>Agree not to misuse the platform</li>
                  </ul>
                </div>

                <div className="bg-highlight/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-secondary mb-2">Payments & Subscriptions</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Fees billed in advance and non-refundable</li>
                    <li>Smart Bill reserves right to update pricing</li>
                    <li>Failure to pay may result in account suspension</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section>
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Contact Us
              </h2>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center bg-primary/10 p-4 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-accent mr-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <div>
                    <p className="font-semibold">Terms & Conditions</p>
                    <Link
                      href="mailto:support@smartbill.com"
                      className="text-primary hover:underline"
                    >
                      support@smartbill.com
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="bg-primary text-white px-6 py-4 text-center">
          <p className="text-sm">
            Last Updated: March 2024 | © {new Date().getFullYear()} Smart Bill. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;