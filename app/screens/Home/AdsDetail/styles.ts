import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parallexContainerView: {
    flex: 1,
    marginTop: 20,
    width: '100%',
  },
  adsDetailDescText: {
    marginHorizontal: 20,
    fontSize: 30,
    marginTop: 20,
    fontWeight: 'bold',
  },
  detailText: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: '400',
    marginTop: 4,
  },
  stepsText: {
    marginHorizontal: 20,
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  stepsDescText: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: '400',
    marginTop: 4,
  },
  openSettingsButton: {
    fontSize: 20,
    borderWidth: 1,
    margin: 10,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openSettingsButtonText: {
    fontSize: 18,
    fontWeight: '500',
    margin: 10,
    textAlign: 'center',
  },
  specialNoteText: {
    fontSize: 14,
    fontWeight: '400',
    margin: 10,
    alignSelf: 'center',
  },
  headerContainer: {
    height: Dimensions.get('screen').height * 0.3,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButton: {
    marginTop: 32,
    marginHorizontal: 36,
  },
  bottomButtonLabel: {
    color: 'white',
  },
  bannerContainer: {
    paddingLeft: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer1: {

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 12,
    color: 'white',
    flex: 1,
    lineHeight: 16,
  },
});

export default styles;
