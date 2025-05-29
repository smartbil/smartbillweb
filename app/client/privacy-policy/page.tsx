"use client";

import React from 'react';
import Link from 'next/link';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-inter text-black">
      <div className="container mx-auto text-center mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
          Privacy Policy & Terms of Service
        </h1>
      </div>
      <div className="max-w-4xl mx-auto bg-accent bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden">
        <div className="px-6 py-8 ">
          <div className="space-y-8 text-black">
            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">
                Refund Policy
              </h2>
              <div className="space-y-4">
                <div className="bg-smartbill-light-blue/30 p-4 rounded-lg border border-smartbill-blue/20">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Subscription Refunds</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Trial Period:</strong> Cancel before end to avoid charges. Payments non-refundable after trial.</li>
                    <li><strong>Monthly & Yearly Plans:</strong> Non-refundable once processed. No refunds for unused time.</li>
                    <li><strong>Accidental Charges:</strong> Contact within 7 days for review.</li>
                  </ul>
                </div>

                <div className="bg-smartbill-yellow/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Refund Eligibility</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Duplicate charges due to technical errors</li>
                    <li>System malfunctions preventing core functionality</li>
                    <li>Failure to provide promised core features</li>
                  </ul>
                </div>

                <div className="flex items-center bg-smartbill-green/10 p-4 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-smartbill-purple mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13l-3-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2l-3 3" />
                    <path d="M13 10l3 3v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3l3-3" />
                  </svg>
                  <div>
                    <p className="font-semibold">Refund Requests</p>
                    <Link href="mailto:support@smartbill.com" className="text-smartbill-blue hover:underline">support@smartbill.com</Link>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Information We Collect</h2>
              <div className="space-y-3">
                <InfoItem iconPath="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M8.5 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8 M17 11l2 2 4-4" text="Personal Information: We collect your name, email, phone number, and billing details to provide and manage our services." />
                <InfoItem iconPath="M1 10h22 M1 4h22v16H1z" text="Payment Information: Securely processed by trusted third-party payment processors." />
                <InfoItem iconPath="M20 13c0 5-3 7-7 7-4 0-7-2-7-7s3-7 7-7c4 0 7 2 7 7Z M10 13L2 7 M22 7l-8 6" text="Usage Data: We collect IP addresses, device type, and browsing activity to improve our platform." />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Terms & Conditions</h2>
              <div className="space-y-4">
                <div className="bg-smartbill-light-blue/30 p-4 rounded-lg border border-smartbill-blue/20">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Account Usage</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Must be at least 18 years old</li>
                    <li>Responsible for account security</li>
                    <li>Agree not to misuse the platform</li>
                  </ul>
                </div>

                <div className="bg-smartbill-yellow/10 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-smartbill-dark-blue mb-2">Payments & Subscriptions</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Fees billed in advance and non-refundable</li>
                    <li>Smart Bill reserves right to update pricing</li>
                    <li>Failure to pay may result in account suspension</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-smartbill-blue mb-4">Contact Us</h2>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center bg-smartbill-green/10 p-4 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-smartbill-purple mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <div>
                    <p className="font-semibold">Terms & Conditions</p>
                    <Link href="mailto:support@smartbill.com" className="text-smartbill-blue hover:underline">support@smartbill.com</Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="bg-smartbill-dark-blue text-black px-6 py-4 text-center">
          <p className="text-sm">
            Last Updated: March 2024 | © {new Date().getFullYear()} Smart Bill. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ iconPath, text }: { iconPath: string; text: string }) => (
  <div className="flex items-start">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-smartbill-purple mr-2 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {iconPath.split(" ").map((d, idx) => <path key={idx} d={d} />)}
    </svg>
    <p><strong>{text.split(":")[0]}:</strong>{text.split(":")[1]}</p>
  </div>
);

export default PrivacyPolicy;
