import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from '../pages/Contact';

describe('Contact Page', () => {
  const renderContact = () => {
    return render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );
  };

  it('renders the contact page heading and description', () => {
    renderContact();
    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
    expect(screen.getByText('Consultation Enquiry')).toBeInTheDocument();
  });

  it('renders contact details including phone, email, and website', () => {
    renderContact();
    expect(screen.getByText('+91 91606 66534')).toBeInTheDocument();
    expect(screen.getByText('info@sarovar.com')).toBeInTheDocument();
    expect(screen.getByText('www.sarovar.com')).toBeInTheDocument();
  });

  it('renders intent selection chips', () => {
    renderContact();
    expect(screen.getByText('Site Visit')).toBeInTheDocument();
    expect(screen.getByText('Pricing Details')).toBeInTheDocument();
    expect(screen.getByText('Brochure')).toBeInTheDocument();
  });

  it('shows validation error when mobile number is too short', () => {
    const { container } = renderContact();
    const nameInput = container.querySelector('input[type="text"]');
    const emailInput = container.querySelector('input[type="email"]');
    const mobileInput = container.querySelector('input[type="tel"]');
    const form = container.querySelector('form');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(mobileInput, { target: { value: '12345' } });
    fireEvent.submit(form);

    expect(screen.getByText('Enter a valid 10-digit mobile number.')).toBeInTheDocument();
  });

  it('submits form successfully and shows enquiry confirmation', async () => {
    const { container } = renderContact();
    const nameInput = container.querySelector('input[type="text"]');
    const emailInput = container.querySelector('input[type="email"]');
    const mobileInput = container.querySelector('input[type="tel"]');
    const form = container.querySelector('form');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(mobileInput, { target: { value: '9876543210' } });
    fireEvent.submit(form);

    expect(await screen.findByText('Enquiry Received!')).toBeInTheDocument();
    expect(screen.getByText(/Our relationship manager will call you within 24 hours/i)).toBeInTheDocument();
  });
});
