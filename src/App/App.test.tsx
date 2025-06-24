import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from './App';

expect.extend(toHaveNoViolations);

beforeEach(() => {
    window.history.pushState({}, '', '/arbeidsforhold');
});

it('renders without crashing', () => {
    render(<App />);
});

test('should have no a11y violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});