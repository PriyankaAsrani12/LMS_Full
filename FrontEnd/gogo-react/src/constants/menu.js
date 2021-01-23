import { adminRoot } from './defaultValues';

const data = [
  {
    id: 'dashboards',
    icon: 'iconsminds-shop-4',
    label: 'menu.dashboards',
    to: `/app/mydashboard`,
  },

  {
    id: 'sessions',
    icon: 'simple-icon-earphones-alt',
    label: 'Sessions',
    to: `${adminRoot}/dashboard`,
  },
  {
    id: 'Stats',
    icon: 'iconsminds-statistic',
    label: 'Stats',
    to: `${adminRoot}/stats`,
  },
  {
    id: 'Communication',
    icon: 'simple-icon-phone',
    label: 'Communication',
    to: `${adminRoot}/communication`,
    label: 'menu.badges',
  },

  {
    id: 'Library',
    icon: 'iconsminds-library',
    label: 'Library',
    to: `${adminRoot}/library`,
  },

  {
    id: 'lms-theme',
    icon: 'iconsminds-gear',
    label: 'Settings',
    to: `${adminRoot}/themesetting`,
  },

  {
    id: 'Support',
    icon: 'iconsminds-support',
    label: 'Support',
    to: `${adminRoot}/support`,
  },

  {
    id: 'logout',
    icon: 'iconsminds-close',
    label: 'Logout',
    to: `/Tutor/user/login`,
  },
];
export default data;
