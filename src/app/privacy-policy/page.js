import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Read the privacy policy for The Shades (theshades.co.in) — how we collect, use, and protect your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="breadcrumb" style={{ justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <Link href="/">Home</Link><span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <span>Privacy Policy</span>
        </div>
        <h1>Privacy Policy</h1>
        <p><em>Last updated: March 2026</em></p>

        <h2>1. Introduction</h2>
        <p>The Shades ("we", "our", or "us") operates the website theshades.co.in. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website or engage our services.</p>

        <h2>2. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, phone number, and postal address when you fill out our contact form, request a consultation, or place an order.</li>
          <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time spent on pages, and referring URLs — collected automatically via cookies and analytics tools.</li>
          <li><strong>Cookies:</strong> Small data files stored on your device to improve your browsing experience. You can control cookie preferences through your browser settings.</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Respond to your enquiries and provide customer service</li>
          <li>Process and fulfil orders</li>
          <li>Send relevant product information and promotional offers (with your consent)</li>
          <li>Improve our website and services</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. Data Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share information with trusted service providers (payment processors, delivery partners) who assist us in operating our business, subject to confidentiality agreements.</p>

        <h2>5. Data Security</h2>
        <p>We implement appropriate technical and organisational security measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no method of internet transmission is 100% secure.</p>

        <h2>6. Third-Party Services</h2>
        <p>Our website may use third-party services such as Google Analytics for traffic analysis. These services have their own privacy policies governing the use of your information.</p>

        <h2>7. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at Theshades74@Gmail.com.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.</p>

        <h2>9. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at:</p>
        <ul>
          <li>Email: Theshades74@Gmail.com</li>
          <li>Phone: +91 9953042031</li>
        </ul>
      </div>
    </div>
  );
}
