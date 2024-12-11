import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import projectIcon from '@iconify-icons/eos-icons/project';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfigWithoutUsers = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Projects',
    path: '/dashboard/projects',
    icon: getIcon(projectIcon)
  }
];

export default sidebarConfigWithoutUsers;
