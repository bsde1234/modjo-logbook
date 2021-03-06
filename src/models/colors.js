import mapValues from 'lodash/fp/mapValues';
import { createMuiTheme } from '@material-ui/core/styles';
import keys from 'lodash/fp/keys';

const palette = (main, light, dark, contrastText) => ({ main, light, dark, contrastText });

const colors = {
  yellow: {
    label: 'Jaune',
    palette: palette('#fdd835', '#ffff6b', '#c6a700', '#000000'),
    abbrev: 'y',
  },
  green: {
    label: 'Vert',
    palette: palette('#388e3c', '#6abf69', '#00600f', '#ffffff'),
    abbrev: 'g',
  },
  blue: {
    label: 'Bleu',
    palette: palette('#303f9f', '#666ad1', '#001970', '#ffffff'),
    abbrev: 'b',
  },
  red: {
    label: 'Rouge',
    palette: palette('#d32f2f', '#ff6659', '#9a0007', '#ffffff'),
    abbrev: 'r',
  },
  black: {
    label: 'Noir',
    palette: palette('#424242', '#6d6d6d', '#1b1b1b', '#ffffff'),
    abbrev: 'n',
  },
  white: {
    label: 'Blanc',
    palette: palette('#bdbdbd', '#efefef', '#8d8d8d', '#000000'),
    abbrev: 'w',
  },
  purple: {
    label: 'Violet',
    palette: palette('#ab47bc', '#df78ef', '#790e8b', '#ffffff'),
    abbrev: 'p',
  },
};

export default colors;

export const colorKeys = keys(colors);

export const defaultColor = {
  label: 'Default',
  palette: palette('#33b1ac', '#6ee3de', '#00817d', '#000000'), // original modjo
};

export const getPalette = color => (colors[color] || defaultColor).palette;
export const getLabel = color => (colors[color] ? colors[color].label : '');

const themeFromColor = ({ palette }) => createMuiTheme({ palette: { primary: palette } });

const themes = mapValues(
  themeFromColor,
  { ...colors, [null]: defaultColor },
);

export const getMuiTheme = color => themes[color] || themes.null;
