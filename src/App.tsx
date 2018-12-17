import React, { Component } from 'react';
import { Box, Grommet } from 'grommet';
import { grommet } from 'grommet/themes';
import { theme, GlobalStyle } from './theme';

import Body from './layout/Body';
import Header from './layout/Header';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Grommet theme={theme} full>
          <Box fill="true" align="center">
            <Header />
            <Body />
          </Box>
          <GlobalStyle/>
        </Grommet>
      </div>
    );
  }
}

export default App;
