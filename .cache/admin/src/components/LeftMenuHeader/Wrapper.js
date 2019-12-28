import styled from 'styled-components';
import PropTypes from 'prop-types';

import Logo from '../../assets/images/logo-strapi.png';

const Wrapper = styled.div`
  background: ${props => props.theme.main.colors.leftMenu['link-hover']};
  height: ${props => props.theme.main.sizes.header.height};
  background: linear-gradient(100deg, #1c5de7, #1c91e7);

  .leftMenuHeaderLink {
    &:hover {
      text-decoration: none;
    }
  }

  .projectName {
    display: block;
    height: 100%;
    width: 100%;
    text-align: center;
    height: ${props => props.theme.main.sizes.header.height};
    vertical-align: middle;
    font-size: 2rem;
    letter-spacing: 0.2rem;
    color: $white;

    background-image: url(${Logo});
    background-repeat: no-repeat;
    background-position: center center;
    background-size: auto 3rem;
  }
`;

Wrapper.defaultProps = {
  theme: {
    main: {
      colors: {
        leftMenu: {},
      },
      sizes: {
        header: {},
        leftMenu: {},
      },
    },
  },
};

Wrapper.propTypes = {
  theme: PropTypes.object,
};

export default Wrapper;
