import { fetchPets, getPetStats } from "@/lib/pets";
import { PublicPetCatalog } from "./PublicPetCatalog";

/**
 * Public Pet Catalog Page - Server Component
 * Requirements: 4.1-4.9 (Public catalog with filters)
 */

export async function generateMetadata({ searchParams }) {
  const filters = {
    species: searchParams?.species || "",
    size: searchParams?.size || "",
    gender: searchParams?.gender || "",
    location: searchParams?.location || "",
    search: searchParams?.search || searchParams?.q || "",
    page: searchParams?.page || "1",
    limit: searchParams?.limit || "12",
  };

  // Build dynamic title based on filters
  let title = "Adote um Pet";
  const titleParts = [];

  if (filters.species === "DOG") titleParts.push("Cachorros");
  else if (filters.species === "CAT") titleParts.push("Gatos");

  if (filters.size === "SMALL") titleParts.push("Pequenos");
  else if (filters.size === "MEDIUM") titleParts.push("Médios");
  else if (filters.size === "LARGE") titleParts.push("Grandes");

  if (filters.location) titleParts.push(`em ${filters.location}`);
  if (filters.search) titleParts.push(`"${filters.search}"`);

  if (titleParts.length > 0) {
    title = `${titleParts.join(" ")} - Adote um Pet`;
  }

  // Build description
  let description = "Encontre seu companheiro perfeito! ";
  if (titleParts.length > 0) {
    description += `Veja ${titleParts.join(" ").toLowerCase()} disponíveis para adoção.`;
  } else {
    description += "Navegue por centenas de pets esperando por um novo lar.";
  }

  return {
    title,
    description,
    keywords: [
      "adoção de pets",
      "cachorros para adoção",
      "gatos para adoção",
      "animais para adoção",
      "pets disponíveis",
      "adotar cachorro",
      "adotar gato",
      ...(filters.location ? [filters.location] : []),
      ...(filters.search ? [filters.search] : []),
    ].join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/images/og-pets.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-pets.jpg"],
    },
  };
}

export default async function PetsPage({ searchParams = {} }) {
  // Parse search parameters into filters
  const filters = {
    species: searchParams?.species || "",
    size: searchParams?.size || "",
    gender: searchParams?.gender || "",
    location: searchParams?.location || "",
    search: searchParams?.search || searchParams?.q || "",
    page: searchParams?.page || "1",
    limit: searchParams?.limit || "12",
  };

  // Fetch initial data on the server
  const [petsData, stats] = await Promise.all([
    fetchPets(filters),
    getPetStats(),
  ]);

  // Handle server-side errors gracefully
  if (petsData.error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erro ao carregar pets</h1>
          <p className="text-gray-600 mb-6">
            Ocorreu um erro ao buscar os pets disponíveis. Tente novamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Encontre seu companheiro perfeito
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-6">
              {stats.totalAvailable > 0
                ? `${stats.totalAvailable} pet${stats.totalAvailable !== 1 ? "s" : ""} esperando por um novo lar`
                : "Pets esperando por um novo lar"}
            </p>

            {/* Quick Stats */}
            {(stats.bySpecies.DOG || stats.bySpecies.CAT) && (
              <div className="flex justify-center gap-8 text-center">
                {stats.bySpecies.DOG && (
                  <div>
                    <div className="text-3xl font-bold">
                      {stats.bySpecies.DOG}
                    </div>
                    <div className="text-primary-200">Cachorros</div>
                  </div>
                )}
                {stats.bySpecies.CAT && (
                  <div>
                    <div className="text-3xl font-bold">
                      {stats.bySpecies.CAT}
                    </div>
                    <div className="text-primary-200">Gatos</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Catalog Content */}
      <main className="container mx-auto px-4 py-8">
        <PublicPetCatalog
          initialPets={petsData.pets}
          initialPagination={petsData.pagination}
          initialFilters={filters}
          stats={stats}
        />
      </main>
    </div>
  );
}
