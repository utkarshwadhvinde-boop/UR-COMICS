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
            <h2 className="text-lg font-bold text-white mb-2">3. AI Content Terms</h2>
            <p>If your comic contains AI generated artwork, you must enable the AI badge when uploading. This is mandatory and non-negotiable. AI comics will not appear in trending or featured sections. AI comics require manual review and approval before going live. Creators who use only AI generated content are not eligible for monetization on UR COMICS. Creators who use a combination of their own artwork and AI assistance may qualify for reduced monetization after submitting proof of original work for review. We do not disclose specific monetization percentages publicly. Hiding AI generated content is a serious violation of these terms and will result in immediate action.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">4. Strike System</h2>
            <p>UR COMICS uses a three strike system for violations.</p>
            <p className="mt-2">Strike 1 — A warning is issued and the violating content is removed within 24 hours. The creator may re-upload the content with the correct disclosure.</p>
            <p className="mt-2">Strike 2 — The account is suspended for 7 days and all content found to be in violation is permanently removed. A final warning is issued.</p>
            <p className="mt-2">Strike 3 — The account is permanently banned and all content is removed. The email associated with the account cannot be used to create a new account.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">5. No Piracy Policy</h2>
            <p>Uploading official manga or comic pages that you do not own is strictly prohibited. This includes scanning and uploading pages from published works like Naruto, One Piece, Marvel, DC, or any other copyrighted series, regardless of how old the chapters are. Original fan art and independently drawn fan comics are allowed. Pirated content will be removed immediately and the strike system will be applied. UR COMICS complies with DMCA takedown requests. If you believe your content has been stolen, contact us at urcomics2@gmail.com and we will remove it within 24 hours.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">6. Content Reporting</h2>
            <p>Readers and creators can report content that violates these terms using the report button available on every comic. All reports are reviewed by the UR COMICS team. False or malicious reports are also a violation of these terms and may result in action against the reporting account.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">7. Monetization Policy</h2>
            <p>Monetization on UR COMICS is available to eligible creators based on the quality and originality of their content. AI only content is not eligible for monetization. Mixed content creators may apply for monetization after submitting proof of original work. UR COMICS reserves the right to change monetization eligibility at any time. Specific revenue percentages are not disclosed publicly.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">8. Reader Policy</h2>
            <p>You may not download, scrape, or redistribute comics hosted on UR COMICS without the creator's permission. Respect the creators and their work.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">9. Prohibited Content</h2>
            <p>The following content is strictly not allowed on UR COMICS: hate speech, racism, or discrimination, sexual content involving minors, graphic violence or gore, content promoting illegal activities, and harassment or targeted abuse of any individual.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">10. Intellectual Property</h2>
            <p>You own the content you create and upload. By uploading to UR COMICS you give us permission to display it on the platform. We will never sell your content or claim ownership over it.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">11. Content Removal</h2>
            <p>UR COMICS reserves the right to remove any content at any time without prior notice if it violates these terms. We are not liable for any loss resulting from content removal.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">12. Privacy</h2>
            <p>Your use of UR COMICS is also governed by our Privacy Policy. Please read it to understand how we collect and use your data.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">13. Account Termination</h2>
            <p>We reserve the right to suspend or permanently ban any account that violates these terms. Banned accounts will lose access to all content and any pending earnings. There is no appeal process for Strike 3 permanent bans.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">14. Changes to These Terms</h2>
            <p>We may update these terms at any time. Continued use of UR COMICS after changes means you accept the updated terms.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white mb-2">15. Contact Us</h2>
            <p>For any questions, reports, or DMCA requests, contact us at: <a href="mailto:urcomics2@gmail.com" className="text-purple-400 hover:underline">urcomics2@gmail.com</a></p>
          </div>

        </section>
      </div>
    </div>
  );
}
