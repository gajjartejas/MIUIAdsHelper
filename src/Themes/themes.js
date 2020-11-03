const getThemes = () => {
  return [
    {id: 0, scheme: 'auto', name: 'Auto'},
    {id: 1, scheme: 'dark', name: 'Dark'},
    {id: 2, scheme: 'light', name: 'Light'},
  ];
};

module.exports = {
  getThemes,
};
