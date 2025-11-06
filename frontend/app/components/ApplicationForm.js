'use client';
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL 
  : 'http://localhost:5000';

export default function ApplicationForm({ onClose }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    companyType: 'PTY',
    services: [],
    paymentPlan: 'annual'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const serviceOptions = [
    'Company Registration',
    'CSD Registration',
    'COIDA Registration',
    'Annual Returns',
    'Director Changes',
    'Tax PIN Certificate',
    'Affidavit Certificate'
  ];

  const companyTypes = [
    { value: 'PTY', label: 'Private Company (PTY)' },
    { value: 'NPC', label: 'Non-Profit Company (NPC)' },
    { value: 'CC', label: 'Close Corporation (CC)' },
    { value: 'NPO', label: 'Non-Profit Organisation (NPO)' }
  ];

  const handleServiceToggle = (service) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.contactPerson.trim()) {
      setError('Contact person is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (formData.services.length === 0) {
      setError('Please select at least one service');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/applications`, formData);
      
      if (response.status === 201) {
        setSubmitted(true);
        
        // Reset form
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          companyType: 'PTY',
          services: [],
          paymentPlan: 'annual'
        });
      }
    } catch (error) {
      console.error('Application submission error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        setError('Unable to connect to server. Please check if the backend is running.');
      } else {
        setError('Error submitting application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      companyType: 'PTY',
      services: [],
      paymentPlan: 'annual'
    });
    setError('');
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 rounded-xl p-4">
              <Image
                src="/images/apex-logo.jpg"
                alt="APEX FINANCIAL HUB"
                width={120}
                height={50}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary-900 mb-4">Application Submitted Successfully!</h2>
          <p className="text-primary-700 mb-4">
            Thank you for your interest in APEX FINANCIAL HUB services.
          </p>
          <p className="text-primary-700 mb-6">
            We've received your application and will contact you at <strong>{formData.email}</strong> within 24 hours to proceed with your business setup.
          </p>
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary-800">
              <strong>Application Reference:</strong> TIMV-{Date.now().toString().slice(-6)}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary-200">
        <div className="flex items-center space-x-4">
          <div className="bg-primary-100 rounded-lg p-2">
            <Image
              src="/images/apex-logo.jpg"
              alt="APEX FINANCIAL HUB"
              width={80}
              height={35}
              className="rounded-md object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-900">Business Application Form</h2>
            <p className="text-primary-600 mt-1">Complete this form to get started with APEX FINANCIAL HUB</p>
          </div>
        </div>
        <button 
          onClick={handleClose}
          className="text-primary-400 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-primary-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Company Information */}
        <div className="bg-primary-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Company Information</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Full name of contact person"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-primary-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Contact Information</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="+27 XXX XXX XXXX"
              />
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="bg-primary-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Business Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">
                Company Type *
              </label>
              <select
                value={formData.companyType}
                onChange={(e) => handleInputChange('companyType', e.target.value)}
                className="w-full px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                {companyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-3">
                Required Services *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <label key={service} className="flex items-center space-x-3 p-3 border border-primary-200 rounded-lg hover:bg-white transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="rounded border-primary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-primary-700 flex-1">{service}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-primary-500 mt-2">
                Selected: {formData.services.length} service(s)
              </p>
            </div>
          </div>
        </div>

        {/* Payment Plan */}
        <div className="bg-primary-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Payment Plan</h3>
          
          <div className="space-y-3">
            <label className="flex items-start space-x-3 p-4 border-2 border-primary-200 bg-primary-50 rounded-lg cursor-pointer">
              <input
                type="radio"
                value="annual"
                checked={formData.paymentPlan === 'annual'}
                onChange={(e) => handleInputChange('paymentPlan', e.target.value)}
                className="mt-1 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-primary-900">Annual Payment</div>
                <div className="text-2xl font-bold text-primary-600 my-1">R12,000</div>
                <div className="text-sm text-primary-600">Pay once per year and save</div>
                <ul className="text-sm text-primary-600 mt-2 space-y-1">
                  <li>✓ All services included</li>
                  <li>✓ No monthly payments</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
            </label>

            <label className="flex items-start space-x-3 p-4 border-2 border-primary-200 rounded-lg hover:border-primary-300 cursor-pointer">
              <input
                type="radio"
                value="monthly"
                checked={formData.paymentPlan === 'monthly'}
                onChange={(e) => handleInputChange('paymentPlan', e.target.value)}
                className="mt-1 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex-1">
                <div className="font-semibold text-primary-900">Monthly Payment</div>
                <div className="text-2xl font-bold text-primary-600 my-1">R1,000/month</div>
                <div className="text-sm text-primary-600">Flexible monthly payments</div>
                <ul className="text-sm text-primary-600 mt-2 space-y-1">
                  <li>✓ All services included</li>
                  <li>✓ R2,000 deposit required</li>
                  <li>✓ Debit order convenience</li>
                </ul>
              </div>
            </label>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> The fee covers application and administrative services only. 
              Any charges due to service providers (e.g., CIPC filing fees) are additional.
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-primary-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Application...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-8 py-3 border border-primary-300 text-primary-700 rounded-lg font-semibold hover:bg-primary-50 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}