import React, { useState } from 'react';
import FormField from './form-field';
import { Mail, Lock, User, Eye, EyeOff, Search, Calendar } from 'lucide-react';

const FormDemo: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    search: '',
    date: '',
    disabled: 'This field is disabled'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<Record<string, boolean>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formState.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formState.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formState.password) {
      newErrors.password = 'Password is required';
    } else if (formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    
    // If no errors, show success
    if (Object.keys(newErrors).length === 0) {
      setSuccess({
        name: true,
        email: true,
        password: true
      });
      
      // Reset success after 3 seconds
      setTimeout(() => {
        setSuccess({});
      }, 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Form Input Examples</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Default state */}
        <FormField
          id="name"
          name="name"
          label="Name"
          placeholder="Enter your name"
          value={formState.name}
          onChange={handleChange}
          icon={<User size={18} />}
          required
          error={errors.name}
          success={success.name}
        />
        
        {/* Focus state will be handled by the input component */}
        <FormField
          id="email"
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={formState.email}
          onChange={handleChange}
          icon={<Mail size={18} />}
          required
          error={errors.email}
          success={success.email}
          helperText="We'll never share your email with anyone else."
        />
        
        {/* Password field with toggle */}
        <div className="relative">
          <FormField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formState.password}
            onChange={handleChange}
            icon={<Lock size={18} />}
            required
            error={errors.password}
            success={success.password}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        
        {/* Search field */}
        <FormField
          id="search"
          name="search"
          label="Search"
          placeholder="Search..."
          value={formState.search}
          onChange={handleChange}
          icon={<Search size={18} />}
        />
        
        {/* Date field */}
        <FormField
          id="date"
          name="date"
          label="Date"
          type="date"
          value={formState.date}
          onChange={handleChange}
          icon={<Calendar size={18} />}
        />
        
        {/* Disabled state */}
        <FormField
          id="disabled"
          name="disabled"
          label="Disabled Field"
          value={formState.disabled}
          onChange={handleChange}
          disabled
        />
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormDemo;