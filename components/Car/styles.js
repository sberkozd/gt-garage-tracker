import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 20,
    margin: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  chip: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  drivetrain: {
    fontWeight: 'bold',
    marginLeft: 20,
  },
  limitedStockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  limitedStockText: {
    color: 'red',
    marginLeft: 5,
  },
  creditContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  creditLabel: {
    color: 'gray',
  },
  credit: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
});

export default styles;