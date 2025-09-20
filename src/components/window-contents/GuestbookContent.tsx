import React, { useEffect, useState, useRef } from 'react';
import { Send, User, Globe, MapPin, Star, RefreshCw } from 'lucide-react';

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
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
    location: '',
  });

  // 방명록 엔트리 가져오기
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
        text: 'Failed to load entries. Please refresh the page.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries(page);
  }, [page]);

  // 폼 제출 (Turnstile 제거)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) {
      setSubmitMessage({
        type: 'error',
        text: 'Name and message are required.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.data.message });

        // 폼 리셋
        setFormData({
          name: '',
          email: '',
          message: '',
          website: '',
          location: '',
        });

        // 엔트리 새로고침
        setTimeout(() => {
          fetchEntries(1);
          setPage(1);
        }, 1000);

        // 3초 후 폼 숨기기
        setTimeout(() => {
          setShowForm(false);
          setSubmitMessage(null);
        }, 3000);
      } else {
        setSubmitMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'Failed to submit. Please try again.',
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
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomGradient = (id: number) => {
    const gradients = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-yellow-500 to-red-500',
      'from-pink-500 to-yellow-500',
      'from-indigo-500 to-purple-500',
      'from-red-500 to-pink-500',
      'from-cyan-500 to-blue-500',
    ];
    return gradients[id % gradients.length];
  };

  return (
    <div className="px-6 pt-6 h-full overflow-auto bg-white/95 backdrop-blur-xl">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-light mb-2 text-gray-900">Guest Book</h2>
          <p className="text-gray-600 font-light">
            Leave a message and connect with fellow visitors
          </p>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 mb-8">
          <p className="text-blue-800 font-light mb-4">
            Share your thoughts, feedback, or just say hello! I'd love to hear
            from you.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-light flex items-center space-x-2"
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

        {/* Form - Turnstile 제거된 간단한 버전 */}
        {showForm && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm mb-8">
            <h3 className="font-medium text-gray-900 mb-4">Leave a Message</h3>

            {submitMessage && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  maxLength={1000}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Share your thoughts, feedback, or just say hello..."
                />
                <div className="text-xs text-gray-500 mt-1">
                  {formData.message.length}/1000 characters
                </div>
              </div>

              {/* 개발용 안내 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  🚧 <strong>Development Mode:</strong> CAPTCHA is disabled for
                  testing. Please be respectful when leaving messages.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-light flex items-center justify-center space-x-2"
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

        {/* Entries List */}
        <div className="space-y-6 mb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading entries...</span>
            </div>
          ) : entries.length > 0 ? (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-sm relative"
              >
                {entry.is_featured && (
                  <div className="absolute top-4 right-4">
                    <Star size={16} className="text-yellow-500 fill-current" />
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${getRandomGradient(
                      entry.id
                    )} rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}
                  >
                    {getInitials(entry.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="font-medium text-gray-900">
                        {entry.name}
                      </span>

                      {entry.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin size={12} />
                          <span>{entry.location}</span>
                        </div>
                      )}

                      {entry.website && (
                        <a
                          href={entry.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Globe size={12} />
                          <span>Website</span>
                        </a>
                      )}

                      <span className="text-xs text-gray-400">
                        {entry.timeAgo}
                      </span>
                    </div>

                    <p className="text-gray-700 font-light leading-relaxed break-words">
                      {entry.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <User size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No entries yet
              </h3>
              <p className="text-gray-600 font-light">
                Be the first to sign the guestbook!
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
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
                          ? 'bg-blue-500 text-white'
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

        {/* Stats */}
        {pagination && (
          <div className="text-center text-sm text-gray-500 pb-6">
            Showing {entries.length} of {pagination.total} entries
          </div>
        )}
      </div>
    </div>
  );
};
