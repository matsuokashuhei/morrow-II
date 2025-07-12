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

  it('has proper semantic structure', () => {
    const { container } = render(<App />);
    
    // Check for semantic HTML elements
    const header = container.querySelector('header');
    const main = container.querySelector('main');
    const nav = container.querySelector('nav');
    
    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();
    expect(nav).toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<App />);
    
    // Check main container has proper classes
    const mainContainer = container.querySelector('.min-h-screen.bg-gray-50');
    expect(mainContainer).toBeInTheDocument();
  });
});
