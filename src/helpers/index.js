export const transformDataToSelector = (data) => {
  return data
    .filter((s) => s.name)
    .map((state) => ({
      key: state.name,
      text: state.name,
      value: state.name,
    }));
};
