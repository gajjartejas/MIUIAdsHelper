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
  whiteSectionHeader: {
    color: 'white',
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
    paddingHorizontal: 14,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
  },
  headerDetailText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
  searchTextInputText: {
    fontSize: 16,
    flex: 1,
  },
  searchContainer: { flex: 1, height: 50, borderRadius: 25, overflow: 'hidden', flexDirection: 'row' },
  leftSearchButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSearchButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    marginTop: 16,
    paddingLeft: 16,
    paddingVertical: 4,
    marginHorizontal: 16,
    flexDirection: 'row',
    borderRadius: 8,
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
