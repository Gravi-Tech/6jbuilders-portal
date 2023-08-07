<template>
    <div class="not-found">
        <v-icon class="error-icon">mdi-emoticon-sad-outline</v-icon>
        <h1 class="error-number">404</h1>
        <p class="error-message">The page you are looking for doesn’t exist or an other error occurred.</p>
        <p class="redirect-message">Go back or head over to <a href="http://localhost:4000/">6jbuildersph.com</a>
            to choose a new direction.</p>
    </div>
</template>

<script>
export default {
    name: "NotFound",
};
</script>

<style scoped>
.not-found {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px 10px;
    text-align: center;
}

.error-icon {
    font-size: 80px;
    color: #9E9E9E;
}

.error-number {
    font-size: 120px;
    margin: 10px 0;
    color: #9E9E9E;
}

.error-message {
    font-size: 18px;
    color: #666;
}

.redirect-message {
    font-size: 16px;
    color: #888;
    margin-top: 16px;
}

.redirect-message a {
    color: #1e88e5;
    text-decoration: none;
}

.redirect-message a:hover {
    text-decoration: underline;
}
</style>
