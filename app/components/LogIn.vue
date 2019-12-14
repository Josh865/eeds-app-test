<template>
  <Page>
    <ActionBar
      :title="`Log In with ${selectedLogInType.label}`"
      class="action-bar"
    >
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
    </ActionBar>

    <StackLayout class="form">
      <StackLayout class="input-field">
        <TextField
          v-model.trim="value"
          :hint="selectedLogInType.label"
          :autocorrect="false"
          :keyboardType="selectedLogInType.keyboardType"
          class="input"
          @loaded="showKeyboard"
        />
        <StackLayout class="hr-light" />
      </StackLayout>

      <Button
        text="Log In"
        class="btn btn-primary"
        marginTop="15"
        @tap="logIn"
      />
    </StackLayout>
  </Page>
</template>

<script>
const appSettings = require('application-settings');
const httpModule = require('tns-core-modules/http');
const platformModule = require('tns-core-modules/platform');
const utilsModule = require('tns-core-modules/utils/utils');

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
          keyboardType: 'phone',
        },
        email: {
          label: 'Email',
          url:
            'https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Email_Address=',
          keyboardType: 'email',
        },
        phone: {
          label: 'Phone',
          url:
            'https://www.eeds.com/ajax_functions.aspx?Function_ID=50&Phone_Number=',
          keyboardType: 'phone',
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
    // Show the keyboard as soon as the input is loaded. This is handled differently
    // depending on the platform. The destructured "object" variable is the TextField.
    showKeyboard({ object }) {
      if (platformModule.isAndroid) {
        setTimeout(() => {
          object.focus();
          utilsModule.showSoftInput(object);
        }, 10);
      } else {
        object.focus();
      }
    },

    async logIn() {
      this.busy = true;

      await this.validate();

      httpModule.getJSON(this.logInUrl).then(
        async response => {
          this.busy = false;

          if (response.PIN_Status !== true) {
            alert(
              `We couldn't find an account associated with the ${this.selectedLogInType.label} you entered.`
            );
            return;
          }

          // Prompt the user to confirm his/her last name before proceeding
          await this.confirmName(response);

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

    confirmName(response) {
      return new Promise((resolve, reject) => {
        action(
          'Select your last name',
          'Cancel Log In',
          response.Names_Array
        ).then(result => {
          if (result === response.Correct_Name) {
            resolve();
          } else {
            alert('Incorrect name selected.');
            reject();
          }
        });
      });
    },

    validate() {
      return new Promise((resolve, reject) => {
        // Make sure user entered a value
        if (this.value.length === 0) {
          alert(`Please enter your ${this.selectedLogInType.label}`);
          reject();
          return;
        }

        // Make sure PIN is exactly eight characters
        if (this.selectedLogInType.label === 'PIN' && this.value.length !== 8) {
          alert(`Your PIN should be exactly eight numbers long.`);
          reject();
          return;
        }

        // If we made it this far, everything checks out
        resolve();
      });
    },
  },
};
</script>

<style></style>
