<template>
  <StackLayout width="90%" paddingBottom="15">
    <Label :text="sectionName" class="h2" />
    <FlexboxLayout
      v-for="item in menuItemsForSection"
      class="home-menu-item"
      @tap="onItemTap(item)"
    >
      <!-- <Label :text="fontIcon('f061')" class="far p-r-10" /> -->
      <Label text="➜" class="p-r-10" />
      <Label :text="item.Button_Text" />
    </FlexboxLayout>
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
    // Emit an event instructing the parent component to load a Web View pointing to the specified URL
    onItemTap(item) {
      this.$emit('go-to-page', item.Button_URL);
    },
  },
};
</script>

<style>
.home-menu-item {
  align-items: center;
  margin-top: 10;
  padding: 20;
  border-width: 1;
  border-radius: 10;
  border-color: lightgray;
  background-color: white;
}
</style>
