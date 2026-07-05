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
              color
        
