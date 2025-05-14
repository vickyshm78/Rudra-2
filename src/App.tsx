import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ListingDetailPage from './pages/ListingDetailPage';
import ProfilePage from './pages/ProfilePage';
import CreateListingPage from './pages/CreateListingPage';
import ComparePage from './pages/ComparePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserLogin from './pages/UserLogin';
import UserDashboard from './pages/UserDashboard';
import NotFoundPage from './pages/NotFoundPage';
import SellingGuide from './pages/guides/SellingGuide';
import BuyingTips from './pages/guides/BuyingTips';
import FinancingOptions from './pages/guides/FinancingOptions';
import VehicleHistory from './pages/guides/VehicleHistory';
import PriceCalculator from './pages/guides/PriceCalculator';
import Blog from './pages/guides/Blog';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiePolicy from './pages/legal/CookiePolicy';
import SmartAssistant from './components/common/SmartAssistant';
import { useToast } from './components/common/MicroInteractions';
import LanguageSwitcher from './components/common/LanguageSwitcher';
import MonetizationDashboard from './pages/monetization/MonetizationDashboard';
import PaymentGateway from './pages/monetization/PaymentGateway';
import FormDesignDemo from './pages/FormDesignDemo';

function App() {
  const { showToast, ToastComponent } = useToast();
  const [language, setLanguage] = useState('en');

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    showToast(`Language changed to ${lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Tamil'}`, 'success');
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/create-listing" element={<CreateListingPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/guides/selling" element={<SellingGuide />} />
            <Route path="/guides/buying" element={<BuyingTips />} />
            <Route path="/guides/financing" element={<FinancingOptions />} />
            <Route path="/guides/history" element={<VehicleHistory />} />
            <Route path="/guides/calculator" element={<PriceCalculator />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/monetization" element={<MonetizationDashboard />} />
            <Route path="/payment/:serviceId/:amount" element={<PaymentGateway />} />
            <Route path="/form-design" element={<FormDesignDemo />} />
            
            {/* Add routes for service pages */}
            <Route path="/inspection" element={<ListingDetailPage />} />
            <Route path="/rto-services" element={<ListingDetailPage />} />
            <Route path="/test-drive" element={<ListingDetailPage />} />
            <Route path="/transport" element={<ListingDetailPage />} />
            <Route path="/warranty" element={<ListingDetailPage />} />
            <Route path="/service-booking" element={<ListingDetailPage />} />
            <Route path="/maintenance" element={<ListingDetailPage />} />
            <Route path="/accessories" element={<ListingDetailPage />} />
            <Route path="/insurance" element={<ListingDetailPage />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        
        {/* Smart Assistant */}
        <SmartAssistant 
          userHistory={{
            recentSearches: ['Honda City', 'SUVs under 15 lakhs'],
            recentViews: ['550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440008'],
            lastInsuranceCheck: '2024-11-15'
          }}
        />
        
        {/* Toast Notifications */}
        <ToastComponent />
      </div>
    </Router>
  );
}

export default App;