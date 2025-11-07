export default function Services() {
  const logoUrl = 'https://i.postimg.cc/ZRSDXsHV/Whats-App-Image-2025-11-06-at-15-43-48-d0cd4c60.jpg';
  
  const services = [
    {
      icon: '🏢',
      title: 'Company Registration',
      description: 'PTY, NPC, CC, and NPO registrations with complete documentation'
    },
    {
      icon: '📋',
      title: 'Essential Registrations',
      description: 'CSD Registration, COIDA Registration for full compliance'
    },
    {
      icon: '⚖️',
      title: 'Compliance Services',
      description: 'CIPC & NPO Annual Returns, Director Changes, Tax PIN Certificates'
    },
    {
      icon: '📄',
      title: 'Documentation',
      description: 'AFFIDAVIT CERTIFICATES and all necessary legal documents'
    }
  ];

  const pricing = [
    {
      plan: 'Annual Payment',
      price: 'R12,000',
      description: 'Pay once per year and save',
      features: ['All services included', 'No monthly payments', 'Priority support']
    },
    {
      plan: 'Monthly Payment',
      price: 'R1,000/month',
      description: 'Flexible monthly payments',
      features: ['All services included', 'R2,000 deposit', 'Debit order convenience']
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 rounded-xl p-4 inline-flex">
              <img
                src={logoUrl}
                alt="APEX FINANCIAL HUB"
                width={150}
                height={60}
                className="rounded-lg object-cover"
              />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-primary-900 mb-4">Comprehensive Business Services</h2>
          <p className="text-xl text-primary-700 max-w-3xl mx-auto">
            Everything you need to start and maintain your business compliance in one package
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-primary-100 hover:border-primary-300 transform hover:-translate-y-2">
              <div className="text-5xl mb-6 text-center">{service.icon}</div>
              <h3 className="text-xl font-bold text-primary-900 mb-4 text-center">{service.title}</h3>
              <p className="text-primary-700 text-center leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div id="pricing" className="text-center">
          <h2 className="text-4xl font-bold text-primary-900 mb-4">Choose Your Payment Plan</h2>
          <p className="text-xl text-primary-700 mb-12">Flexible options to suit your business needs</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border-2 border-primary-200 hover:border-primary-400 transition-all transform hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-primary-900 mb-4">{plan.plan}</h3>
                <div className="text-4xl font-bold text-primary-600 mb-4">{plan.price}</div>
                <p className="text-primary-700 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-primary-700">
                      <span className="text-green-500 mr-2">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="text-sm text-primary-600 font-medium">* Service provider fees additional</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}