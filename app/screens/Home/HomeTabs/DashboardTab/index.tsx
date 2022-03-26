import React from 'react';
import { View, FlatList } from 'react-native';

//ThirdParty
import { Appbar } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

//App modules
import Components from 'app/components';
import styles from './styles';
import useGetSettingActivities from 'app/config/miui-setting-activities';
import { IAdsActivity } from 'app/components/AdsListItem';
import Utils from 'app/utils';
import IState from 'app/models/models/appState';
import { useSelector } from 'react-redux';

//Params
type RootStackParamList = {
  DashboardTab: { userId: string };
  AdsDetail: { item: IAdsActivity };
  Purchase: {};
};
type Props = NativeStackScreenProps<RootStackParamList, 'DashboardTab'>;

const DashboardTab = ({ navigation }: Props) => {
  //Refs

  //Actions
  const purchased = useSelector((state: IState) => state.appConfigReducer.purchased);

  //Constants
  const { colors } = useTheme();
  const entries = useGetSettingActivities();
  const { t } = useTranslation();

  //States

  const cardTapped = (item: IAdsActivity, _index: number) => {
    Utils.rateApp.saveItem(item);
    navigation.navigate('AdsDetail', { item: item });
  };

  const renderItem = ({ item, index }: { item: IAdsActivity; index: number }) => {
    return <Components.AdsListItem item={item} index={index} onPress={cardTapped} />;
  };

  const onPressMore = () => {
    navigation.navigate('Purchase', {});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.background }}>
        <Appbar.Content title={t('APPNAME')} />
        {!purchased && <Appbar.Action icon={'lock'} onPress={onPressMore} />}
      </Appbar.Header>
      <View style={styles.carouselContainer}>
        <FlatList
          style={styles.flatlist}
          data={entries}
          keyExtractor={(item, _index) => item.id.toString()}
          renderItem={renderItem}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 16 }}
          numColumns={2}
        />
      </View>
    </View>
  );
};

export default DashboardTab;
