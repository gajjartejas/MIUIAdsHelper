import React, {Component} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import LicensesListItem from './LicensesListItem';

export default class Licenses extends Component {
  renderItem = ({item}) => <LicensesListItem {...item} />;
  render() {
    const {licenses} = this.props;
    return <FlatList style={styles().list} keyExtractor={({key}) => key} data={licenses} renderItem={this.renderItem} />;
  }
}

const styles = () =>
  StyleSheet.create({
    list: {
      flex: 1,
    },
  });
