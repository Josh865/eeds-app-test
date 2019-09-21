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
      <CreateAccountCompleted v-if="accountAwaitingApproval" />

      <GridLayout v-else>
        <GridLayout class="content">
          <StackLayout width="90%" marginTop="20">
            <StackLayout marginBottom="20">
              <!-- <Label text="First Name" marginBottom="3" /> -->
              <TextField v-model="firstName" hint="First Name" />
            </StackLayout>

            <StackLayout marginBottom="20">
              <!-- <Label text="Last Name" marginBottom="3" /> -->
              <TextField v-model="lastName" hint="Last Name" />
            </StackLayout>

            <StackLayout marginBottom="20">
              <!-- <Label text="Email" marginBottom="3" /> -->
              <TextField v-model="email" hint="Email" />
            </StackLayout>

            <StackLayout marginBottom="20">
              <!-- <Label text="ZIP" marginBottom="3" /> -->
              <TextField v-model="zip" hint="ZIP Code" />
            </StackLayout>

            <PickerField
              ref="degreePicker"
              for="degree in degrees"
              hint="Degree"
              pickerTitle="Select Your Degree"
              textField="Degree_Name"
              valueField="Degree_ID"
              marginBottom="20"
              @textChange="setDegreeId"
            >
              <v-template>
                <Label :text="degree.Degree_Name" padding="15" fontSize="16" />
              </v-template>
            </PickerField>

            <PickerField
              ref="specialtyPicker"
              for="specialty in specialties"
              hint="Specialty"
              pickerTitle="Select Your Specialty"
              textField="Specialty_Name"
              valueField="Specialty_ID"
              modalAnimated="true"
              @textChange="setSpecialtyId"
            >
              <v-template>
                <Label
                  :text="specialty.Specialty_Name"
                  padding="15"
                  fontSize="16"
                />
              </v-template>
            </PickerField>

            <Button
              text="Create Account"
              androidElevation="0"
              class="btn"
              marginTop="40"
              @tap="createAccount"
            />
          </StackLayout>
        </GridLayout>
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

<style scoped>
.text-input {
  border-width: 1;
  border-style: solid;
  border-color: lightgray;
  border-radius: 3;
  padding: 10;
}

.btn {
  border-color: blue;
  background-color: blue;
  color: white;
}
</style>
