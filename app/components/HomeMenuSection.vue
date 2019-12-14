<template>
  <StackLayout width="90%" paddingBottom="15">
    <Label
      :text="sectionName"
      class="m-b-15 font-weight-bold uppercase"
      opacity="0.6"
    />
    <StackLayout
      v-for="item in menuItemsForSection"
      :key="item.Button_URL"
      @tap="onItemTap(item)"
    >
      <FlexboxLayout justifyContent="space-between" alignItems="center">
        <Label :text="item.Button_Text" />
        <Label :text="fontIcon('f105')" class="fas p-r-10" opacity="0.6" />
      </FlexboxLayout>
      <StackLayout
        height="1"
        width="100%"
        backgroundColor="lightgray"
        class="m-y-15"
      />
    </StackLayout>
  </StackLayout>
</template>

<script>
import { fontIcon } from './mixins/fontIcon';

export default {
  mixins: [fontIcon],

  props: {
    sectionName: {
      type: String,
      required: true,
    },
    allMenuItems: {
      type: Array,
      required: true,
    },
  },

  computed: {
    // Filter the array to include only those items that are in the current section
    menuItemsForSection() {
      return this.allMenuItems.filter(
        menuItem => menuItem.Button_Section === this.sectionName
      );
    },
  },

  methods: {
    // Tell parent to load WebView for the given URL
    onItemTap(item) {
      this.$emit('go-to-page', item.Button_URL, item.Button_Text);
    },
  },
};
</script>

<style scoped></style>
