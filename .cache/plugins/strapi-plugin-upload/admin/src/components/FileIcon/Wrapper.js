import styled from 'styled-components';

const Wrapper = styled.div`
  font-size: 20px;
  color: ${({ type }) => {
    switch (type) {
      case 'file-o-pdf':
        return '#E26D6D';
      case 'file-image-o':
        return '#8AA066';
      case 'file-video-o':
        return '#77C69E';
      case 'file-code-o':
        return '#515A6D';
      case 'ile-archive-o':
        return '#715A31';
      default:
        return '#BDBFC2';
    }
  }};
`;

export default Wrapper;
