/**
 * FamilyUp Statistics Panel Component
 *
 * Displays state and county statistics
 */

import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {CountyData, StateSummary} from '../types';

interface StatisticsPanelProps {
  stateSummary: StateSummary;
  selectedCounty: CountyData | null;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  stateSummary,
  selectedCounty,
}) => {
  return (
    <View style={styles.container}>
      {/* Mission Statement */}
      <View style={styles.missionCard}>
        <Text style={styles.missionTitle}>Our Mission</Text>
        <Text style={styles.missionText}>
          Dramatize the vast number of children in Michigan's foster care system
          to increase awareness and drive adoptions, while maintaining complete
          privacy and legal compliance.
        </Text>
      </View>

      {/* State Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>STATEWIDE STATISTICS</Text>

        <View style={[styles.statCard, styles.statCardRed]}>
          <Text style={styles.statNumber}>
            {stateSummary.totalChildren.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>
            Children in Michigan foster care
          </Text>
        </View>

        <View style={[styles.statCard, styles.statCardOrange]}>
          <Text style={styles.statNumber}>
            {stateSummary.waitingAdoption.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>
            Waiting for adoption without identified families
          </Text>
        </View>

        <View style={[styles.statCard, styles.statCardGreen]}>
          <Text style={styles.statNumber}>
            {stateSummary.adoptionsThisYear.toLocaleString()}+
          </Text>
          <Text style={styles.statLabel}>Successful adoptions last year</Text>
        </View>
      </View>

      {/* Selected County Info */}
      {selectedCounty && (
        <View style={[styles.statCard, styles.statCardPurple]}>
          <Text style={styles.countyTitle}>{selectedCounty.name}</Text>
          <Text style={styles.countyDetail}>
            <Text style={styles.countyLabel}>Total in Care: </Text>
            {selectedCounty.totalChildren.toLocaleString()}
          </Text>
          <Text style={styles.countyDetail}>
            <Text style={styles.countyLabel}>Waiting for Adoption: </Text>
            {selectedCounty.waitingAdoption.toLocaleString()}
          </Text>
          <View style={styles.ageBreakdown}>
            <Text style={styles.ageBreakdownTitle}>Age Breakdown:</Text>
            <Text style={styles.ageBreakdownItem}>
              • Ages 0-5: {selectedCounty.ageBreakdown['0-5']}
            </Text>
            <Text style={styles.ageBreakdownItem}>
              • Ages 6-10: {selectedCounty.ageBreakdown['6-10']}
            </Text>
            <Text style={styles.ageBreakdownItem}>
              • Ages 11-17: {selectedCounty.ageBreakdown['11-17']}
            </Text>
          </View>
        </View>
      )}

      {/* Info Card */}
      <View style={[styles.statCard, styles.statCardYellow]}>
        <Text style={styles.infoTitle}>💡 Did You Know?</Text>
        <Text style={styles.infoText}>
          Adopting from foster care costs <Text style={styles.bold}>$0-$150</Text>.
          Most families receive{' '}
          <Text style={styles.bold}>$500-$700/month</Text> in financial support.
          Anyone 18+ can adopt!
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  missionCard: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: 8,
  },
  missionText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4b5563',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  statCard: {
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 12,
  },
  statCardRed: {
    backgroundColor: '#fef2f2',
    borderLeftColor: '#dc2626',
  },
  statCardOrange: {
    backgroundColor: '#fff7ed',
    borderLeftColor: '#f97316',
  },
  statCardGreen: {
    backgroundColor: '#f0fdf4',
    borderLeftColor: '#16a34a',
  },
  statCardPurple: {
    backgroundColor: '#faf5ff',
    borderLeftColor: '#9333ea',
  },
  statCardYellow: {
    backgroundColor: '#fefce8',
    borderLeftColor: '#eab308',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 4,
  },
  countyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#581c87',
    marginBottom: 8,
  },
  countyDetail: {
    fontSize: 13,
    color: '#6b21a8',
    marginBottom: 4,
  },
  countyLabel: {
    fontWeight: '600',
  },
  ageBreakdown: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9d5ff',
  },
  ageBreakdownTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b21a8',
    marginBottom: 4,
  },
  ageBreakdownItem: {
    fontSize: 12,
    color: '#7c3aed',
    marginBottom: 2,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#854d0e',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#713f12',
    lineHeight: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default StatisticsPanel;
