import React from 'react';

const CookiePolicy: React.FC = () => {
  return (
    <div className="mt-20 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Cookie Policy</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">What Are Cookies</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide useful information to website owners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">How We Use Cookies</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
              <li>To enable certain functions of the website</li>
              <li>To provide analytics</li>
              <li>To store your preferences</li>
              <li>To enable advertisements delivery</li>
              <li>To enable social media features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium dark:text-white">Essential Cookies</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium dark:text-white">Analytics Cookies</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium dark:text-white">Functionality Cookies</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies enable the website to provide enhanced functionality and personalization, such as remembering your preferences.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium dark:text-white">Advertising Cookies</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  These cookies are used to deliver advertisements more relevant to you and your interests.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Managing Cookies</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.
              </p>
              <p>
                To manage cookies on different browsers, please refer to the following links:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Chrome</li>
                <li>Mozilla Firefox</li>
                <li>Safari</li>
                <li>Microsoft Edge</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Third-Party Cookies</h2>
            <p className="text-gray-600 dark:text-gray-400">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Your Choices Regarding Cookies</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
              </p>
              <p>
                Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may not be able to store your preferences, and some of our pages might not display properly.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">More Information</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                For more information about cookies, please visit <a href="http://www.allaboutcookies.org" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">www.allaboutcookies.org</a>.
              </p>
              <p>
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="pl-4">
                <p>Email: privacy@99carmart.com</p>
                <p>Phone: 1-800-99MARTS (996-2787)</p>
              </div>
            </div>
          </section>

          <div className="text-sm text-gray-500 dark:text-gray-400 pt-6 border-t dark:border-gray-700">
            Last updated: May 15, 2025
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;