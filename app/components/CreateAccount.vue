<template>
  <Page>
    <ActionBar title="Create an Account">
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
            <TextField v-model="firstName" class="input" />
            <StackLayout class="hr-light"></StackLayout>
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="Last Name" class="label m-b-5" />
            <TextField v-model="lastName" class="input" />
            <StackLayout class="hr-light"></StackLayout>
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="Email" class="label m-b-5" />
            <TextField v-model="email" class="input" />
            <StackLayout class="hr-light"></StackLayout>
          </StackLayout>

          <StackLayout class="input-field">
            <Label text="ZIP" class="label m-b-5" />
            <TextField v-model="zip" class="input" />
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
            class="btn btn-primary btn-rounded-sm"
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
      firstName: '',
      lastName: '',
      email: '',
      zip: '',
      degreeId: '',
      specialtyId: '',
      degrees: [],
      specialties: [],
      accountAwaitingApproval: false,
      // accountAwaitingApproval: appSettings.getBoolean(
      //   'accountAwaitingApproval',
      //   false
      // ),
    };
  },

  watch: {
    degreeId() {
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
      this.degreeId = this.$refs.degreePicker.nativeView.selectedValue;
    },

    fetchSpecialties() {
      httpModule
        .getJSON(
          `https://www.eeds.com/ajax_functions.aspx?Function_ID=88&Degree_ID=${this.degreeId}`
        )
        .then(response => {
          this.specialties = response;
        })
        .catch(err => {
          alert('Error fetching specialties.');
        });
    },

    setSpecialtyId() {
      this.specialtyId = this.$refs.specialtyPicker.nativeView.selectedValue;
    },

    createAccount() {
      this.accountAwaitingApproval = true;
      appSettings.setBoolean('accountAwaitingApproval', true);

      return;

      // Save the user's last name and email address so we can look them to see if their
      // account has been approved the next time they open the app.
      appSettings.setString('lastName', this.userInfo.last);
      appSettings.setString('email', this.userInfo.email);

      httpModule
        .request({
          url: 'https://www.eeds.com/ajax_functions.aspx',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          content: JSON.stringify({
            Function_ID: 6,
            Degree_ID: this.selectedDegreeId,
            Specialty_ID: this.selectedSpecialtyId,
            First_Name: this.userInfo.first,
            Last_Name: this.userInfo.last,
            ZIP: this.zip,
            deviceToken: 'iPhone_App_User',
            Email: this.userInfo.email,
          }),
        })
        .then(response => console.log(response));
    },
  },
};
</script>

<style></style>
