import { BENEFITS } from "../content";

export function Benefits() {
  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            WHAT YOU&apos;LL LEARN
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
            Everything You Need to Start and Scale
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            In 90 minutes, you&apos;ll walk away with a complete roadmap — from your first tray to your first ₹30,000 month.
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, i) => (
            <div
              key={i}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Number badge */}
              <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">{i + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-green-900/20"
          >
            Get Access to All of This — Free →
          </a>
        </div>
      </div>
    </section>
  );
}
