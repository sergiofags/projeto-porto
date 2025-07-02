import axios from 'axios';
import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Button } from '@/components/ui/button';
import HeadingSmall from '@/components/heading-small';

const documentos = [
  { label: 'Atestado de matrícula ou frequência', name: 'AtestadoMatricula' },
  { label: 'Histórico escolar', name: 'HistoricoEscolar' },
  { label: 'Currículo', name: 'Curriculo' },
  { label: 'Coeficiente de Rendimento (CR)', name: 'CoeficienteRendimento' },
];

export default function Documents() {
  const { auth } = usePage().props as any;
  const personId = auth.user.id;

  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    setFiles({ ...files, [name]: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);

    try {
      for (const doc of documentos) {
        const file = files[doc.name];
        if (file) {
          const formData = new FormData();
          formData.append('tipo_documento', 'Candidatura');
          formData.append('nome_documento', doc.name);
          formData.append('documento', file);

          await axios.post(
            `http://localhost:8000/api/person/${personId}/document`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          );
        }
      }
      setSuccess('Documentos enviados com sucesso!');
    } catch (err) {
      setSuccess('Erro ao enviar documentos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <Head title="Documentos" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Documentos" description="Anexe seus documentos em PDF" />
          <form onSubmit={handleSubmit} className="space-y-4">
            {documentos.map((doc) => (
              <div key={doc.name} className="flex flex-col gap-2">
                <label className="font-semibold">{doc.label}</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={e => handleFileChange(e, doc.name)}
                  required
                />
              </div>
            ))}
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Salvar Documentos'}
            </Button>
            {success && <p className="text-center mt-2">{success}</p>}
          </form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}