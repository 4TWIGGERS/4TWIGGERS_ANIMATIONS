import { StyleSheet } from 'react-native';

import styles from './styles';

const shortcuts = {
   p: 'padding',
   m: 'margin',
   l: 'left',
   r: 'right',
   t: 'top',
   b: 'bottom',
   x: 'horizontal',
   y: 'vertical',
   h: 'height',
   w: 'width',
   f: 'fontSize',
   z: 'zIndex',
};

const DSS = new Proxy(styles, {
   get(target, prop, _) {
      if (target.hasOwnProperty(prop)) return target[prop];
      const style = {};
      const match = prop.match(/(^\D+)(\d+)/i);
      if (match) {
         const [, charPart, numPart] = match;
         let styleKey = charPart.split('').reduce((final, currChar) => {
            const keyName = shortcuts[currChar];
            return final + keyName[0].toUpperCase() + keyName.slice(1);
         }, '');
         styleKey = styleKey[0].toLowerCase() + styleKey.slice(1);
         style[styleKey] = +numPart;
         Object.assign(target, StyleSheet.create({ [prop]: style }));
      }
      return target[prop];
   },
});

export default DSS;
