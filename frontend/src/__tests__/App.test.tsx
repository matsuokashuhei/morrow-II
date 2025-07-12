import { render } from '@testing-library/react';
import App from '../../App';

describe('App', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<App />);
    expect(getByText('Morrow')).toBeInTheDocument();
  });

  it('renders the navigation header', () => {
    const { getByText } = render(<App />);
    expect(getByText('ホーム')).toBeInTheDocument();
  });

  it('renders the HomeScreen component', () => {
    const { getByText } = render(<App />);
    expect(getByText('Welcome to Morrow!')).toBeInTheDocument();
  });
});
