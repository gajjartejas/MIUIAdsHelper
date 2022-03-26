import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flatlist: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    paddingVertical: 16,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
    textAlign: 'center',
  },
  descText: {
    fontSize: 14,
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 30,
  },
  activityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
