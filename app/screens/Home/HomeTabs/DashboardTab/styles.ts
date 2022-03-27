import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flatlist: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  carouselContainer: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  headerImage: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'absolute',
  },
  section: { paddingHorizontal: 16 },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  listContainer: {
    paddingTop: 16,
  },
  headerDetailContainer: {
    paddingHorizontal: 16,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerDetailText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white'
  },
});

export default styles;
