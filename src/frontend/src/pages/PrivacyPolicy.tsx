export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}>
      <div className="max-w-3xl mx-auto px-4 py-12 text-white">
        <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-8">Last updated: May 18, 2026</p>

        <section className="space-y-6 text-white/80 text-sm leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
            <p>We collect your email address when you create an account, comics and chapters you upload, and your reading history and preferences.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, allow you to publish and read comics, and send important account notifications.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">3. Third Party Services</h2>
            <p>We use Supabase for database and authentication, Vercel for hosting, and Google AdSense for displaying advertisements.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">4. Cookies</h2>
            <p>We use cookies to keep you logged in and improve your experience on our website.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">5. Advertising</h2>
            <p>We use Adsterra to display advertisements. Google may use cookies to show relevant ads based on your visits to this and other websites.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">6. Data Security</h2>
            <p>We take reasonable measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">7. Children's Privacy</h2>
            <p>Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:urcomics2@gmail.com" className="text-purple-400 hover:underline">urcomics2@gmail.com</a></p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">9. Changes to This Policy</h2>
            <p>We may update this policy at any time. Continued use of our website after changes means you accept the new policy.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
