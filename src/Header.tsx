import React, {FunctionComponent} from 'react';
import {Link} from 'react-router-dom';
import {Anchor, Box, Image} from 'grommet';
import logo from './logo.png';
import {User} from './common/models/user';
import {PERMISSIONS} from './common/constants';
import adminRoutes from './admin/routes'
import invoicesRoutes from './invoices/routes'
import contactsRoutes from './contacts/routes'
import userRoutes from './user/routes'

interface MenuItem {
  label: string,
  route: string,
  external?: boolean
}

interface HeaderProps {
  selectedRoute: string,
  loggedInUser: User | null,
  push: (route: string) => void
}

const Header: FunctionComponent<HeaderProps> = (props) => {

  const { selectedRoute, push, loggedInUser } = props;
  let mainMenuItems: MenuItem[] = [];
  const commonItems = [
    { label: 'Invoices', route: invoicesRoutes.index },
    { label: 'Contacts', route: contactsRoutes.index },
    { label: 'Logout', route: userRoutes.logout, external: true },
  ];

  if (loggedInUser) {
    mainMenuItems.push(...commonItems)

    if (loggedInUser.permissions.includes(PERMISSIONS.CAN_MANAGE_ACCOUNTS)) {
      mainMenuItems.unshift(
          {label: 'Admin', route: adminRoutes.accounts},
      )
    }
  }

  console.log(props)

  return <Box
    justify="center"
    align="center"
    height="xsmall"
    fill="horizontal"
  >
    <Box
      direction="row"
      fill="vertical"
      align="center"
      justify="between"
      width="xlarge"
    >
      <Link label="Centrifuge" to="/" size="large">
        <Image src={logo}/>
      </Link>
      <Box direction="row" gap="small" fill align="center" justify="end">
        {mainMenuItems.map((item) => {
            const anchorProps = {
              ...(item.external ? { href: item.route } : { onClick: () => push(item.route) }),
              ...(selectedRoute === item.route ? { className: 'selected' } : {}),
            };
            return <Anchor
              key={item.label}
              label={item.label}
              {...anchorProps}
            />;
          },
        )}
      </Box>
    </Box>
  </Box>;
};

Header.displayName = 'Header';

export default Header
