/**
 * FamilyUp Main Application
 *
 * Michigan Foster Care Awareness Platform
 * Multi-platform deployment: Web + iOS
 *
 * PRIVACY: All visualizations use aggregate county data only
 * LEGAL: Compliant with COPPA, FERPA, HIPAA, Michigan state laws
 */

import { useState, useCallback } from 'react';
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

  const handleCountyClick = useCallback((county: CountyData) => {
    setSelectedCounty(county);
    console.log('Selected county:', county.name);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 via-blue-800 to-purple-900 text-white py-6 px-6 shadow-2xl z-20 border-b border-indigo-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                FamilyUp
              </h1>
              <p className="text-sm md:text-base text-blue-100 mt-2 font-medium">
                Michigan Foster Care Awareness Platform - Dramatizing the Scale of Children in Need
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-blue-100">
              <div className="text-right">
                <div className="text-2xl font-bold">13,596</div>
                <div className="text-xs opacity-75">Children in Care</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 relative min-h-[50vh] lg:min-h-full">
          <GraphicsToggle
            counties={michiganCounties}
            onCountyClick={handleCountyClick}
          />
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-96 xl:w-[28rem] bg-white/95 backdrop-blur-sm shadow-2xl overflow-y-auto custom-scrollbar z-10 border-t lg:border-t-0 lg:border-l border-gray-200/50 max-h-[50vh] lg:max-h-full">
          <div className="p-6 md:p-8 space-y-8">
            {/* Mission Statement */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 p-8 rounded-2xl shadow-lg text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">🎯</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Our Mission</h2>
              <p className="text-base text-blue-800 leading-relaxed max-w-sm mx-auto">
                Dramatize the vast number of children in Michigan's foster care system
                to increase awareness and drive adoptions, while maintaining complete privacy
                and legal compliance.
              </p>
            </div>

            {/* State Statistics */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">📊</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Statewide Statistics
                </h2>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">👥</span>
                  </div>
                </div>
                <h3 className="text-5xl font-black text-red-900 tracking-tight mb-4">
                  {stateSummary.totalChildren.toLocaleString()}
                </h3>
                <p className="text-base text-red-800 font-medium max-w-xs mx-auto leading-relaxed">
                  Children in Michigan foster care
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">⏳</span>
                  </div>
                </div>
                <h3 className="text-5xl font-black text-orange-900 tracking-tight mb-4">
                  {stateSummary.waitingAdoption.toLocaleString()}
                </h3>
                <p className="text-base text-orange-800 font-medium max-w-xs mx-auto leading-relaxed">
                  Waiting for adoption without identified families
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">🏠</span>
                  </div>
                </div>
                <h3 className="text-5xl font-black text-green-900 tracking-tight mb-4">
                  {stateSummary.adoptionsThisYear.toLocaleString()}+
                </h3>
                <p className="text-base text-green-800 font-medium max-w-xs mx-auto leading-relaxed">
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
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 p-8 rounded-2xl shadow-lg text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">💡</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-yellow-900 mb-6">
                Did You Know?
              </h2>
              <p className="text-base text-yellow-800 leading-relaxed max-w-sm mx-auto">
                Adopting from foster care costs <strong>$0-$150</strong>.
                Most families receive <strong>$500-$700/month</strong> in financial support.
                Anyone 18+ can adopt!
              </p>
            </div>

            {/* Call to Action */}
            <a
              href="tel:1-800-589-6273"
              className="block w-full bg-gradient-to-r from-red-600 via-red-500 to-pink-600 text-white text-center py-6 px-6 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-red-400 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <span className="text-2xl">📞</span>
                  <span>Contact MARE Today</span>
                </div>
                <div className="text-base font-semibold text-red-100">
                  1-800-589-MARE (6273)
                </div>
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
      <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white py-4 px-6 text-center text-sm z-20 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <p className="flex items-center justify-center space-x-2 text-gray-300">
            <span>Every child deserves a loving, permanent home.</span>
            <span className="text-gray-600">•</span>
            <span>Built with privacy & compassion</span>
            <span className="text-gray-600">•</span>
            <span>© 2025 FamilyUp</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
