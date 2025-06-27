import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import AdicionarEntrevista from './adicionar-entrevista';
import { usePage } from '@inertiajs/react';

// resources/js/pages/interview/adicionar-entrevista.test.tsx

// Mock usePage para fornecer adminId
jest.mock('@inertiajs/react', () => ({
    ...jest.requireActual('@inertiajs/react'),
    usePage: jest.fn(),
    router: { visit: jest.fn() },
}));

// Mock window.location.search
const originalLocation = window.location;

beforeAll(() => {
    delete window.location;
    window.location = {
        ...originalLocation,
        search: '?id-candidatura=2&nome=Joao%20Silva&email=joao@email.com&telefone=48999999999&id-processo=1&id-vaga=10',
    } as any;
});

afterAll(() => {
    window.location = originalLocation;
});

describe('AdicionarEntrevista', () => {
    beforeEach(() => {
        (usePage as jest.Mock).mockReturnValue({
            props: { auth: { user: { id: 123 } } },
        });
        jest.clearAllMocks();
    });

    it('permite adicionar entrevista se id-candidatura=2', async () => {
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });
        global.fetch = mockFetch as any;

        render(<AdicionarEntrevista />);

        // Preencher campos
        fireEvent.change(screen.getByLabelText(/Data/i), { target: { value: '2024-06-10' } });
        fireEvent.change(screen.getByLabelText(/Horário/i), { target: { value: '14:30' } });
        fireEvent.change(screen.getByLabelText(/Local/i), { target: { value: 'Sala 1' } });

        // Submeter formulário
        fireEvent.submit(screen.getByRole('form'));

        // Verificar chamada do fetch
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                '/api/admin/123/candidacy/2/interview',
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data_hora: '2024-06-10T14:30:00',
                        status: 'Agendada',
                        localizacao: 'Sala 1',
                    }),
                    credentials: 'include',
                })
            );
        });

        // Verificar mensagem de sucesso e modal
        await waitFor(() => {
            expect(screen.getByText(/Entrevista cadastrada com sucesso/i)).toBeInTheDocument();
            expect(screen.getByText(/Entrevista adicionada com sucesso/i)).toBeInTheDocument();
        });
    });
});