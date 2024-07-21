import React, { memo } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

//Third Party
import Icon from 'react-native-easy-icon';
import { IconType } from 'react-native-easy-icon/src/Icon';
import { Product } from 'react-native-iap';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

//App Modules
import { AppTheme } from 'app/models/theme';

//Interface
export interface IProduct extends Product {
  id: number;
  iconBackgroundColor: string;
  iconName: string;
  iconFamily: IconType;
  name: string;
  subtitle: string;
}

interface IAdsListItem {
  item: IProduct;
  index: number;
  onPress: (item: IProduct, index: number) => void;
}

const PurchaseListItem = (props: IAdsListItem) => {
  //Const
  const { colors } = useTheme<AppTheme>();
  const { item, index } = props;
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        props.onPress(item, index);
      }}
      style={[styles.container, { backgroundColor: `${colors.onBackground}20`, shadowColor: colors.background }]}>
      <Icon type={item.iconFamily} name={item.iconName} color={item.iconBackgroundColor} size={24} />
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={[styles.titleText, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text numberOfLines={2} style={[styles.subtitleText, { color: `${colors.text}60` }]}>
          {item.subtitle}
        </Text>
        <Text numberOfLines={2} style={[styles.subtitleText, { color: `${colors.text}60` }]}>
          {item.localizedPrice}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          props.onPress(item, index);
        }}
        style={styles.buyButton}>
        <Text style={[styles.buyTextButton, { color: colors.primary }]}>{t('iap_buy')}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 18,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 8,
    shadowOpacity: 1.0,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  subtitleText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  textContainer: {
    marginHorizontal: 20,
    flex: 1,
  },
  buyButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buyTextButton: {
    fontSize: 14,
    fontWeight: '800',
  },
});

export default memo(PurchaseListItem);
