<template>
  <Page>
    <ActionBar title="Create an Account">
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
    </ActionBar>
    <DockLayout stretchLastChild="true">
      <ListPicker
        v-show="showDegreePicker"
        dock="bottom"
        height="200"
        backgroundColor="lightgray"
        :items="degreeNames"
        @selectedIndexChange="updateSelectedDegreeIndex($event.value)"
      />
      <!-- TODO: Make this fetch specialties when opened -->
      <ListPicker
        v-show="showSpecialtyPicker"
        dock="bottom"
        height="200"
        backgroundColor="lightgray"
        :items="specialtyNames"
        @selectedIndexChange="updateSelectedSpecialtyIndex($event.value)"
      />

      <!-- This is the main content, but it has to come after the content that gets
      docked to the bottom of the window -->
      <StackLayout>
        <TextField
          v-model="userInfo.first"
          hint="First Name"
          width="90%"
          marginTop="15"
          marginBottom="15"
        />
        <TextField
          v-model="userInfo.last"
          hint="Last Name"
          width="90%"
          marginBottom="15"
        />
        <TextField
          :text="selectedDegreeName"
          :editable="false"
          hint="Degree"
          width="90%"
          marginBottom="15"
          @focus="showDegreePicker = true"
          @blur="showDegreePicker = false"
        />
        <TextField
          :text="selectedSpecialtyName"
          :editable="false"
          hint="Specialty"
          width="90%"
          marginBottom="15"
          @focus="showSpecialtyPicker = true"
          @blur="showSpecialtyPicker = false"
        />
      </StackLayout>
    </DockLayout>

    <!-- <StackLayout>
      <TextField
        v-model="userInfo.first"
        hint="First Name"
        width="90%"
        marginTop="15"
        marginBottom="15"
      />
      <TextField
        v-model="userInfo.last"
        hint="Last Name"
        width="90%"
        marginBottom="15"
      />
      <Label
        text="stretch"
        verticalAlignment="stretch"
        backgroundColor="#43b883"
      />
      <ListPicker
        v-show="showDegreePicker"
        class="picker"
        :items="degreeNames"
        @selectedIndexChange="updateSelectedDegreeIndex($event.value)"
      />
      <Button
        text="Select Degree"
        @tap="showDegreePicker = !showDegreePicker"
      />
      <Button text="Select Specialty" @tap="fetchSpecialties" />
      <ListPicker v-show="showSpecialtyPicker" :items="specialtyNames" />
    </StackLayout> -->
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
      },
      degrees: [],
      selectedDegreeIndex: null,
      showDegreePicker: false,
      showSpecialtyPicker: false,
      specialties: [],
    };
  },

  computed: {
    // The ListPicker component's items attribute must be an array of strings. Since the
    // degrees array is an array of objects, this computed property extracts the names
    // of the degrees into a new array that we can bind to the ListPicker.
    degreeNames() {
      return this.degrees.map(degree => degree.Degree_Name);
    },

    specialtyNames() {
      return this.specialties.map(specialty => specialty.Specialty_Name);
    },

    // The ListPicker component only gives us access to the index of the selected degree
    // from the degrees array, so we need this computed property to get the degree's ID.
    selectedDegreeId() {
      if (!this.selectedDegreeIndex) return null;

      return this.degrees[this.selectedDegreeIndex].Degree_ID;
    },

    selectedDegreeName() {
      if (!this.selectedDegreeIndex) return null;

      return this.degrees[this.selectedDegreeIndex].Degree_Name;
    },

    selectedSpecialtyId() {
      if (!this.selectedSpecialtyIndex) return null;

      return this.specialties[this.selectedSpecialtyIndex].Specialty_ID;
    },

    selectedSpecialtyName() {
      if (!this.selectedSpecialtyIndex) return null;

      return this.specialties[this.selectedSpecialtyIndex].Specialty_Name;
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

    updateSelectedDegreeIndex(newIndex) {
      this.selectedDegreeIndex = newIndex;
    },

    updateSelectedSpecialtyIndex(newIndex) {
      this.selectedSpecialtyIndex = newIndex;
    },

    fetchSpecialties() {
      console.log('fetching specialties');
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
  },
};
</script>

<style scoped>
.picker {
  width: 95%;
  border-width: 1;
  border-color: red;
}
</style>
