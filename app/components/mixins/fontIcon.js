// Pass this a unicode value, and it will return the corresponding FontAwesome icon
export const fontIcon = {
  methods: {
    icon(unicode) {
      return String.fromCharCode(`0x${unicode}`);
    },
  },
};
