<template>
  <Page>
    <ActionBar :title="`Log In with ${selectedLogInType.label}`">
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
    </ActionBar>

    <StackLayout class="form">
      <StackLayout class="input-field">
        <TextField
          v-model="value"
          :hint="selectedLogInType.label"
          :autocorrect="false"
          class="input"
        />
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>

      <StackLayout class="input-field">
        <TextField
          v-model="password"
          :secure="true"
          hint="Password"
          class="input"
        />
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>

      <Button
        text="Log In"
        class="btn btn-primary"
        marginTop="15"
        @tap="logIn"
      />

      <Button
        text="Forgot Password?"
        class="btn btn-outline btn-rounded-sm"
        @tap="logIn"
      />
    </StackLayout>
  </Page>
</template>

<script>
const appSettings = require('application-settings');
const httpModule = require('tns-core-modules/http');

import HomeMenuPage from './HomeMenu';

export default {
  components: {
    HomeMenuPage,
  },

  props: {
    type: {
      type: String,
      default: 'pin',
    },
  },

  data() {
    return {
      busy: false,
      value: '',
      password: '',
      availableLogInTypes: {
        pin: {
          label: 'PIN',
          url: 'https://www.eeds.com/ajax_functions.aspx?Function_ID=5&PIN=',
        },
        email: {
          label: 'Email Address',
          url:
            'https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Email_Address=',
        },
        phone: {
          label: 'Phone Number',
          url:
            'https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Phone_Number=',
        },
      },
    };
  },

  computed: {
    selectedLogInType() {
      return this.availableLogInTypes[this.type];
    },

    logInUrl() {
      return this.selectedLogInType.url + this.value;
    },
  },

  methods: {
    async logIn() {
      this.busy = true;

      // Before proceeding, make sure the data the user entered is valid.
      const isValid = await this.validate();

      if (!isValid) {
        alert(`Please enter your ${this.selectedLogInType.label}`);
        return;
      }

      httpModule.getJSON(this.logInUrl).then(
        response => {
          this.busy = false;

          if (response.PIN_Status !== true) {
            alert('The PIN you entered could not be found.');
            return;
          }

          // Store the user's PIN so they won't have to enter it next time
          appSettings.setString('pin', response.PIN);

          this.$navigateTo(HomeMenuPage, {
            props: {
              pin: response.PIN,
            },
          });
        },
        error => {
          alert(error);
          this.busy = false;
        }
      );
    },

    validate() {
      return new Promise(resolve => {
        if (this.value === '') {
          resolve(false);
        }

        resolve(true);
      });
    },
  },
};
</script>

<style></style>
