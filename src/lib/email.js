import nodemailer from 'nodemailer';

// Create transporter based on environment configuration
function createTransporter() {
  if (process.env.SENDGRID_API_KEY) {
    // SendGrid configuration
    return nodemailer.createTransporter({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else if (process.env.SMTP_HOST) {
    // SMTP configuration
    return nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  throw new Error('Email configuration not found');
}

const transporter = createTransporter();

// Email templates
const emailTemplates = {
  welcomeAdopter: (name) => ({
    subject: 'Bem-vindo ao PetAdopt!',
    html: `
      <h1>Olá, ${name}!</h1>
      <p>Bem-vindo ao PetAdopt! Obrigado por se juntar à nossa comunidade de pessoas que amam animais.</p>
      <p>Agora você pode navegar pelos pets disponíveis e manifestar interesse em adoção.</p>
      <p>Com carinho,<br>Equipe PetAdopt</p>
    `
  }),
  
  adoptionRequest: (petName, adopterName, adoptionId) => ({
    subject: `Nova solicitação de adoção para ${petName}`,
    html: `
      <h1>Nova solicitação de adoção!</h1>
      <p><strong>${adopterName}</strong> manifestou interesse em adotar <strong>${petName}</strong>.</p>
      <p>Acesse sua dashboard para revisar a solicitação e tomar uma decisão.</p>
      <p><a href="${process.env.APP_URL}/dashboard/adoptions/${adoptionId}">Ver Solicitação</a></p>
    `
  }),
  
  adoptionApproved: (petName) => ({
    subject: `Sua solicitação de adoção foi aprovada!`,
    html: `
      <h1>Parabéns!</h1>
      <p>Sua solicitação para adotar <strong>${petName}</strong> foi aprovada!</p>
      <p>O proprietário entrará em contato em breve para finalizar o processo de adoção.</p>
      <p>Obrigado por dar uma nova chance para um animalzinho!</p>
    `
  }),
  
  adoptionRejected: (petName, reason) => ({
    subject: `Sobre sua solicitação de adoção`,
    html: `
      <h1>Sobre sua solicitação para ${petName}</h1>
      <p>Infelizmente, sua solicitação não foi aprovada desta vez.</p>
      ${reason ? `<p><strong>Motivo:</strong> ${reason}</p>` : ''}
      <p>Não desista! Há muitos outros pets esperando por uma família.</p>
      <p><a href="${process.env.APP_URL}/pets">Ver outros pets</a></p>
    `
  }),
};

// Send email function
export async function sendEmail({ to, template, templateData, subject, html }) {
  try {
    let emailContent;
    
    if (template && templateData) {
      emailContent = emailTemplates[template](templateData);
    } else {
      emailContent = { subject, html };
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@petadopt.com',
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Specific email functions
export async function sendWelcomeEmail(email, name) {
  return sendEmail({
    to: email,
    template: 'welcomeAdopter',
    templateData: name
  });
}

export async function sendAdoptionRequestEmail(ownerEmail, { petName, adopterName, adoptionId }) {
  return sendEmail({
    to: ownerEmail,
    template: 'adoptionRequest',
    templateData: { petName, adopterName, adoptionId }
  });
}

export async function sendAdoptionStatusEmail(adopterEmail, { petName, status, reason }) {
  const template = status === 'APPROVED' ? 'adoptionApproved' : 'adoptionRejected';
  const templateData = status === 'APPROVED' ? petName : { petName, reason };
  
  return sendEmail({
    to: adopterEmail,
    template,
    templateData
  });
}