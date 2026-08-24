import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-lighter">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-orange to-primary-blue text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center animate-slideUp">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-primary mb-6 text-white">
              Encontre seu 
              <span className="text-secondary-yellow"> Companheiro</span> 
              <br />
              Perfeito 🐾
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Conectamos corações. Milhares de cães e gatos estão esperando por uma família amorosa. 
              Que tal ser você a fazer a diferença na vida de um pet?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="large" variant="success" className="shadow-xl">
                🐕 Adotar um Pet
              </Button>
              <Button size="large" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-orange">
                💝 Cadastrar Pet
              </Button>
            </div>
            
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold font-primary text-secondary-yellow">2.847</div>
                <div className="text-sm text-white/80">Pets Adotados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-primary text-secondary-yellow">156</div>
                <div className="text-sm text-white/80">Famílias Felizes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold font-primary text-secondary-yellow">89</div>
                <div className="text-sm text-white/80">Pets Disponíveis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pets em Destaque */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-primary font-semibold text-neutral-dark mb-4">
              Pets Esperando por 
              <span className="text-primary-orange"> Você</span>
            </h2>
            <p className="text-lg text-neutral-medium max-w-2xl mx-auto">
              Conheça alguns dos nossos amigos peludos que estão prontos para encher sua casa de amor e alegria.
            </p>
          </div>
          
          {/* Grid de Pets Mockados */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {mockPets.map((pet, index) => (
              <PetCard key={index} pet={pet} />
            ))}
          </div>
          
          <div className="text-center">
            <Button size="large" variant="primary">
              Ver Todos os Pets Disponíveis
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-green text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-primary font-semibold mb-6">
              Pronto para Mudar uma Vida? 💚
            </h2>
            <p className="text-lg mb-8 text-white/90">
              O processo de adoção é simples, seguro e pensado no bem-estar dos animais. 
              Cadastre-se e comece sua jornada como tutor responsável hoje mesmo.
            </p>
            <Button size="large" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-green">
              Começar Processo de Adoção
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Componente de Card do Pet (temporário)
function PetCard({ pet }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition hover-lift">
      <div className="h-48 bg-gradient-to-br from-neutral-light to-neutral-lighter flex items-center justify-center">
        <span className="text-6xl">{pet.emoji}</span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold font-primary text-neutral-dark mb-2">
          {pet.name}
        </h3>
        <p className="text-neutral-medium mb-2">{pet.breed} • {pet.age}</p>
        <p className="text-sm text-neutral-medium mb-4 line-clamp-2">
          {pet.description}
        </p>
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            pet.gender === 'Macho' ? 'bg-primary-blue/10 text-primary-blue' : 'bg-secondary-coral/10 text-secondary-coral'
          }`}>
            {pet.gender}
          </span>
          <Button size="small" variant="outline">
            Ver Detalhes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Dados mockados para demonstração
const mockPets = [
  {
    name: "Bella",
    breed: "Labrador",
    age: "2 anos",
    gender: "Fêmea",
    emoji: "🐕",
    description: "Uma cadela carinhosa e brincalhona, perfeita para famílias com crianças. Adora correr no parque!"
  },
  {
    name: "Milo",
    breed: "Vira-lata",
    age: "1 ano",
    gender: "Macho",
    emoji: "🐶",
    description: "Filhote cheio de energia, muito inteligente e fácil de treinar. Busca uma família ativa."
  },
  {
    name: "Luna",
    breed: "Siamês",
    age: "3 anos",
    gender: "Fêmea",
    emoji: "🐱",
    description: "Gata elegante e carinhosa, ideal para apartamentos. Adora carinho e tem um miado melodioso."
  },
  {
    name: "Thor",
    breed: "Pitbull",
    age: "4 anos",
    gender: "Macho",
    emoji: "🐕‍🦺",
    description: "Cão protetor e leal, excelente com crianças. Precisa de tutor experiente e espaço para brincar."
  },
  {
    name: "Nina",
    breed: "Persa",
    age: "2 anos",
    gender: "Fêmea",
    emoji: "😸",
    description: "Gata calma e companheira, perfeita para quem busca um pet tranquilo. Adora um cantinho no sol."
  },
  {
    name: "Rex",
    breed: "Pastor Alemão",
    age: "5 anos",
    gender: "Macho",
    emoji: "🐕‍🦺",
    description: "Cão inteligente e obediente, ideal para tutores que gostam de atividades ao ar livre."
  }
];
