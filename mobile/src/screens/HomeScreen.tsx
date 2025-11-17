/**
 * FamilyUp Home Screen
 *
 * Main screen with Metal-accelerated map visualization
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import MapView from '../components/MapView';
import StatisticsPanel from '../components/StatisticsPanel';
import {CountyData} from '../types';
import {michiganCounties, stateSummary} from '../data/countyData';

const HomeScreen: React.FC = () => {
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);

  const handleCountyPress = (county: CountyData) => {
    setSelectedCounty(county);
  };

  const handleCallMARE = () => {
    Linking.openURL('tel:18005896273');
  };

  return (
    <View style={styles.container}>
      {/* Map View with Metal Rendering */}
      <View style={styles.mapContainer}>
        <MapView
          counties={michiganCounties}
          onCountyPress={handleCountyPress}
          selectedCounty={selectedCounty}
        />
      </View>

      {/* Statistics Panel */}
      <ScrollView style={styles.sidebar}>
        <StatisticsPanel
          stateSummary={stateSummary}
          selectedCounty={selectedCounty}
        />

        {/* Call to Action */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleCallMARE}
          activeOpacity={0.8}>
          <Text style={styles.ctaText}>📞 Contact MARE Today</Text>
          <Text style={styles.ctaSubtext}>1-800-589-MARE (6273)</Text>
        </TouchableOpacity>

        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyTitle}>Privacy & Legal Compliance</Text>
          <Text style={styles.privacyText}>
            This app displays aggregate county-level statistics only. No
            individual child information, exact locations, or personally
            identifiable data is shown. Fully compliant with COPPA, FERPA,
            HIPAA, and Michigan state privacy laws.
          </Text>
          <Text style={styles.dataSource}>
            Data source: Michigan DHHS, AFCARS FY 2023
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  mapContainer: {
    flex: 1,
    minHeight: 300,
  },
  sidebar: {
    maxHeight: '40%',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  ctaButton: {
    margin: 16,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ctaSubtext: {
    color: '#ffffff',
    fontSize: 14,
    marginTop: 4,
    opacity: 0.9,
  },
  privacyNotice: {
    margin: 16,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  privacyTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 11,
    color: '#4b5563',
    lineHeight: 16,
    marginBottom: 8,
  },
  dataSource: {
    fontSize: 10,
    color: '#6b7280',
  },
});

export default HomeScreen;
