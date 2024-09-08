import { render, fireEvent } from '@testing-library/react';
import ContactPage from '@/app/contact/page';

describe('ContactPage', () => {
  it('renders the contact form', () => {
    const { getByLabelText, getByRole } = render(<ContactPage />);
    
    // Vérifier que les champs du formulaire sont bien présents
    expect(getByLabelText(/Votre email/i)).toBeInTheDocument();
    expect(getByLabelText(/Sujet/i)).toBeInTheDocument();
    expect(getByLabelText(/Votre message/i)).toBeInTheDocument();
    
    // Vérifier que le bouton est présent
    expect(getByRole('button', { name: /envoyer le message/i })).toBeInTheDocument();
  });

  it('submits the form with valid input', () => {
    const { getByLabelText, getByRole } = render(<ContactPage />);

    // Remplir les champs du formulaire
    fireEvent.change(getByLabelText(/Votre email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText(/Sujet/i), { target: { value: 'Problème technique' } });
    fireEvent.change(getByLabelText(/Votre message/i), { target: { value: 'Mon message de test' } });

    // Simuler l'envoi du formulaire
    fireEvent.click(getByRole('button', { name: /envoyer le message/i }));

    // Vous pouvez ajouter des attentes supplémentaires pour voir ce qui se passe après la soumission
    // Ex: vérifier que les données soumises sont loggées dans la console
  });

  it('shows error message on empty fields', () => {
    const { getByRole } = render(<ContactPage />);

    // Soumettre sans remplir le formulaire
    fireEvent.click(getByRole('button', { name: /envoyer le message/i }));

    // Attendez que des messages d'erreur soient affichés
    expect(getByRole('alert')).toBeInTheDocument();
  });
});
