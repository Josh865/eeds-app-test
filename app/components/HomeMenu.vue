<template>
  <Page>
    <ActionBar title="Home Menu" class="action-bar" color="white">
      <!-- Hide the "Go Back" button -->
      <NavigationButton visibility="collapse" />

      <ActionItem ios.position="right" text="Sign Out" @tap="signOut" />
    </ActionBar>

    <ScrollView>
      <StackLayout>
        <!-- This section is for the user's events. It's singled out and emphasized at
        the top of the stack. -->
        <StackLayout
          v-if="events.length > 0"
          backgroundColor="#c3dfff"
          class="m-b-20 p-y-20"
        >
          <StackLayout width="90%">
            <Label
              text="YOUR EVENTS"
              class="font-weight-bold"
              color="#0a4f9a"
              opacity="0.7"
            />
            <StackLayout>
              <FlexboxLayout
                v-for="event in events"
                :key="event.Button_URL"
                @tap="goToPage(event.Button_URL)"
              >
                <Label :text="event.Button_Text" class="h2" color="#0a4f9a" />
              </FlexboxLayout>
            </StackLayout>
          </StackLayout>
        </StackLayout>

        <!-- Other options go here, below the user's events -->
        <StackLayout class="m-t-10">
          <HomeMenuSection
            v-for="section in sections"
            :key="section"
            :section-name="section"
            :all-menu-items="menuItems"
            @go-to-page="goToPage"
          />
        </StackLayout>
      </StackLayout>
    </ScrollView>
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

      // Don't return 'Your Events' since those get their own special treatment
      return sections.filter(section => section !== 'Your Events');
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
    goToPage(url, title = 'eeds') {
      this.$navigateTo(WebViewContainer, {
        props: {
          url: `https://www.eeds.com/${url}`,
          title,
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

<style scoped></style>
