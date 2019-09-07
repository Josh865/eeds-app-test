<template>
  <Page>
    <ActionBar title="Create an Account">
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
    </ActionBar>

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

          <StackLayout>
            <Label text="Degree" marginBottom="3" />
            <Button
              :text="selectedDegreeName"
              androidElevation="0"
              borderColor="black"
              @tap="openDegreePicker"
            />
          </StackLayout>

          <StackLayout>
            <Label text="Specialty" marginBottom="3" />
            <Button
              :text="selectedSpecialtyName"
              androidElevation="0"
              borderColor="black"
              @tap="openSpecialtyPicker"
            />
          </StackLayout>
        </StackLayout>
      </GridLayout>

      <!-- Modal that displays degree and specialty list pickers -->
      <AbsoluteLayout v-if="showModal" class="modal-wrapper" @tap="closeModal">
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
              @selectedIndexChange="updateSelectedSpecialtyIndex($event.value)"
            />
          </StackLayout>
        </FlexboxLayout>
      </AbsoluteLayout>
    </GridLayout>
  </Page>
</template>

<script>
const httpModule = require('tns-core-modules/http');

export default {
  components: {
    //
  },

  data() {
    return {
      userInfo: {
        first: '',
        last: '',
        email: '',
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

  computed: {
    // The ListPicker component's items attribute must be an array of strings. Since the
    // degrees array is an array of objects, this computed property extracts the names
    // of the degrees into a new array that we can bind to the ListPicker.
    // degreeNames() {
    //   const degreeNames = this.degrees.map(degree => degree.Degree_Name);
    //   // Add a "placeholder" as the first item in the array so it will be selected by default
    //   return ['Select Your Degree', ...degreeNames];
    // },
    // specialtyNames() {
    //   return this.specialties.map(specialty => specialty.Specialty_Name);
    // },
    // The ListPicker component only gives us access to the index of the selected degree
    // from the degrees array, so we need this computed property to get the degree's ID.
    // selectedDegreeId() {
    //   // The first item in the degree ListPicker is the label, so it gets ignored
    //   if (this.selectedDegreeIndex === 0) return null;
    //   return this.degrees[this.selectedDegreeIndex].Degree_ID;
    // },
    // selectedDegreeName() {
    //   if (this.selectedDegreeIndex === 0) return null;
    //   return this.degrees[this.selectedDegreeIndex].Degree_Name;
    // },
    // selectedSpecialtyId() {
    //   if (!this.selectedSpecialtyIndex) return null;
    //   return this.specialties[this.selectedSpecialtyIndex].Specialty_ID;
    // },
    // selectedSpecialtyName() {
    //   if (!this.selectedSpecialtyIndex) return null;
    //   return this.specialties[this.selectedSpecialtyIndex].Specialty_Name;
    // },
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

        this.fetchSpecialties();

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
  },
};
</script>

<style scoped>
.text-input {
  border-width: 1;
  border-style: solid;
  border-color: lightgray;
  border-radius: 3;
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
</style>
