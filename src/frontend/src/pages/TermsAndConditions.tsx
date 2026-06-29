export function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #000000 0%, #1a0b2e 50%, #000000 100%)" }}>
      <div className="max-w-3xl mx-auto px-4 py-12 text-white">
        <h1 className="text-3xl font-black mb-2">Terms & Conditions</h1>
        <p className="text-white/40 text-sm mb-8">Last updated: June 29, 2026</p>

        <section className="space-y-6 text-white/80 text-sm leading-relaxed">

          <div>
            <h2 className="text-lg font-bold text-white mb-2">1. General Use</h2>
            <p>By using UR COMICS, you agree to these terms. You must be at least 13 years old to create an account. You are responsible for all activity on your account. We reserve the right to suspend or ban accounts that violate these terms.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">2. Creator Policy</h2>
            <p>You retain ownership of all original content you upload to UR COMICS. By uploading, you grant UR COMICS a license to display your content on the platform. You must not upload content that is plagiarized or stolen from other artists. You are solely responsible for the content you publish.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">3. AI Content Policy</h2>
            <p>If your comic contains AI generated artwork, you must enable the AI badge when uploading. Hiding AI generated content is a violation of these terms. AI comics are not eligible for featuring or trending promotion. Each creator account is limited to a maximum of 3 AI comics. AI comics require manual approval before they are published. AI content creators earn 0% revenue share. Repeated violations will result in a permanent account ban.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">4. No Piracy Policy</h2>
            <p>Uploading official manga or comic pages that you do not own is strictly prohibited. This includes scanning and uploading pages from published works like Naruto, One Piece, Marvel, DC, or any other copyrighted series, regardless of how old the chapters are. Original fan art and independently drawn fan comics are allowed. Pirated content will be removed immediately without warning and the account will be permanently banned. UR COMICS complies with DMCA takedown requests. If you believe your content has been stolen, contact us at urcomics2@gmail.com and we will remove it within 24 hours.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">5. Reader Policy</h2>
            <p>You may not download, scrape, or redistribute comics hosted on UR COMICS without the creator's permission. You may not share paid or exclusive content outside the platform. Respect the creators and their work.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">6. Prohibited Content</h2>
            <p>The following content is strictly not allowed on UR COMICS: hate speech, racism, or discrimination, sexual content involving minors, graphic violence or gore, content promoting illegal activities, and harassment or targeted abuse of any individual.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">7. Privacy</h2>
            <p>Your use of UR COMICS is also governed by our Privacy Policy. Please read it to understand how we collect and use your data.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">8. Account Termination</h2>
            <p>We reserve the right to suspend or permanently ban any account that violates these terms. This includes piracy, AI disclosure violations, hate speech, or any other prohibited behavior. Banned accounts will lose access to all content and any pending earnings.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">9. Changes to These Terms</h2>
            <p>We may update these terms at any time. Continued use of UR COMICS after changes means you accept the updated terms.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">10. Contact Us</h2>
            <p>For any questions or DMCA requests, contact us at: <a href="mailto:urcomics2@gmail.com" className="text-purple-400 hover:underline">urcomics2@gmail.com</a></p>
          </div>

        </section>
      </div>
    </div>
  );
}
