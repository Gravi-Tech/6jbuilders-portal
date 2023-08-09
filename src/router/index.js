import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about-us',
      name: 'about-us',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/book',
      name: 'book',
      component: () => import('../views/BookNowView.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/legal/:page',
      name: 'legal',
      component: () => import('../views/LegalView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/project/details/:id',
      name: 'project-details',
      component: () => import('../views/ProjectDetailsView.vue')
    },
    {
      path: '/services/cabinets',
      name: 'cabinets',
      component: () => import('../views/CabinetsServiceView.vue')
    },
    {
      path: '/services/drywall-installation',
      name: 'drywall-installation',
      component: () => import('../views/DrywallInstallationServiceView.vue')
    },
    {
      path: '/services/electrical',
      name: 'electrical',
      component: () => import('../views/ElectricalServiceView.vue')
    },
    {
      path: '/services/glass-and-aluminum-installation',
      name: 'glass-and-aluminum-installation',
      component: () => import('../views/GlassAndAluminumInstallationServiceView.vue')
    },
    {
      path: '/services/home-repair-services',
      name: 'home-repair-services',
      component: () => import('../views/HomeRepairServicesView.vue')
    },
    {
      path: '/services/home-renovation',
      name: 'home-renovation',
      component: () => import('../views/HomeRenovationServiceView.vue')
    },
    {
      path: '/services/interior-design',
      name: 'interior-design',
      component: () => import('../views/InteriorDesignServiceView.vue')
    },
    {
      path: '/services/plumbing',
      name: 'plumbing',
      component: () => import('../views/PlumbingServiceView.vue')
    },
    {
      path: '/services/roofing',
      name: 'roofing',
      component: () => import('../views/RoofingServiceView.vue')
    },
    {
      path: '/services/tile-installation',
      name: 'tile-installation',
      component: () => import('../views/TileInstallationServiceView.vue')
    },
    {
      path: '/services/welding',
      name: 'welding',
      component: () => import('../views/WeldingServiceView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/PageNotFoundView.vue'),
    },
    {
      path: '/step/details/:stepId',
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
  document.title = `6 JBUILDERS - ${routeName}`;
  next();
});

export default router
