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
        <StackLayout>
          <StackLayout
            padding="10"
            borderBottomWidth="1"
            borderColor="lightgray"
          >
            <Label text="First Name" fontSize="12" />
            <TextField
              v-model="firstName"
              borderBottomWidth="1"
              borderColor="transparent"
            />
          </StackLayout>

          <StackLayout
            padding="10"
            borderBottomWidth="1"
            borderColor="lightgray"
          >
            <Label text="Last Name" fontSize="12" />
            <TextField
              v-model="lastName"
              borderBottomWidth="1"
              borderColor="transparent"
            />
          </StackLayout>

          <StackLayout
            padding="10"
            borderBottomWidth="1"
            borderColor="lightgray"
          >
            <Label text="Email" fontSize="12" />
            <TextField
              v-model="email"
              borderBottomWidth="1"
              borderColor="transparent"
            />
          </StackLayout>

          <StackLayout
            padding="10"
            borderBottomWidth="1"
            borderColor="lightgray"
          >
            <Label text="ZIP Code" fontSize="12" />
            <TextField
              v-model="zip"
              borderBottomWidth="1"
              borderColor="transparent"
            />
          </StackLayout>

          <StackLayout
            padding="10"
            borderBottomWidth="1"
            borderColor="lightgray"
          >
            <Label text="Degree" fontSize="12" />
            <PickerField
              ref="degreePicker"
              for="degree in degrees"
              pickerTitle="Select Your Degree"
              textField="Degree_Name"
              valueField="Degree_ID"
              borderBottomWidth="1"
              borderBottomColor="transparent"
              @textChange="setDegreeId"
            >
              <v-template>
                <Label :text="degree.Degree_Name" padding="15" fontSize="16" />
              </v-template>
            </PickerField>
          </StackLayout>

          <StackLayout
            padding="10"
            borderBottomWidth="1"
            borderColor="lightgray"
          >
            <Label text="Specialty" fontSize="12" />
            <PickerField
              ref="specialtyPicker"
              for="specialty in specialties"
              pickerTitle="Select Your Specialty"
              textField="Specialty_Name"
              valueField="Specialty_ID"
              modalAnimated="true"
              borderBottomWidth="1"
              borderBottomColor="transparent"
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
          </StackLayout>

          <Button
            text="Create Account"
            androidElevation="0"
            class="btn"
            marginTop="40"
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
