import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

//ThirdParty
import { useTranslation } from 'react-i18next';
import { useTheme, Text } from 'react-native-paper';

const AppNoConnection = () => {
  //Const
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.error }]}>
      <Text style={[styles.titleTextStyle, { color: colors.onPrimary }]}>{t('general.noInternet')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleTextStyle: {
    fontSize: 14,
  },
});

export default memo(AppNoConnection);
