<template>
  <StackLayout>
    <Label :text="sectionName" class="h2" />
    <ListView
      for="item in menuItemsForSection"
      class="list-group"
      @itemTap="onItemTap"
    >
      <v-template>
        <GridLayout class="list-group-item">
          <Label :text="item.Button_Text" />
        </GridLayout>
      </v-template>
    </ListView>
  </StackLayout>
</template>

<script>
export default {
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
    onItemTap(e) {
      console.log('do not');
      this.$emit('go-to-page', e.item.Button_URL);
    },
  },
};
</script>

<style>
.section-name {
  margin-top: 24;
  margin-left: 16;
  font-size: 24;
  font-weight: bold;
}

.list-item {
  padding: 15;
  width: 100%;
  margin-bottom: 10;
  background-color: white;
}
</style>
