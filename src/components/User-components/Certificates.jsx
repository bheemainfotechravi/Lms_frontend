// Certificates.jsx
// Props:
//   certificates — array from CERTIFICATES in dashboardData.js

export default function Certificates({ certificates = [] }) {
  const handleDownload = (cert) => {
    // 🔌 Replace with real download: GET /api/certificates/:id/download
    alert(`Downloading: ${cert.title}`);
  };

  const handleShare = (cert) => {
    // 🔌 Replace with real share logic
    navigator.clipboard?.writeText(`Credential ID: ${cert.credentialId}`);
    alert(`Credential ID copied: ${cert.credentialId}`);
  };

  return (
    <div className="space-y-6">

      {/* ── Summary bar ── */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl px-6 py-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏆</span>
          <div>
            <p className="text-gray-900 font-black text-base">
              {certificates.length} Certificate{certificates.length !== 1 ? "s" : ""} Earned
            </p>
            <p className="text-gray-500 text-xs mt-0.5">
              Keep learning to earn more recognized credentials
            </p>
          </div>
        </div>
        <button className="text-xs font-bold text-amber-700 bg-amber-100 border border-amber-200 px-4 py-2 rounded-xl hover:bg-amber-200 transition-all">
          Share All →
        </button>
      </div>

      {/* ── Certificates grid ── */}
      {certificates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
          <p className="text-5xl mb-4">🎓</p>
          <p className="text-gray-900 font-black text-lg mb-1">No certificates yet</p>
          <p className="text-gray-400 text-sm mb-5">
            Complete a course to earn your first certificate!
          </p>
          <button className="bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-all">
            Browse Courses →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className={`bg-gradient-to-br ${cert.cardBg} border ${cert.border} rounded-2xl overflow-hidden shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200`}
            >
              {/* Card top — certificate visual */}
              <div className="px-6 pt-6 pb-4 relative">

                {/* Decorative corner lines */}
                <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-20">
                  {[1,2,3].map((i) => (
                    <div key={i} className={`h-0.5 bg-gray-400 rounded-full ${i === 1 ? "w-8" : i === 2 ? "w-5" : "w-3"}`} />
                  ))}
                </div>

                {/* Icon + badge */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl shrink-0">
                    {cert.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cert.badgeClass} mb-2 inline-block`}>
                      ✓ Verified Certificate
                    </span>
                    <h3 className="text-gray-900 font-black text-base leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1">by {cert.instructor}</p>
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">📅</span>
                    <span className="text-gray-600 text-xs font-medium">Issued: {cert.issueDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🔑</span>
                    <span className="text-gray-400 text-xs font-mono">{cert.credentialId}</span>
                  </div>
                </div>
              </div>

              {/* Divider — dashed like a real certificate */}
              <div className="mx-6 border-t border-dashed border-gray-300/60" />

              {/* Card bottom — actions */}
              <div className="px-6 py-4 flex items-center gap-3">
                <button
                  onClick={() => handleDownload(cert)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl hover:border-primary hover:text-primary hover:bg-violet-50 transition-all"
                >
                  <span>⬇️</span> Download PDF
                </button>
                <button
                  onClick={() => handleShare(cert)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl hover:border-primary hover:text-primary hover:bg-violet-50 transition-all"
                >
                  <span>🔗</span> Copy Credential
                </button>
                <button
                  className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-400 rounded-xl hover:border-primary hover:text-primary hover:bg-violet-50 transition-all shrink-0"
                  title="Share on LinkedIn"
                >
                  in
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Locked / upcoming certificates ── */}
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-6">
        <h4 className="text-gray-700 font-black text-sm mb-4">
          🔒 Certificates You Can Earn Next
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "React & Node.js Bootcamp", progress: 68, emoji: "⚡" },
            { title: "Machine Learning A-Z",     progress: 35, emoji: "🤖" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl shrink-0 opacity-60">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs font-bold truncate">{item.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-primary rounded-full h-1.5"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-xs font-semibold shrink-0">
                    {item.progress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}