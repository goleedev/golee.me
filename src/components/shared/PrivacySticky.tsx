import { Maximize2, Minimize2 } from 'lucide-react';

interface PrivacyStickyProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const PrivacySticky = ({
  isExpanded,
  onToggleExpand,
}: PrivacyStickyProps) => {
  const fullText = `Last Updated: October 4, 2025

1. Data Collection
   • Country code (via Cloudflare headers)
   • Referrer URL
   • Browser fingerprint (SHA-256 hashed)
   • Visit timestamp

2. Purpose of Data Collection
   • Aggregate visitor statistics
   • Geographic distribution analysis
   • No individual user tracking
   • No behavioral profiling

3. Data Storage
   • Stored on Cloudflare D1 database
   • Fingerprint retained for 30 minutes only
   • Aggregate data retained indefinitely
   • No personally identifiable information (PII) stored

4. Cookies
   • No tracking cookies used
   • localStorage used only for:
     - Analytics cache (5-minute duration)
     - Visit cooldown (30-minute duration)

5. Data Sharing
   • No data sold to third parties
   • No data shared with advertisers
   • Cloudflare processes data as infrastructure provider
   • Aggregate statistics may be publicly displayed

6. Your Rights (GDPR/CCPA)
   • Right to access your data
   • Right to deletion (limited - only aggregated data stored)
   • Right to opt-out (use DNT browser settings)
   • Right to data portability

7. Security
   • All data transmitted via HTTPS
   • Fingerprints cryptographically hashed
   • No authentication required
   • No account creation

8. Third-Party Services
   • Cloudflare Workers (hosting & analytics)
   • Cloudflare D1 (database)
   • No other third-party tracking

9. Children's Privacy
   • Site not directed at children under 13
   • No knowingly collected data from minors

10. Changes to Policy
    • Updates posted on this page
    • Last updated date indicated above

11. Contact
    • Email: hey@golee.me
    • Response within 7 business days

12. Legal Compliance
    • GDPR compliant (EU)
    • CCPA compliant (California)
    • No consent required (legitimate interest - analytics)

By using this website, you acknowledge this privacy policy.`;

  const shortText = `Last Updated: October 4, 2025

We collect minimal data for analytics:
- Country code
- Referrer URL...`;

  return (
    <>
      <div className="-mt-2.5 md:mt-0 flex items-center justify-between mb-2">
        <span className="font-semibold">🔐 Privacy Note</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
          className="w-4 h-4 sm:w-6 sm:h-6 flex justify-center items-center hover:bg-cyan-300/30 rounded transition-colors pointer-events-auto"
          title={isExpanded ? 'Minimize' : 'Maximize'}
        >
          {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
      <div style={{ whiteSpace: 'pre-line' }}>
        {isExpanded ? fullText : shortText}
      </div>
    </>
  );
};
