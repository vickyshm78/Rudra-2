import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Privacy Policy</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Introduction</h2>
            <p className="text-gray-600 dark:text-gray-400">
              At 99CarMart, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Information We Collect</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium dark:text-white">Personal Information</h3>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Name and contact information</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Billing and payment information</li>
                <li>Vehicle information</li>
              </ul>

              <h3 className="text-lg font-medium dark:text-white">Usage Information</h3>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Device information</li>
                <li>Pages visited</li>
                <li>Time spent on site</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>To provide and maintain our services</li>
              <li>To process your transactions</li>
              <li>To send you marketing communications (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To protect against fraud and unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Information Sharing</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We do not sell or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Service providers who assist in operating our website</li>
              <li>Law enforcement when required by law</li>
              <li>Other users when you explicitly choose to share information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Security</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Your Rights</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mt-2 text-gray-600 dark:text-gray-400 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Lodge a complaint with supervisory authorities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Contact Us</h2>
            <p className="text-gray-600 dark:text-gray-400">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-2 text-gray-600 dark:text-gray-400">
              <p>Email: privacy@99carmart.com</p>
              <p>Phone: 1-800-99MARTS (996-2787)</p>
              <p>Address: 123 Auto Plaza, Suite 100, San Francisco, CA 94105</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Updates to This Policy</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last revised" date and the updated version will be effective as soon as it is accessible.
            </p>
          </section>

          <div className="text-sm text-gray-500 dark:text-gray-400 pt-6 border-t dark:border-gray-700">
            Last revised: May 15, 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;