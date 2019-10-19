<template>
  <Page>
    <ActionBar :title="`Home Menu for ${pin}`" class="action-bar">
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
      <ActionItem
        ios.systemIcon="16"
        ios.position="right"
        text="Sign Out"
        @tap="signOut"
      />
    </ActionBar>
    <StackLayout>
      <HomeMenuSection
        v-for="section in sections"
        :key="section"
        :section-name="section"
        :all-menu-items="menuItems"
        @go-to-page="goToPage"
      />
    </StackLayout>
  </Page>
</template>

<script>
const appSettings = require('application-settings');
const httpModule = require('tns-core-modules/http');

import HomeMenuSection from './HomeMenuSection';
import SelectLogInType from './SelectLogInType';
import WebViewContainer from './WebViewContainer';

export default {
  components: {
    HomeMenuSection,
    SelectLogInType,
    WebViewContainer,
  },

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

  computed: {
    // Loop through the menu items that are available to the user and extract an array of unique button sections
    sections() {
      const sections = [
        ...new Set(this.menuItems.map(menuItem => menuItem.Button_Section)),
      ];

      return sections;
    },
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
      this.$navigateTo(WebViewContainer, {
        props: {
          url: `https://www.eeds.com/${url}`,
        },
      });
    },

    signOut() {
      appSettings.remove('pin');

      this.$navigateTo(SelectLogInType);
    },
  },
};
</script>

<style></style>
