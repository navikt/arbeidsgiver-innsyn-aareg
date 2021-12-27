import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from './App';

it('renders without crashing', () => {
    render(<App />);
});

expect.extend(toHaveNoViolations);

test('should have no a11y violations', async () => {
    const {container} = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
