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
          v-model="value"
          :hint="selectedLogInType.label"
          :autocorrect="false"
          :keyboardType="selectedLogInType.keyboardType"
          class="input"
        />
        <StackLayout class="hr-light" />
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
    async logIn() {
      this.busy = true;

      // Before proceeding, make sure the data the user entered is valid.
      const isValid = await this.validate();

      if (!isValid) {
        alert(`Please enter your ${this.selectedLogInType.label}`);
        return;
      }

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
