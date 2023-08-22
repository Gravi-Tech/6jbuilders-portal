import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/6jbuilders/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/6jbuilders/about-us',
      name: 'about-us',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/6jbuilders/projects',
      name: 'projects',
      component: () => import('../views/ProjectView.vue')
    },
    {
      path: '/6jbuilders/book',
      name: 'book',
      component: () => import('../views/BookNowView.vue')
    },
    {
      path: '/6jbuilders/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/6jbuilders/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/6jbuilders/legal/:page',
      name: 'legal',
      component: () => import('../views/LegalView.vue'),
    },
    {
      path: '/6jbuilders/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/6jbuilders/password-recovery',
      name: 'password-recovery',
      meta: { requiresAuth: false },
      component: () => import('../views/PasswordRecoveryView.vue')
    },
    {
      path: '/6jbuilders/project/details/:id',
      name: 'project-details',
      component: () => import('../views/ProjectDetailsView.vue')
    },
    {
      path: '/6jbuilders/services/cabinets',
      name: 'cabinets',
      component: () => import('../views/CabinetsServiceView.vue')
    },
    {
      path: '/6jbuilders/services/drywall-installation',
      name: 'drywall-installation',
      component: () => import('../views/DrywallInstallationServiceView.vue')
    },
    {
      path: '/6jbuilders/services/electrical',
      name: 'electrical',
      component: () => import('../views/ElectricalServiceView.vue')
    },
    {
      path: '/6jbuilders/services/glass-and-aluminum-installation',
      name: 'glass-and-aluminum-installation',
      component: () => import('../views/GlassAndAluminumInstallationServiceView.vue')
    },
    {
      path: '/6jbuilders/services/home-repair-services',
      name: 'home-repair-services',
      component: () => import('../views/HomeRepairServicesView.vue')
    },
    {
      path: '/6jbuilders/services/home-renovation',
      name: 'home-renovation',
      component: () => import('../views/HomeRenovationServiceView.vue')
    },
    {
      path: '/6jbuilders/services/interior-design',
      name: 'interior-design',
      component: () => import('../views/InteriorDesignServiceView.vue')
    },
    {
      path: '/6jbuilders/services/plumbing',
      name: 'plumbing',
      component: () => import('../views/PlumbingServiceView.vue')
    },
    {
      path: '/6jbuilders/services/roofing',
      name: 'roofing',
      component: () => import('../views/RoofingServiceView.vue')
    },
    {
      path: '/6jbuilders/services/tile-installation',
      name: 'tile-installation',
      component: () => import('../views/TileInstallationServiceView.vue')
    },
    {
      path: '/6jbuilders/services/welding',
      name: 'welding',
      component: () => import('../views/WeldingServiceView.vue')
    },
    {
      path: '/6jbuilders/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/PageNotFoundView.vue'),
    },
    {
      path: '/6jbuilders/step/details/:stepId',
      name: 'StepDetails',
      component: () => import('../views/StepDetailsView.vue'),
    },
  ]
})

router.beforeEach((to, from, next) => {
  const routeName = to.name
    ? to.name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    : 'Home';
  document.title = `6J Builders - ${routeName}`;
  next();
});

export default router
