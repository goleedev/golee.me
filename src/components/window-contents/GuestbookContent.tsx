import React, { useEffect, useState, useRef } from 'react';
import {
  Send,
  User,
  Globe,
  MapPin,
  Star,
  RefreshCw,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface GuestbookEntry {
  id: number;
  name: string;
  email?: string;
  message: string;
  website?: string;
  location?: string;
  created_at: string;
  timeAgo: string;
  is_featured: boolean;
}

interface GuestbookData {
  entries: GuestbookEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const GuestbookContent = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<
    GuestbookData['pagination'] | null
  >(null);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error' | 'warning';
    text: string;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // Form state with enhanced validation
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
    location: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  // Enhanced security: Input sanitization
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  };

  // Enhanced security: URL validation
  const isValidUrl = (url: string): boolean => {
    try {
      const parsedUrl = new URL(
        url.startsWith('http') ? url : `https://${url}`
      );
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  };

  // Enhanced security: Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Rate limiting check
  const checkRateLimit = (): boolean => {
    const now = Date.now();
    const timeSinceLastSubmit = now - lastSubmitTime;
    return timeSinceLastSubmit >= 300000; // 5 minutes
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      errors.message = 'Message must be less than 1000 characters';
    }

    // Optional field validation
    if (formData.email && !isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      errors.website = 'Please enter a valid website URL';
    }

    if (formData.location && formData.location.length > 100) {
      errors.location = 'Location must be less than 100 characters';
    }

    // Rate limiting
    if (!checkRateLimit()) {
      errors.submit = 'Please wait 5 minutes between submissions';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch guestbook entries
  const fetchEntries = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/guestbook?page=${pageNum}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setEntries(result.data.entries);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to fetch entries:', result.error);
        setSubmitMessage({
          type: 'error',
          text: 'Failed to load entries. Please refresh the page.',
        });
      }
    } catch (error) {
      console.error('Error fetching guestbook entries:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Failed to load entries. Please check your connection.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries(page);
  }, [page]);

  // Enhanced form submission with security measures
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Sanitize all inputs
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: formData.email ? sanitizeInput(formData.email) : '',
        message: sanitizeInput(formData.message),
        website: formData.website ? sanitizeInput(formData.website) : '',
        location: formData.location ? sanitizeInput(formData.location) : '',
      };

      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: result.data.message || 'Thank you for signing the guestbook!',
        });

        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
          website: '',
          location: '',
        });
        setFormErrors({});
        setLastSubmitTime(Date.now());

        // Refresh entries
        setTimeout(() => {
          fetchEntries(1);
          setPage(1);
        }, 1000);

        // Auto-hide form after success
        setTimeout(() => {
          setShowForm(false);
          setSubmitMessage(null);
        }, 3000);
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.error || 'Failed to submit. Please try again.',
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="px-6 pt-6 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto">
        {/* Header - consistent with other windows */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-light mb-2 text-gray-900">Guest Book</h2>
          <p className="text-gray-600 font-light">
            Share your thoughts and connect with fellow visitors
          </p>
        </div>

        {/* Summary Stats - consistent with WorkContent */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50/80 rounded-2xl p-4 text-center">
            <div className="text-xl font-light text-gray-700 mb-1">
              {pagination?.total || 0}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Total Messages
            </div>
          </div>
          <div className="bg-gray-50/80 rounded-2xl p-4 text-center">
            <div className="text-xl font-light text-gray-700 mb-1">
              {entries.filter((e) => e.is_featured).length}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Featured
            </div>
          </div>
          <div className="bg-gray-50/80 rounded-2xl p-4 text-center">
            <div className="text-xl font-light text-gray-700 mb-1">
              {new Set(entries.map((e) => e.location).filter(Boolean)).size}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Locations
            </div>
          </div>
        </div>

        {/* Action Section - consistent with AboutContent */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-medium text-gray-900 mb-4">Leave a Message</h3>
          <p className="text-gray-700 leading-relaxed font-light mb-4">
            I'd love to hear your thoughts, feedback, or just a friendly hello!
            Messages are published immediately and help create a welcoming
            community.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-light flex items-center space-x-2"
            >
              <Send size={16} />
              <span>{showForm ? 'Hide Form' : 'Sign Guest Book'}</span>
            </button>
            <button
              onClick={() => fetchEntries(page)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-light flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Form Section - consistent styling */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="font-medium text-gray-900">New Message</h3>
              <Shield size={16} className="text-green-500" />
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`mb-4 p-4 rounded-2xl border ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border-green-200'
                    : submitMessage.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                    : 'bg-red-50 text-red-800 border-red-200'
                }`}
              >
                <span className="font-medium">{submitMessage.text}</span>
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors font-light ${
                      formErrors.name
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="Your name"
                  />
                  {formErrors.name && (
                    <span className="mt-1 text-sm text-red-600">
                      {formErrors.name}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors font-light ${
                      formErrors.email
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <span className="mt-1 text-sm text-red-600">
                      {formErrors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors font-light ${
                      formErrors.website
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="https://yourwebsite.com"
                  />
                  {formErrors.website && (
                    <span className="mt-1 text-sm text-red-600">
                      {formErrors.website}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    maxLength={100}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors font-light ${
                      formErrors.location
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="City, Country"
                  />
                  {formErrors.location && (
                    <span className="mt-1 text-sm text-red-600">
                      {formErrors.location}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  maxLength={1000}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors resize-none font-light ${
                    formErrors.message
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="Share your thoughts, feedback, or just say hello..."
                />
                <div className="flex justify-between mt-2">
                  {formErrors.message ? (
                    <span className="text-sm text-red-600">
                      {formErrors.message}
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formData.message.length}/1000 characters
                  </span>
                </div>
              </div>

              {/* Security notice - consistent with other sections */}
              <div className="bg-gray-50/50 rounded-2xl p-4">
                <div className="flex items-start space-x-2">
                  <Shield
                    size={16}
                    className="text-gray-600 flex-shrink-0 mt-0.5"
                  />
                  <div>
                    <span className="text-gray-700 text-sm font-medium mb-1 block">
                      Security & Privacy
                    </span>
                    <span className="text-gray-600 text-xs leading-relaxed block">
                      Messages are automatically published. Please be
                      respectful. Rate limit: 1 message per 5 minutes.
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-light flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Messages Section - consistent with WorkContent timeline */}
        <div className="space-y-6 mb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600 font-light">
                Loading messages...
              </span>
            </div>
          ) : entries.length > 0 ? (
            entries.map((entry, index) => (
              <div key={entry.id} className="relative">
                {/* Timeline dot - consistent with WorkContent */}
                <div className="absolute left-0 top-0 w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div>

                {/* Timeline line */}
                {index < entries.length - 1 && (
                  <div className="absolute left-0.5 top-4 w-0.5 h-full bg-gray-200"></div>
                )}

                {/* Content */}
                <div className="ml-8">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col mb-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {entry.name}
                        </span>
                        {entry.is_featured && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star size={12} className="mr-1 fill-current" />
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {entry.location && (
                          <>
                            <span className="flex items-center space-x-1">
                              <MapPin size={12} />
                              <span>{entry.location}</span>
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span>{entry.timeAgo}</span>
                        {entry.website && (
                          <>
                            <span>•</span>
                            <a
                              href={entry.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                              <Globe size={12} />
                              <span>Website</span>
                              <ExternalLink size={10} />
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-gray-700 font-light leading-relaxed mb-4 text-sm break-words">
                    {entry.message}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <User size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No messages yet
              </h3>
              <p className="text-gray-600 font-light">
                Be the first to sign the guestbook!
              </p>
            </div>
          )}
        </div>

        {/* Pagination - consistent styling */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pb-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (pageNum) =>
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    Math.abs(pageNum - page) <= 1
                )
                .map((pageNum, index, array) => (
                  <React.Fragment key={pageNum}>
                    {index > 0 && array[index - 1] !== pageNum - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        page === pageNum
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Stats - consistent with other windows */}
        {pagination && (
          <div className="text-center text-sm text-gray-500 pb-6">
            Showing {entries.length} of {pagination.total} messages
          </div>
        )}
      </div>
    </div>
  );
};
