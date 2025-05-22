import { Container } from '@material-ui/core';
import { render, screen } from '@testing-library/react';
import React from 'react';

describe('new', () => {
  it.only('bips', () => {
    render(<Container />);
    screen.debug();
  });
});
