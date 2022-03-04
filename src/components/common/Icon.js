import PropTypes from 'prop-types';

import React from 'react';
import { Image } from 'react-native';
import { IMAGES } from 'consts';

const Icon = ({ name, size = 24, style = {}, ...rest }) => {
   const [width, height] = [size, size];

   return <Image source={IMAGES[name]} style={[{ width, height }, style]} {...rest} />;
};

Icon.propTypes = {
   name: PropTypes.oneOf(Object.keys(IMAGES)),
};

export default Icon;
