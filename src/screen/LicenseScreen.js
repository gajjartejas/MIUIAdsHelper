import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

//App Modules
import Config from '../config/index';
import Components from '../components/index';
import Themes from '../Themes/index';

function extractNameFromGithubUrl(url) {
  if (!url) {
    return null;
  }
  const reg = /((https?:\/\/)?(www\.)?github\.com\/)?(@|#!\/)?([A-Za-z0-9_]{1,15})(\/([-a-z]{1,20}))?/i;
  const components = reg.exec(url);
  if (components && components.length > 5) {
    return components[5];
  }
  return null;
}

function sortDataByKey(data, key) {
  data.sort(function (a, b) {
    return a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0;
  });
  return data;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let licenses = Object.keys(Config.Licenses).map((key) => {
  let {licenses, ...license} = Config.Licenses[key];
  let [name, version] = key.split('@');
  let username = extractNameFromGithubUrl(license.repository) || extractNameFromGithubUrl(license.licenseUrl);
  let userUrl;
  let image;
  if (username) {
    username = capitalizeFirstLetter(username);
    image = `https://github.com/${username}.png`;
    userUrl = `https://github.com/${username}`;
  }
  return {
    key,
    name,
    image,
    userUrl,
    username,
    licenses: licenses.slice(0, 405),
    version,
    ...license,
  };
});

sortDataByKey(licenses, 'username');

class LicenseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {visible: true};
    this.navigate = this.props.navigation;
  }
  render() {
    return (
      <View style={styles().container}>
        <Components.Licenses licenses={licenses} />
      </View>
    );
  }
}

const styles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Themes.getColors().COLOR_BLACK,
    },
  });

export default LicenseScreen;
