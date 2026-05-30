import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Read the terms and conditions for The Shades (theshades.co.in) — our policies on orders, delivery, returns, and liability.',
};

export default function TermsPage() {
  return (
    <div className="legal-page">
      <div className="container">
        <div className="breadcrumb" style={{ justifyContent: 'flex-start', marginBottom: '1rem' }}>
          <Link href="/">Home</Link><span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <span>Terms & Conditions</span>
        </div>
        <h1>Terms & Conditions</h1>
        <p><em>Last updated: March 2026</em></p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using theshades.co.in ("the Website"), you accept and agree to be bound by these Terms & Conditions. If you do not agree, please do not use the Website.</p>

        <h2>2. Services</h2>
        <p>The Shades provides custom window blinds, curtains, wallpapers, flooring, and related interior décor services. All products are custom-manufactured to the buyer's specifications and measurements.</p>

        <h2>3. Orders & Payment</h2>
        <ul>
          <li>Orders are confirmed upon receipt of advance payment as agreed.</li>
          <li>Prices are subject to change without notice until an order is confirmed.</li>
          <li>Custom-made products cannot be cancelled once production has commenced.</li>
        </ul>

        <h2>4. Delivery & Installation</h2>
        <ul>
          <li>Delivery timelines are estimated and may vary based on product complexity.</li>
          <li>Professional installation is included for Delhi NCR orders unless otherwise stated.</li>
          <li>The customer must ensure that the installation area is accessible and prepared.</li>
        </ul>

        <h2>5. Returns & Warranties</h2>
        <ul>
          <li>Custom-made products are non-returnable unless there is a manufacturing defect.</li>
          <li>Manufacturing defects must be reported within 48 hours of installation.</li>
          <li>Warranty terms vary by product — details provided at the time of purchase.</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <p>All content on this Website — including text, images, logos, and design — is the property of The Shades and protected by Indian intellectual property laws. Reproduction without written permission is prohibited.</p>

        <h2>7. Limitation of Liability</h2>
        <p>The Shades shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid by the customer for the specific product or service in question.</p>

        <h2>8. Governing Law</h2>
        <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi.</p>

        <h2>9. Contact</h2>
        <p>For questions regarding these Terms & Conditions, contact us at Theshades74@Gmail.com or +91 9953042031.</p>
      </div>
    </div>
  );
}
