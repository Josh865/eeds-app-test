// Pass this a unicode value, and it will return the corresponding FontAwesome icon
export const fontIcon = {
  methods: {
    fontIcon(unicode) {
      return String.fromCharCode(`0x${unicode}`);
    },
  },
};
