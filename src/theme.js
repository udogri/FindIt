import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#e6f0ff',
    100: '#bfd8ff',
    200: '#99c0ff',
    300: '#73a8ff',
    400: '#4d90ff',
    500: '#2678ff', // Primary blue
    600: '#1f60cc',
    700: '#174899',
    800: '#0f3066',
    900: '#081833',
  },
  accent: {
    50: '#fff5e6',
    100: '#ffe0b3',
    200: '#ffcc80',
    300: '#ffb84d',
    400: '#ffa31a',
    500: '#e69100', // Accent orange
    600: '#b37100',
    700: '#805100',
    800: '#4d3000',
    900: '#1a1000',
  },
  neutral: {
    50: '#f7f7f7',
    100: '#ededed',
    200: '#e0e0e0',
    300: '#d1d1d1',
    400: '#c2c2c2',
    500: '#b3b3b3',
    600: '#8c8c8c',
    700: '#666666',
    800: '#404040',
    900: '#1a1a1a',
  },
};

const fonts = {
  heading: `'Inter', sans-serif`,
  body: `'Inter', sans-serif`,
};

const components = {
  Button: {
    baseStyle: {
      borderRadius: 'lg',
      _focus: {
        boxShadow: 'none',
      },
    },
    variants: {
      solid: (props) => ({
        bg: props.colorScheme === 'brand' ? 'brand.500' : 'gray.700',
        color: 'white',
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.600' : 'gray.800',
          _disabled: {
            bg: props.colorScheme === 'brand' ? 'brand.500' : 'gray.700',
          },
        },
      }),
      outline: (props) => ({
        borderColor: props.colorScheme === 'brand' ? 'brand.500' : 'gray.400',
        color: props.colorScheme === 'brand' ? 'brand.500' : 'gray.700',
        _hover: {
          bg: props.colorScheme === 'brand' ? 'brand.50' : 'gray.50',
        },
      }),
    },
  },
  Input: {
    baseStyle: {
      field: {
        borderRadius: 'lg',
        _focus: {
          borderColor: 'brand.500',
          boxShadow: '0 0 0 1px brand.500',
        },
      },
    },
  },
  Textarea: {
    baseStyle: {
      borderRadius: 'lg',
      _focus: {
        borderColor: 'brand.500',
        boxShadow: '0 0 0 1px brand.500',
      },
    },
  },
  Select: {
    baseStyle: {
      field: {
        borderRadius: 'lg',
        _focus: {
          borderColor: 'brand.500',
          boxShadow: '0 0 0 1px brand.500',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      borderRadius: 'xl',
      boxShadow: 'md',
    },
  },
  Modal: {
    baseStyle: {
      header: {
        fontWeight: 'bold',
        fontSize: 'xl',
      },
      body: {
        padding: 6,
      },
      footer: {
        padding: 6,
      },
    },
  },
};

const theme = extendTheme({
  colors,
  fonts,
  components,
  styles: {
    global: {
      body: {
        bg: 'neutral.50',
        color: 'neutral.800',
      },
    },
  },
});

export default theme;
