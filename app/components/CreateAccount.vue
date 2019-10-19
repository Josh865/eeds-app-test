<template>
  <Page :actionBarHidden="accountAwaitingApproval">
    <ActionBar title="Create an Account" class="action-bar">
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
    </ActionBar>

    <ScrollView>
      <!-- If the user already created an account, don't show the form, but instead show a message informing them that their account is awaiting review -->
      <CreateAccountCompleted v-if="accountAwaitingApproval" />

      <GridLayout v-else>
        <StackLayout class="form">
          <StackLayout class="input-field">
            <Label text="First Name" class="label m-b-5" />
            <TextField v-model.trim="userInfo.firstName" class="input" />
            <StackLayout class="hr-light"></StackLayout>
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="Last Name" class="label m-b-5" />
            <TextField v-model.trim="userInfo.lastName" class="input" />
            <StackLayout class="hr-light"></StackLayout>
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="Email" class="label m-b-5" />
            <TextField
              v-model.trim="userInfo.email"
              class="input"
              keyboardType="email"
            />
            <StackLayout class="hr-light"></StackLayout>
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="ZIP" class="label m-b-5" />
            <TextField
              v-model.trim="userInfo.zip"
              class="input"
              keyboardType="number"
              maxLength="10"
            />
            <StackLayout class="hr-light"></StackLayout>
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="Degree" class="label m-b-5" />
            <PickerField
              ref="degreePicker"
              for="degree in degrees"
              pickerTitle="Select Your Degree"
              textField="Degree_Name"
              valueField="Degree_ID"
              class="input picker-field"
              @textChange="setDegreeId"
            >
              <v-template>
                <GridLayout class="list-group-item">
                  <Label :text="degree.Degree_Name" />
                </GridLayout>
              </v-template>
            </PickerField>
            <StackLayout class="hr-light"></StackLayout>
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="Specialty" class="label m-b-5" />
            <PickerField
              ref="specialtyPicker"
              for="specialty in specialties"
              pickerTitle="Select Your Specialty"
              textField="Specialty_Name"
              valueField="Specialty_ID"
              modalAnimated="true"
              class="input"
              @textChange="setSpecialtyId"
            >
              <v-template>
                <GridLayout class="list-group-item">
                  <Label :text="specialty.Specialty_Name" />
                </GridLayout>
              </v-template>
            </PickerField>
            <StackLayout class="hr-light"></StackLayout>
          </StackLayout>

          <Button
            text="Create Account"
            androidElevation="0"
            class="btn btn-primary btn-rounded-sm m-t-20"
            @tap="createAccount"
          />
        </StackLayout>
      </GridLayout>
    </ScrollView>
  </Page>
</template>

<script>
import CreateAccountCompleted from './CreateAccountCompleted';

const appSettings = require('application-settings');
const httpModule = require('tns-core-modules/http');

export default {
  components: {
    CreateAccountCompleted,
  },

  data() {
    return {
      userInfo: {
        firstName: '',
        lastName: '',
        email: '',
        zip: '',
        degreeId: '',
        specialtyId: '',
      },
      degrees: [],
      specialties: [],
      accountAwaitingApproval: false,
      // accountAwaitingApproval: appSettings.getBoolean(
      //   'accountAwaitingApproval',
      //   false
      // ),
    };
  },

  computed: {
    // This is simply so we can watch the degreeId property of the userInfo object
    selectedDegreeId() {
      return this.userInfo.degreeId;
    },
  },

  watch: {
    selectedDegreeId() {
      // Clear selected specialty since it may be incompatible with newly selected degree
      this.$refs.specialtyPicker.nativeView.selectedValue = null;

      // Get the specialties available for the selected degree
      this.fetchSpecialties();
    },
  },

  created() {
    this.fetchDegrees();
  },

  methods: {
    fetchDegrees() {
      httpModule
        .getJSON(`https://www.eeds.com/ajax_functions.aspx?Function_ID=142`)
        .then(response => {
          this.degrees = response;
        })
        .catch(err => {
          alert('Error fetching degrees.');
        });
    },

    setDegreeId() {
      this.userInfo.degreeId = this.$refs.degreePicker.nativeView.selectedValue;
    },

    fetchSpecialties() {
      httpModule
        .getJSON(
          `https://www.eeds.com/ajax_functions.aspx?Function_ID=88&Degree_ID=${this.userInfo.degreeId}`
        )
        .then(response => {
          this.specialties = response;
        })
        .catch(err => {
          alert('Error fetching specialties.');
        });
    },

    setSpecialtyId() {
      this.userInfo.specialtyId = this.$refs.specialtyPicker.nativeView.selectedValue;
    },

    createAccount() {
      const isValid = this.validate();

      if (!isValid) return;

      // FIXME: Only for testing
      this.CreateAccountCompleted = true;
      return;

      httpModule
        .request({
          url: 'https://www.eeds.com/ajax_functions.aspx',
          method: 'POST',
          content: this.formData(),
        })
        .then(response => {
          // This will hide the form and display component informing user their account
          // is awaiting approval.
          this.accountAwaitingApproval = true;

          // Save the user's last name and email address so we can look them to see if
          // their account has been approved the next time they open the app.
          appSettings.setString('lastName', this.userInfo.lastName);
          appSettings.setString('email', this.userInfo.email);
          appSettings.setBoolean('accountAwaitingApproval', true);
        })
        .catch(err => {
          alert('Error creating account.');
        });
    },

    validate() {
      if (!this.userInfo.firstName) {
        alert('Please enter your first name.');
        return false;
      }

      if (!this.userInfo.lastName) {
        alert('Please enter your last name.');
        return false;
      }

      if (!this.userInfo.email) {
        alert('Please enter your email address.');
        return false;
      }

      if (!this.userInfo.zip) {
        alert('Please enter your ZIP code.');
        return false;
      }

      if (!this.userInfo.degreeId) {
        alert('Please select your degree.');
        return false;
      }

      if (!this.userInfo.specialtyId) {
        alert('Please select your specialty.');
        return false;
      }

      // Basic regex test to make sure email format is valid
      const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/gm;
      const validEmail = emailRegEx.test(this.userInfo.email);

      if (!validEmail) {
        alert('Please enter a valid email address.');
        return false;
      }

      // Basic regex test to make sure zip code format is valid
      const zipRegEx = /^[0-9]{5}(?:-[0-9]{4})?$/gm;
      const validZip = zipRegEx.test(this.userInfo.zip);

      if (!validZip) {
        alert('Please enter your ZIP code in the format ##### or #####-####.');
        return false;
      }

      return true;
    },

    formData() {
      const formData = new FormData();

      formData.append('Function_ID', 6);
      formData.append('First_Name', this.userInfo.firstName);
      formData.append('Last_Name', this.userInfo.lastName);
      formData.append('Email', this.userInfo.email);
      formData.append('Degree_ID', this.userInfo.degreeId);
      formData.append('Specialty_ID', this.userInfo.specialtyId);
      formData.append('ZIP', this.userInfo.zip);
      formData.append('deviceToken', 'iPhone_App_User');

      return formData;
    },
  },
};
</script>

<style>
PickerPage ActionBar {
  background-color: #1c79e4;
  color: white;
}
</style>
