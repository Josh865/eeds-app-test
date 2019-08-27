<template>
  <Page>
    <ActionBar :title="`Home Menu for ${pin}`">
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
    </ActionBar>
    <ListView for="item in menuItems" @itemTap="onItemTap">
      <v-template>
        <Label :text="item.Button_Text" />
      </v-template>
    </ListView>
  </Page>
</template>

<script>
const httpModule = require('tns-core-modules/http');

export default {
  props: {
    pin: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      menuItems: [],
    };
  },

  created() {
    this.fetchHomeMenuItems();
  },

  methods: {
    fetchHomeMenuItems() {
      httpModule
        .getJSON(
          `https://www.eeds.com/ajax_functions.aspx?Function_ID=138&PIN=${this.pin}`
        )
        .then(response => {
          if (response.Error_Message !== '') {
            alert(response.Error_Message);
            return;
          }

          this.menuItems = response.Menu_Item_Array;
        });
    },

    // This will open the URL in a WebView when a button is tapped inside the HomeMenuSection child component
    goToPage(url) {
      // this.$navigateTo(this.webViewPage, {
      //   props: {
      //     url: `https://www.eeds.com/${url}`,
      //   },
      // });
    },

    onItemTap(item) {
      alert(item);
    },
  },
};
</script>

<style></style>
