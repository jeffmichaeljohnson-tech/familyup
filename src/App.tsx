/**
 * FamilyUp Main Application
 *
 * Michigan Foster Care Awareness Platform
 * Multi-platform deployment: Web + iOS
 *
 * PRIVACY: All visualizations use aggregate county data only
 * LEGAL: Compliant with COPPA, FERPA, HIPAA, Michigan state laws
 */

import { useState } from 'react';
import { GraphicsToggle } from './components/GraphicsToggle';
import { michiganCounties, stateSummary } from './data/countyData';
import { CountyData } from './types';
import { debugLog } from './utils/debugLog';
import './styles/index.css';

function App() {
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);

  // Debug: Log county count
  debugLog(`App loaded with ${michiganCounties.length} counties`);
  debugLog('First 5 counties', michiganCounties.slice(0, 5).map(c => ({ name: c.name, lat: c.lat, lng: c.lng })));

  const handleCountyClick = (county: CountyData) => {
    setSelectedCounty(county);
    console.log('Selected county:', county.name);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-blue to-brand-light text-white py-4 px-6 shadow-lg z-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold">
            FamilyUp
          </h1>
          <p className="text-sm md:text-base opacity-90 mt-1">
            Michigan Foster Care Awareness Platform - Dramatizing the Scale of Children in Need
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative">
          <GraphicsToggle
            counties={michiganCounties}
            onCountyClick={handleCountyClick}
          />
        </div>

        {/* Sidebar */}
        <aside className="w-full md:w-96 bg-white shadow-xl overflow-y-auto custom-scrollbar z-10">
          <div className="p-6 space-y-6">
            {/* Mission Statement */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <h2 className="text-lg font-bold text-blue-900 mb-2">Our Mission</h2>
              <p className="text-sm text-blue-800 leading-relaxed">
                Dramatize the vast number of children in Michigan's foster care system
                to increase awareness and drive adoptions, while maintaining complete privacy
                and legal compliance.
              </p>
            </div>

            {/* State Statistics */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Statewide Statistics
              </h2>

              <div className="bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 p-4 rounded-r-lg">
                <h3 className="text-3xl font-bold text-red-900">
                  {stateSummary.totalChildren.toLocaleString()}
                </h3>
                <p className="text-sm text-red-800 mt-1">
                  Children in Michigan foster care
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <h3 className="text-3xl font-bold text-orange-900">
                  {stateSummary.waitingAdoption.toLocaleString()}
                </h3>
                <p className="text-sm text-orange-800 mt-1">
                  Waiting for adoption without identified families
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 p-4 rounded-r-lg">
                <h3 className="text-3xl font-bold text-green-900">
                  {stateSummary.adoptionsThisYear.toLocaleString()}+
                </h3>
                <p className="text-sm text-green-800 mt-1">
                  Successful adoptions last year
                </p>
              </div>
            </div>

            {/* Selected County Info */}
            {selectedCounty && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 p-4 rounded-r-lg slide-up">
                <h2 className="text-lg font-bold text-purple-900 mb-2">
                  {selectedCounty.name}
                </h2>
                <div className="space-y-2 text-sm text-purple-800">
                  <p>
                    <strong>Total in Care:</strong> {selectedCounty.totalChildren.toLocaleString()}
                  </p>
                  <p>
                    <strong>Waiting for Adoption:</strong> {selectedCounty.waitingAdoption.toLocaleString()}
                  </p>
                  <div className="mt-3">
                    <p className="font-semibold mb-1">Age Breakdown:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ages 0-5: {selectedCounty.ageBreakdown['0-5']}</li>
                      <li>Ages 6-10: {selectedCounty.ageBreakdown['6-10']}</li>
                      <li>Ages 11-17: {selectedCounty.ageBreakdown['11-17']}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Important Info */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <h2 className="text-sm font-semibold text-yellow-900 mb-2">
                💡 Did You Know?
              </h2>
              <p className="text-sm text-yellow-800 leading-relaxed">
                Adopting from foster care costs <strong>$0-$150</strong>.
                Most families receive <strong>$500-$700/month</strong> in financial support.
                Anyone 18+ can adopt!
              </p>
            </div>

            {/* Call to Action */}
            <a
              href="tel:1-800-589-6273"
              className="block w-full bg-gradient-to-r from-red-600 to-red-500 text-white text-center py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              📞 Contact MARE Today
              <div className="text-sm font-normal opacity-90 mt-1">
                1-800-589-MARE (6273)
              </div>
            </a>

            {/* Legal Compliance Notice */}
            <div className="border-t pt-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>Privacy & Legal Compliance:</strong> This platform displays
                aggregate county-level statistics only. No individual child information,
                exact locations, or personally identifiable data is shown. Fully compliant
                with COPPA, FERPA, HIPAA, and Michigan state privacy laws.
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Data source: Michigan DHHS, AFCARS FY 2023
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-3 px-6 text-center text-sm z-20">
        <p>
          Every child deserves a loving, permanent home.
          <span className="mx-2">•</span>
          Built with privacy & compassion
          <span className="mx-2">•</span>
          © 2025 FamilyUp
        </p>
      </footer>
    </div>
  );
}

export default App;
