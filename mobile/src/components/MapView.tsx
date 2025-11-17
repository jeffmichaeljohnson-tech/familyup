/**
 * FamilyUp Metal-Accelerated Map Component
 *
 * High-performance map visualization using Metal API via native bridge
 * Renders thousands of particles representing aggregate county data
 */

import React, {useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  requireNativeComponent,
  NativeModules,
  findNodeHandle,
} from 'react-native';
import {CountyData} from '../types';

const {MapRenderer} = NativeModules;
const MetalMapView = requireNativeComponent('MetalMapView');

interface MapViewProps {
  counties: CountyData[];
  onCountyPress?: (county: CountyData) => void;
  selectedCounty?: CountyData | null;
}

const MapView: React.FC<MapViewProps> = ({
  counties,
  onCountyPress,
  selectedCounty,
}) => {
  const mapViewRef = useRef(null);

  useEffect(() => {
    // Initialize Metal renderer with county data
    if (mapViewRef.current) {
      const nodeHandle = findNodeHandle(mapViewRef.current);
      if (nodeHandle) {
        MapRenderer.initializeRenderer(nodeHandle, counties);
      }
    }

    return () => {
      // Cleanup Metal resources
      if (mapViewRef.current) {
        const nodeHandle = findNodeHandle(mapViewRef.current);
        if (nodeHandle) {
          MapRenderer.cleanup(nodeHandle);
        }
      }
    };
  }, [counties]);

  useEffect(() => {
    // Update selected county highlight
    if (selectedCounty && mapViewRef.current) {
      const nodeHandle = findNodeHandle(mapViewRef.current);
      if (nodeHandle) {
        MapRenderer.highlightCounty(nodeHandle, selectedCounty.fips);
      }
    }
  }, [selectedCounty]);

  const handleCountyTap = (event: any) => {
    const {fips} = event.nativeEvent;
    const county = counties.find(c => c.fips === fips);
    if (county && onCountyPress) {
      onCountyPress(county);
    }
  };

  return (
    <View style={styles.container}>
      <MetalMapView
        ref={mapViewRef}
        style={styles.map}
        onCountyTap={handleCountyTap}
        enableParticles={true}
        enableGlow={true}
        quality="high"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapView;
