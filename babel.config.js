module.exports = function (api) {
   api.cache(true);
   return {
      presets: ['babel-preset-expo'],
      plugins: [
         [
            'module-resolver',
            {
               root: ['./src'],
               alias: {
                  components: './src/components',
                  consts: './src/consts',
                  styles: './src/styles',
               },
            },
         ],
         'react-native-reanimated/plugin',
      ],
   };
};
