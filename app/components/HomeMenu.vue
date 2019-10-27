<template>
  <Page>
    <ActionBar title="Home Menu" class="action-bar">
      <!-- Hide the "Go Back" button -->
      <NavigationButton visibility="collapse" />

      <ActionItem
        ios.systemIcon="16"
        ios.position="right"
        text="Sign Out"
        @tap="signOut"
      />
    </ActionBar>

    <!--
    <StackLayout width="90%">
      <FlexboxLayout class="home-menu-item h2">
        <Label :text="fontIcon('f1ad')" class="far p-r-15" />
        <Label text="My Event" />
      </FlexboxLayout>

      <FlexboxLayout class="home-menu-item h2">
        <Label :text="fontIcon('f1ad')" class="far p-r-15" />
        <Label text="My Event" />
      </FlexboxLayout>
    </StackLayout>
    -->

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

import { fontIcon } from './mixins/fontIcon';

export default {
  mixins: [fontIcon],

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
    events() {
      return this.menuItems.filter(
        item => item.Button_Section === 'Your Events'
      );
    },

    // Loop through the menu items that are available to the user and extract an array of
    // unique button sections. We'll use these to loop over each section and get the
    // menu items within that section.
    sections() {
      const sections = [
        ...new Set(this.menuItems.map(menuItem => menuItem.Button_Section)),
      ];

      return sections;

      // Don't return 'Your Events' since those get their own special treatment
      // return sections.filter(section => section !== 'Your Events');
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

    // This will open the URL in a WebView when a button is tapped inside the
    // HomeMenuSection child component
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

<style scoped>
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
