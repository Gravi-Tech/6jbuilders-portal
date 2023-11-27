<template>
    <SystemHeader />
    <PageNotFound />
    <SystemFooter />
</template>

<script scoped>
import SystemHeader from '../components/SystemHeader.vue';
import PageNotFound from '../components/404.vue';
import SystemFooter from '../components/SystemFooter.vue';

export default {
    components: {
        SystemHeader,
        PageNotFound,
        SystemFooter,
    },
};
</script>