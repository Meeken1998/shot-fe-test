<template>
  <div class="homepage">
  </div>
</template>
<script lang="ts" setup>

</script>
<style lang="scss">
.homepage {
  width: 100%;

  .group {
    width: 100%;
    margin-top: 32px;
  }

  .group-info {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .buttons {
      display: flex;
      gap: 16px;
    }

    .title {
      font-size: 24px;
      font-weight: bold;
    }
  }
}

.cover-radius {
  border-radius: $borderRadius;
  height: 36px;
}

.userinfo {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 0;
}

.user-dropdown {
  width: 200px;
  font-weight: bold;
  user-select: none;
}

.ant-dropdown-menu {
  margin-top: 4px;
}

.disabled-menu {
  &:hover {
    background-color: inherit !important;
  }
}
</style>