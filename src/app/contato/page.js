'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Mensagem enviada com sucesso! Retornaremos em breve.');
    setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="py-16 bg-neutral-lighter min-h-screen">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-primary font-bold text-neutral-dark mb-6">
            Entre em 
            <span className="text-primary-orange"> Contato</span> 🐾
          </h1>
          <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
            Tem dúvidas sobre adoção? Quer cadastrar seu pet? Nossa equipe está aqui para ajudar!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Informações de Contato */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-primary font-semibold text-neutral-dark mb-4">
                📞 Fale Conosco
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-medium text-neutral-dark">Email</p>
                    <p className="text-neutral-medium">contato@petadopt.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-medium text-neutral-dark">WhatsApp</p>
                    <p className="text-neutral-medium">(11) 99999-9999</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🕒</span>
                  <div>
                    <p className="font-medium text-neutral-dark">Horário de Atendimento</p>
                    <p className="text-neutral-medium">Segunda à Sexta, 8h às 18h</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary-orange/10 rounded-xl p-6">
              <h3 className="text-xl font-primary font-semibold text-neutral-dark mb-4">
                💡 Dicas Importantes
              </h3>
              <ul className="space-y-2 text-sm text-neutral-medium">
                <li>• Seja específico sobre o tipo de pet que busca</li>
                <li>• Mencione se tem experiência com animais</li>
                <li>• Informe o espaço disponível em sua casa</li>
                <li>• Conte sobre sua rotina diária</li>
              </ul>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-primary font-semibold text-neutral-dark mb-6">
              Envie sua Mensagem
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Nome Completo"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Como podemos te chamar?"
                required
                icon="👤"
              />

              <Input
                label="E-mail"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                icon="📧"
              />

              <Input
                label="Telefone/WhatsApp"
                name="telefone"
                type="tel"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                icon="📱"
              />

              <Input
                label="Assunto"
                name="assunto"
                type="text"
                value={formData.assunto}
                onChange={handleChange}
                placeholder="Sobre o que você gostaria de falar?"
                required
                icon="💭"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-dark">
                  Mensagem <span className="text-error">*</span>
                </label>
                <textarea
                  name="mensagem"
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="Conte-nos mais detalhes..."
                  required
                  rows={4}
                  className="w-full p-4 border-2 border-neutral-light rounded-md focus:border-primary-orange focus:outline-none focus:ring-3 focus:ring-primary-orange/10 transition-all resize-vertical"
                />
              </div>

              <Button 
                type="submit" 
                size="large" 
                fullWidth 
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem 🚀'}
              </Button>
            </form>
          </div>
        </div>

        {/* FAQ Rápido */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-2xl font-primary font-semibold text-neutral-dark mb-6 text-center">
            Perguntas Frequentes 🤔
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-neutral-dark mb-2">Como adotar um pet?</h4>
              <p className="text-sm text-neutral-medium">Navegue pelos pets disponíveis, escolha um que combine com você e envie uma solicitação de adoção.</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-dark mb-2">Posso cadastrar meu pet?</h4>
              <p className="text-sm text-neutral-medium">Sim! Crie uma conta e cadastre pets para adoção de forma gratuita e segura.</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-dark mb-2">A adoção tem custo?</h4>
              <p className="text-sm text-neutral-medium">A plataforma é gratuita. Alguns pets podem ter taxa de adoção para cobrir cuidados veterinários.</p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-dark mb-2">Como funciona a aprovação?</h4>
              <p className="text-sm text-neutral-medium">O tutor atual avalia seu perfil e decide sobre a adoção baseado no bem-estar do animal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
