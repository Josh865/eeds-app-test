<template>
  <Page>
    <ActionBar :title="title" class="action-bar">
      <NavigationButton
        text="Go back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
    </ActionBar>
    <WebView height="100%" width="100%" :src="url" />
  </Page>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: 'eeds',
    },
  },

  data() {
    return {};
  },
};
</script>
