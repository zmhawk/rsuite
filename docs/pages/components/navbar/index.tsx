import * as React from 'react';
import { Navbar, Nav, Button, Icon, Dropdown } from 'rsuite';
import DefaultPage from '@/components/Page';

export default function Page() {
  return <DefaultPage dependencies={{ Navbar, Nav, Button, Icon, Dropdown }} />;
}
