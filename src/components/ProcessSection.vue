<template>
    <section class="process-section">
        <h2>Home Renovation Process</h2>
        <ul>
            <li v-for="(step, index) in steps" :key="index">{{ step }}</li>
        </ul>
    </section>
</template>
  
<script>
export default {
    props: {
        steps: Array,
    },
};
</script>
  
<style scoped>
.process-section {
    padding: 2rem;
}

.process-section h2 {
    margin-bottom: 1rem;
}

.process-section ul {
    list-style: decimal;
    margin-left: 1.5rem;
}

.process-section li {
    margin-bottom: 0.5rem;
}
</style>
  