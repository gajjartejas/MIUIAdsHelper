import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal, Text, useTheme } from 'react-native-paper';
import { AppTheme } from 'app/models/theme';

interface IProcessingOverlayProps {
  visible: boolean;
  message?: string;
}

const ProcessingOverlay = ({ visible, message }: IProcessingOverlayProps) => {
  const { colors } = useTheme<AppTheme>();

  if (!visible) {
    return null;
  }

  return (
    <Portal>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          {!!message && (
            <Text variant="bodyMedium" style={[styles.text, { color: colors.text }]}>
              {message}
            </Text>
          )}
        </View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  card: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
    maxWidth: '80%',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  text: {
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default memo(ProcessingOverlay);
