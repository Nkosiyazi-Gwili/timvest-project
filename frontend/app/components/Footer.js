export default function Footer() {
  const logoUrl = 'https://i.postimg.cc/ZRSDXsHV/Whats-App-Image-2025-11-06-at-15-43-48-d0cd4c60.jpg';

  return (
    <footer className="bg-primary-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-primary-700 rounded-lg p-2 flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt="APEX FINANCIAL HUB"
                  width={80}
                  height={35}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="h-8 w-px bg-primary-700"></div>
              <div className="flex flex-col">
                <div className="text-xl font-bold text-white">TIMVEST</div>
                <div className="text-xs text-primary-300">in partnership</div>
              </div>
            </div>
            <p className="text-primary-200 mb-4">
              Professional business setup and compliance services in partnership with APEX FINANCIAL HUB.
            </p>
            <div className="text-primary-300">© 2024 TIMVEST. All rights reserved.</div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary-100">Contact Info</h3>
            <ul className="space-y-2 text-primary-300">
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <span>+27 (0) 100 3000 80</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📱</span>
                <span>+27 84 852 5304</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✉️</span>
                <span>chairman@timvest.co.za</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>✉️</span>
                <span>finance@timvest.co.za</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-primary-100">Quick Links</h3>
            <ul className="space-y-2 text-primary-300">
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/admin" className="hover:text-white transition-colors">Admin Portal</a></li>
              <li><a href="tel:+27100300080" className="hover:text-white transition-colors">Emergency Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-800 mt-8 pt-8 text-center text-primary-300">
          <p>TIMVEST is a registered financial services provider. All investments involve risk.</p>
        </div>
      </div>
    </footer>
  );
}