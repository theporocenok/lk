export default {
  set(form, inputs) {
    _.forEach(form, (item, key) => {
      const findFormInput = inputs.find(
        item => item.key === key
      );
      if (findFormInput) {
        form[key] = findFormInput.value;
      }
    });
  },
}
