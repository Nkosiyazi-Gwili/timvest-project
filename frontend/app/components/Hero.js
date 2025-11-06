export default function Hero({ onApplyNow }) {
  return (
    <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* APEX FINANCIAL HUB Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-2xl">
            <div className="text-white font-bold text-2xl leading-tight text-center">
              <div className="text-lg font-extrabold tracking-wide">APEX</div>
              <div className="text-sm font-semibold tracking-wider">FINANCIAL HUB</div>
            </div>
            <div className="mt-2 text-primary-100 text-sm">
              in partnership with <span className="font-bold text-white">TIMVEST</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to
          <span className="block text-primary-200 mt-2">APEX FINANCIAL HUB</span>
        </h1>
        
        {/* Rest of the component remains the same */}
        <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Exclusive Business Start-Up & Compliance Hub Package. 
          Get your business compliant and thriving with our all-inclusive welcome package.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onApplyNow}
            className="px-12 py-4 bg-white text-primary-600 rounded-lg font-bold text-lg hover:bg-primary-50 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
          >
            Apply Now - R12,000/year
          </button>
          <button className="px-12 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-primary-600 transition-all transform hover:-translate-y-1">
            Learn More
          </button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: '100%', label: 'Compliance Guarantee' },
            { value: '24/7', label: 'Expert Support' },
            { value: 'R12K', label: 'Annual Package' },
            { value: 'Fast', label: 'Registration' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{item.value}</div>
              <div className="text-primary-200 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}