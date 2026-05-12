export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>

          <p className="text-muted-foreground mb-8">
            Last updated: May 2026
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                Information We Collect
              </h2>
              <p className="text-muted-foreground leading-7">
                UR Comics may collect basic user information such as
                usernames, email addresses, profile details, and usage
                activity to improve the platform experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                Advertising Services
              </h2>
              <p className="text-muted-foreground leading-7">
                We may use third-party advertising providers such as
                Adsterra. These services may use cookies and similar
                technologies to display relevant advertisements and
                improve ad performance.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                Data Protection
              </h2>
              <p className="text-muted-foreground leading-7">
                We take reasonable measures to protect user information
                and maintain platform security. However, no method of
                online transmission or storage is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                Third-Party Links
              </h2>
              <p className="text-muted-foreground leading-7">
                UR Comics may contain links to third-party websites or
                services. We are not responsible for the privacy practices
                or content of external websites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                User Consent
              </h2>
              <p className="text-muted-foreground leading-7">
                By using UR Comics, you agree to this Privacy Policy and
                consent to the collection and use of information as
                described above.
              </p>
            </section>

            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                If you have questions regarding this Privacy Policy,
                please contact the UR Comics team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
