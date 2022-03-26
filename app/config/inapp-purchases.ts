//ThirdParty
import { IProduct } from 'app/components/PurchaseListItem';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';

const useInappPurchases = (): IProduct[] => {
  //Constants
  const { t } = useTranslation();
  const { colors } = useTheme();

  return [
    {
      id: 0,
      iconName: 'coffee',
      iconFamily: 'font-awesome',
      iconBackgroundColor: colors.primary,
      name: t('iap_item_1'),
      subtitle: t('iap_item_1_desc'),
      localizedPrice: '...',
      productId: 'com.tejasgajjar.miuiadshelper.item1',
      type: 'iap',
      title: '',
      description: '',
      price: '',
      currency: '',
    },
    {
      id: 1,
      iconName: 'pizza',
      iconFamily: 'material-community',
      iconBackgroundColor: colors.primary,
      name: t('iap_item_2'),
      subtitle: t('iap_item_2_desc'),
      localizedPrice: '...',
      productId: 'com.tejasgajjar.miuiadshelper.item2',
      type: 'iap',
      title: '',
      description: '',
      price: '',
      currency: '',
    },

    {
      id: 2,
      iconName: 'food-bank',
      iconFamily: 'material',
      iconBackgroundColor: colors.primary,
      name: t('iap_item_3'),
      subtitle: t('iap_item_3_desc'),
      localizedPrice: '...',
      productId: 'com.tejasgajjar.miuiadshelper.item3',
      type: 'iap',
      title: '',
      description: '',
      price: '',
      currency: '',
    },
    {
      id: 3,
      iconName: 'emoji-emotions',
      iconFamily: 'material',
      iconBackgroundColor: colors.primary,
      name: t('iap_item_4'),
      subtitle: t('iap_item_4_desc'),
      localizedPrice: '...',
      productId: 'com.tejasgajjar.miuiadshelper.item4',
      type: 'iap',
      title: '',
      description: '',
      price: '',
      currency: '',
    },
  ];
};

export default useInappPurchases;
