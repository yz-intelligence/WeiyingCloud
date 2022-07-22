<template>
  <div>
    <keep-alive>
      <router-view class="page" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view class="page" v-if="!$route.meta.keepAlive" />
  </div>
</template>
