import { base } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: Montserrat;
  }
  
  a {
    text-decoration: none;
    :hover, :visited, :active {
      text-decoration: none;
      color: black;
    }
  }
`;

export const theme = deepMerge(base, {
  global: {
    colors: {
      background: 'white',
      black: '#000000',
      // border: {
      //   dark: 'rgba(255,255,255,0.33)',
      //   light: 'rgba(0,0,0,0.33)',
      // },
      brand: '#FFA91A',
      // control: {
      //   dark: 'accent-1',
      //   light: 'brand',
      // },
      focus: '#FD6FFF',
      placeholder: '#cbcbcd',
      text: {
        dark: '#444444',
        light: '#444444',
      },
      white: '#FFFFFF',
      'accent-1': '#FD6FFF',
      'accent-2': '#61EC9F',
      'accent-3': '#60EBE1',
      'accent-4': '#FFCA58',
      'dark-1': '#333333',
      'dark-2': '#444444',
      'dark-3': '#555555',
      'dark-4': '#666666',
      'dark-5': '#777777',
      'dark-6': '#999999',
      'light-1': '#F6F6F6',
      'light-2': '#EEEEEE',
      'light-3': '#DDDDDD',
      'light-4': '#CCCCCC',
      'light-5': '#BBBBBB',
      'light-6': '#AAAAAA',
      'neutral-1': '#3D138D',
      'neutral-2': '#BE60EB',
      'neutral-3': '#00C781',
      'neutral-4': '#6194EB',
      'neutral-5': '#FFB202',
      'status-critical': '#EB6060',
      'status-error': '#EB6060',
      'status-warning': '#F7E463',
      'status-ok': '#7CD992',
      'status-unknown': '#a8a8a8',
      'status-disabled': '#a8a8a8',
      bodyBackground: '#f9f9fa',
      border: {
        dark: '#e0e0e6',
        light: '#e0e0e6',
      },
    },
    anchor: {
      textDecoration: 'none',
      fontWeight: 600,
      color: {
        dark: '#6194EB',
        light: '#1D67E3',
      },
      hover: {
        textDecoration: 'none',
      },
    },
  },
  button: {
    primary: {
      color: 'brand',
    },
    border: {
      radius: '5px',
      width: 0,
      color: 'transparent',
    },
    padding: {
      vertical: '2px',
      horizontal: '10px',
    },
  },
  control: {
    border: {
      width: 0,
    },
  },
});
