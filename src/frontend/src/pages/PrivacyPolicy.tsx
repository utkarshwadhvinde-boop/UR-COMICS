export function PrivacyPolicyPage() {
  return (
    <div 
      style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f5f0e8", 
        backgroundImage: "radial-gradient(#fbbf24 1.2px, transparent 1.2px)",
        backgroundSize: "12px 12px",
        padding: "48px 16px",
        boxSizing: "border-box"
      }}
    >
      <div 
        style={{ 
          maxWidth: "800px", 
          margin: "0 auto", 
          backgroundColor: "#ffffff",
          border: "4px solid #111111",
          boxShadow: "8px 8px 0px #111111",
          padding: "40px 32px",
          boxSizing: "border-box"
        }}
      >
        {/* Dossier Header */}
        <div style={{ borderBottom: "4px solid #111111", paddingBottom: "24px", marginBottom: "32px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px", boxSizing: "border-box" }}>
            <h1 style={{ 
              margin: 0, 
              fontFamily: "serif", 
              fontSize: "42px", 
              fontWeight: "900", 
              color: "#111111",
              lineHeight: "1.1",
              letterSpacing: "-1px"
            }}>
              Privacy Policy
            </h1>
            
            <div style={{ 
              backgroundColor: "#fbbf24", 
              border: "2px solid #111111", 
              padding: "6px 12px",
              boxShadow: "2px 2px 0px #111111",
              transform: "rotate(2deg)",
              boxSizing: "border-box"
            }}>
              <p style={{ 
                margin: 0, 
                fontFamily: "monospace, sans-serif", 
                fontSize: "11px", 
                fontWeight: "900", 
                textTransform: "uppercase", 
                color: "#111111" 
              }}>
                Updated: May 18, 2026
              </p>
            </div>
          </div>
        </div>

        {/* Legal Clauses Container */}
        <section style={{ display: "flex", flexDirection: "column", gap: "32px", boxSizing: "border-box" }}>
          
          <div style={{ boxSizing: "border-box" }}>
            <h2 style={{ 
              fontFamily: "monospace, sans-serif", 
              fontSize: "14px", 
              fontWeight: "900", 
              color: "#111111", 
              textTransform: "uppercase", 
              letterSpacing: "0.5px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ backgroundColor: "#111111", color: "#ffffff", padding: "2px 8px" }}>01</span> Information We Collect
            </h2>
            <p style={{ fontFamily: "serif", fontSize: "16px", lineHeight: "1.6", color: "#333333", margin: 0 }}>
              We collect your email address when you create an account, comics and chapters you upload, and your reading history and preferences.
            </p>
          </div>

          <div style={{ boxSizing: "border-box" }}>
            <h2 style={{ 
              fontFamily: "monospace, sans-serif", 
              fontSize: "14px", 
              fontWeight: "900", 
              color: "#111111", 
              textTransform: "uppercase", 
              letterSpacing: "0.5px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ backgroundColor: "#111111", color: "#ffffff", padding: "2px 8px" }}>02</span> How We Use Your Information
            </h2>
            <p style={{ fontFamily: "serif", fontSize: "16px", lineHeight: "1.6", color: "#333333", margin: 0 }}>
              We use your information to provide and improve our services, allow you to publish and read comics, and send important account notifications.
            </p>
          </div>

          <div style={{ boxSizing: "border-box" }}>
            <h2 style={{ 
              fontFamily: "monospace, sans-serif", 
              fontSize: "14px", 
              fontWeight: "900", 
              color: "#111111", 
              textTransform: "uppercase", 
              letterSpacing: "0.5px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ backgroundColor: "#111111", color: "#ffffff", padding: "2px 8px" }}>03</span> Third Party Services
            </h2>
            <p style={{ fontFamily: "serif", fontSize: "16px", lineHeight: "1.6", color: "#333333", margin: 0 }}>
              We use Supabase for database and authentication, Vercel for hosting, and Google AdSense for displaying advertisements.
            </p>
          </div>

          <div style={{ boxSizing: "border-box" }}>
            <h2 style={{ 
              fontFamily: "monospace, sans-serif", 
              fontSize: "14px", 
              fontWeight: "900", 
              color: "#111111", 
              textTransform: "uppercase", 
              letterSpacing: "0.5px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ backgroundColor: "#111111", color: "#ffffff", padding: "2px 8px" }}>04</span> Cookies
            </h2>
            <p style={{ fontFamily: "serif", fontSize: "16px", lineHeight: "1.6", color: "#333333", margin: 0 }}>
              We use cookies to keep you logged in and improve your experience on our website.
            </p>
          </div>

          <div style={{ boxSizing: "border-box" }}>
            <h2 style={{ 
              fontFamily: "monospace, sans-serif", 
              fontSize: "14px", 
              fontWeight: "900", 
              color: "#111111", 
              textTransform: "uppercase", 
              letterSpacing: "0.5px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ backgroundColor: "#111111", color: "#ffffff", padding: "2px 8px" }}>05</span> Advertising
            </h2>
            <p style={{ fontFamily: "serif", fontSize: "16px", lineHeight: "1.6", color: "#333333", margin: 0 }}>
              We use Adsterra to display advertisements. Google may use cookies to show relevant ads based on your visits to this and other websites.
            </p>
          </div>

          <div style={{ boxSizing: "border-box" }}>
            <h2 style={{ 
              fontFamily: "monospace, sans-serif", 
              fontSize: "14px", 
              fontWeight: "900", 
              color: "#111111", 
              textTransform: "uppercase", 
              letterSpacing: "0.5px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ backgroundColor: "#111111", color: "#ffffff", padding: "2px 8px" }}>06</span> Data Security
            </h2>
            <p style={{ fontFamily: "serif", fontSize: "16px", lineHeight: "1.6", color: "#333333", margin: 0 }}>
              We take reasonable measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
            </p>
          </div>

          <div style={{ boxSizing: "border-box" }}>
            <h2 style={{ 
              fontFamily: "monospace, sans-serif", 
              fontSize: "14px", 
              fontWeight: "900", 
              color: "#111111", 
              textTransform: "uppercase", 
              letterSpacing: "0.5px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ backgroundColor: "#111111", color: "#ffffff", padding: "2px 8px" }}>07</span> Children's Privacy
            </h2>
            <p style={{ fontFamily: "serif", fontSize: "16px", lineHeight: "1.6", color: "#333333", margin: 0 }}>
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </div>

          <div style={{ boxSizing: "border-box" }}>
            <h2 style={{ 
              fontFamily: "monospace, sans-serif", 
              fontSize: "14px", 
              fontWeight: "900", 
              color: "#111111", 
              textTransform: "uppercase", 
              letterSpacing: "0.5px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ backgroundColor: "#111111", color: "#ffffff", padding: "2px 8px" }}>08</span> Contact Us
            </h2>
            <p style={{ fontFamily: "serif", fontSize: "16px", lineHeight: "1.6", color: "#333333", margin: 0 }}>
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <a 
                href="mailto:urcomics2@gmail.com" 
                style={{ 
                  color: "#111111", 
                  backgroundColor: "#fbbf24", 
                  textDecoration: "none", 
                  fontWeight: "900",
                  padding: "0 4px",
                  border: "1px solid #111111",
                  boxShadow: "1px 1px 0px #111111"
                }}
              >
                urcomics2@gmail.com
              </a>
            </p>
          </div>

          <div style={{ boxSizing: "border-box" }}>
            <h2 style={{ 
              fontFamily: "monospace, sans-serif", 
              fontSize: "14px", 
              fontWeight: "900", 
              color: "#111111", 
              textTransform: "uppercase", 
              letterSpacing: "0.5px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ backgroundColor: "#111111", color: "#ffffff", padding: "2px 8px" }}>09</span> Changes to This Policy
            </h2>
            <p style={{ fontFamily: "serif", fontSize: "16px", lineHeight: "1.6", color: "#333333", margin: 0 }}>
              We may update this policy at any time. Continued use of our website after changes means you accept the new policy.
            </p>
          </div>

        </section>
      </div>
      <style>{`* { box-sizing: border-box; }`}</style>
    </div>
  );
        }
                            
