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
      <GridLayout :class="{ 'modal-open': showModal }">
        <GridLayout class="content">
          <StackLayout width="90%" marginTop="20">
            <StackLayout marginBottom="20">
              <Label text="First Name" marginBottom="3" />
              <TextField
                v-model="userInfo.first"
                hint="First Name"
                class="text-input"
              />
            </StackLayout>

            <StackLayout marginBottom="20">
              <Label text="Last Name" marginBottom="3" />
              <TextField
                v-model="userInfo.last"
                hint="Last Name"
                class="text-input"
              />
            </StackLayout>

            <StackLayout marginBottom="20">
              <Label text="Email" marginBottom="3" />
              <TextField
                v-model="userInfo.email"
                hint="Email"
                class="text-input"
              />
            </StackLayout>

            <StackLayout marginBottom="20">
              <Label text="ZIP" marginBottom="3" />
              <TextField
                v-model="userInfo.zip"
                hint="ZIP Code"
                class="text-input"
              />
            </StackLayout>

            <StackLayout marginBottom="20">
              <Label text="Degree" marginBottom="3" />
              <Button
                :text="selectedDegreeName"
                androidElevation="0"
                class="text-input"
                @tap="openDegreePicker"
              />
            </StackLayout>

            <StackLayout>
              <Label text="Specialty" marginBottom="3" />
              <Button
                :text="selectedSpecialtyName"
                androidElevation="0"
                class="text-input"
                @tap="openSpecialtyPicker"
              />
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

        <!-- Modal that displays degree and specialty list pickers -->
        <AbsoluteLayout
          v-if="showModal"
          class="modal-wrapper"
          @tap="closeModal"
        >
          <FlexboxLayout width="100%" justifyContent="center">
            <StackLayout v-if="showDegreePicker" class="modal">
              <Label text="Select Your Degree" />
              <ListPicker
                :items="degreeNames"
                :selectedIndex="selectedDegreeIndex"
                @selectedIndexChange="updateSelectedDegreeIndex($event.value)"
              />
            </StackLayout>

            <StackLayout v-if="showSpecialtyPicker" class="modal">
              <Label text="Select Your Specialty" />
              <ListPicker
                :items="specialtyNames"
                :selectedIndex="selectedSpecialtyIndex"
                @selectedIndexChange="
                  updateSelectedSpecialtyIndex($event.value)
                "
              />
            </StackLayout>
          </FlexboxLayout>
        </AbsoluteLayout>
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
        first: '',
        last: '',
        email: '',
        zip: '',
      },
      degrees: [],
      degreeNames: [],
      selectedDegreeIndex: 0,
      selectedDegreeName: 'Select Your Degree',
      selectedDegreeId: null,
      specialties: [],
      specialtyNames: [],
      selectedSpecialtyIndex: 0,
      selectedSpecialtyName: 'Select Your Specialty',
      selectedSpecialtyId: null,
      showDegreePicker: false,
      showSpecialtyPicker: false,
      showModal: false,
    };
  },

  watch: {
    selectedDegreeId(newVal, oldVal) {
      if (newVal != oldVal) {
        // Get rid of the old values related to the specialty
        this.resetSpecialityValues();

        // Get the specialties available for the newly selected degree
        this.fetchSpecialties();
      }
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
          this.degreeNames = this.degrees.map(degree => degree.Degree_Name);
        })
        .catch(err => {
          alert('Error fetching degrees.');
        });
    },

    updateSelectedDegreeIndex(newIndex) {
      this.selectedDegreeIndex = newIndex;
    },

    updateSelectedSpecialtyIndex(newIndex) {
      this.selectedSpecialtyIndex = newIndex;
    },

    fetchSpecialties() {
      httpModule
        .getJSON(
          `https://www.eeds.com/ajax_functions.aspx?Function_ID=88&Degree_ID=${this.selectedDegreeId}`
        )
        .then(response => {
          this.specialties = response;
          this.specialtyNames = this.specialties.map(
            specialty => specialty.Specialty_Name
          );
        })
        .catch(err => {
          alert('Error fetching specialties.');
        });
    },

    openDegreePicker() {
      // Make sure the specialty picker is closed so they don't appear at the same time
      this.showSpecialtyPicker = false;

      this.showModal = true;
      this.showDegreePicker = true;
    },

    openSpecialtyPicker() {
      // Make sure the degree picker is closed so they don't appear at the same time
      this.showDegreePicker = false;

      this.showModal = true;
      this.showSpecialtyPicker = true;
    },

    closeModal() {
      this.showModal = false;

      // Stuff to do if they just chose a degree
      if (this.showDegreePicker) {
        this.selectedDegreeId = this.degrees[
          this.selectedDegreeIndex
        ].Degree_ID;

        this.selectedDegreeName = this.degrees[
          this.selectedDegreeIndex
        ].Degree_Name;

        this.showDegreePicker = false;
      }

      // Stuff to do if they just chose a specialty
      if (this.showSpecialtyPicker) {
        this.selectedSpecialtyId = this.specialties[
          this.selectedSpecialtyIndex
        ].Specialty_ID;

        this.selectedSpecialtyName = this.specialties[
          this.selectedSpecialtyIndex
        ].Specialty_Name;

        this.showSpecialtyPicker = false;
      }
    },

    // This prevents any weirdness when the user switches their specialty after making an
    // initial selection.
    resetSpecialityValues() {
      this.selectedSpecialtyIndex = 0;
      this.specialties = [];
      this.specialtyNames = [];
      this.selectedSpecialtyName = 'Select Your Specialty';
    },

    createAccount() {
      this.$navigateTo(CreateAccountCompleted, {
        props: {
          // pin: response.PIN,
        },
      });

      return;

      appSettings.setBoolean('accountAwaitingApproval', true);

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

@keyframes show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-open .content {
  opacity: 0.2;
}

.modal-open .modal-wrapper {
  visibility: visible;
  animation-name: show;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}

.modal-wrapper {
  visibility: collapse;
  opacity: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  width: 90%;
  margin-top: 100;
  margin-left: auto;
  margin-right: auto;
  padding: 10;
  border-width: 0;
  border-radius: 5;
  border-color: black;
  background-color: white;
}

.btn {
  border-color: blue;
  background-color: blue;
  color: white;
}
</style>
