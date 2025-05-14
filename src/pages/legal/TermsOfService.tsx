import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Terms of Service</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Agreement to Terms</h2>
            <p className="text-gray-600 dark:text-gray-400">
              By accessing or using 99CarMart, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Use License</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on 99CarMart for personal, non-commercial transitory viewing only.
              </p>
              <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by 99CarMart at any time.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">User Responsibilities</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Provide accurate and complete information when creating an account</li>
              <li>Maintain the security of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not engage in fraudulent or deceptive practices</li>
              <li>Not interfere with the proper functioning of the site</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Listing Guidelines</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>All listings must be for actual vehicles available for sale</li>
              <li>Images must be of the actual vehicle being sold</li>
              <li>Accurate description of vehicle condition and features</li>
              <li>Clear disclosure of any known issues or damage</li>
              <li>Honest representation of mileage and history</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Prohibited Activities</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Posting false or misleading information</li>
              <li>Harassment or abuse of other users</li>
              <li>Spam or unauthorized advertising</li>
              <li>Attempting to circumvent security measures</li>
              <li>Scraping or collecting user data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Fees and Payments</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Some services on 99CarMart may require payment of fees. You agree to pay all fees and charges associated with your account on the terms described in our pricing page.
              </p>
              <p>
                All fees are non-refundable unless otherwise specified. We reserve the right to change our fees at any time with notice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Disclaimer</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                The materials on 99CarMart are provided on an 'as is' basis. 99CarMart makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Limitations</h2>
            <p className="text-gray-600 dark:text-gray-400">
              In no event shall 99CarMart or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on 99CarMart.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Governing Law</h2>
            <p className="text-gray-600 dark:text-gray-400">
              These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <div className="text-sm text-gray-500 dark:text-gray-400 pt-6 border-t dark:border-gray-700">
            Last updated: May 15, 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;