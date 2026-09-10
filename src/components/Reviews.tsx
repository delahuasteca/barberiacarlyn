import { ArrowUpRight, MapPin, MessageSquareText, Star } from "lucide-react";
import { branches, branchMapsLink } from "@/lib/branches";
import { branchReviews } from "@/lib/reviews";

export default function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="relative scroll-mt-20 bg-brown py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-gold text-xs tracking-[0.4em] uppercase">Reseña</span>
          <div className="retro-line mx-auto mt-3 mb-6" />
          <h2 id="reviews-title" className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-5">
            Tu experiencia <span className="text-gradient-gold">cuenta</span>
          </h2>
          <p className="text-cream/70 max-w-2xl mx-auto leading-relaxed">
            ¿Ya nos visitaste? Elige la sucursal que te atendió, califica tu visita
            y cuéntanos cómo fue tu experiencia en Google Maps.
            Tu opinión nos ayuda a mejorar y a otros clientes a elegir.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <article key={branch.name} className="flex flex-col border border-gold/30 bg-gradient-to-b from-brown-medium/50 to-brown-dark p-7 sm:p-8 retro-glow">
              <Star className="w-8 h-8 text-gold mb-6" aria-hidden="true" />
              <h3 className="font-serif text-2xl text-cream mb-4">{branch.name}</h3>
              <p className="flex items-start gap-2 text-sm text-cream/70 leading-relaxed mb-7">
                <MapPin className="w-4 h-4 shrink-0 mt-1 text-gold" aria-hidden="true" />
                {branch.address}
              </p>
              <a href={branchReviews[branch.id]?.writeUrl || branchMapsLink(branch)} target="_blank" rel="noopener noreferrer"
                aria-label={`Abrir ${branch.name} en Google Maps para escribir una reseña (nueva pestaña)`}
                className="mt-auto inline-flex justify-center items-center gap-2 bg-gold text-brown-dark px-4 py-4 text-sm font-bold hover:bg-gold-light transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
                Opinar en Google Maps <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
        <p className="text-sm text-cream/60 text-center mt-6 leading-relaxed">
          En Google Maps, selecciona la sucursal y entra en “Reseñas” → “Escribir una reseña”.
        </p>

        <div className="mt-16 border-t border-gold/20 pt-12" aria-labelledby="read-reviews-title">
          <div className="max-w-2xl mb-8">
            <MessageSquareText className="w-8 h-8 text-gold mb-4" aria-hidden="true" />
            <h3 id="read-reviews-title" className="font-serif text-3xl text-cream mb-4">Lee las reseñas de nuestras sucursales</h3>
            <p className="text-cream/70 leading-relaxed">
              Un espacio para compartir la experiencia de nuestros clientes en cada sucursal.
              También puedes consultar sus opiniones en Google Maps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <article key={branch.id} className="flex flex-col border border-gold/25 bg-brown-dark/40 p-6">
                <h4 className="font-serif text-xl text-cream mb-6">{branch.name}</h4>
                <div className="space-y-6 mb-6">
                  {branchReviews[branch.id]?.reviews.length ? branchReviews[branch.id].reviews.map((review, index) => (
                    <div key={`${review.author}-${index}`} className="border-b border-gold/15 pb-6 last:border-0 last:pb-0">
                      {review.isExample && <p className="text-xs text-gold uppercase tracking-wider mb-4">Ejemplo · Reseña pendiente</p>}
                      {review.rating !== null ? (
                        <div className="flex gap-1 text-gold mb-4" role="img" aria-label={`${review.rating} de 5 estrellas`}>
                          {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`w-4 h-4 ${star <= review.rating! ? "fill-gold" : "opacity-30"}`} aria-hidden="true" />)}
                        </div>
                      ) : <p className="text-sm text-cream/50 mb-4">Sin calificación publicada</p>}
                      <blockquote className="text-cream/80 text-sm leading-relaxed mb-4">{review.text}</blockquote>
                      <p className="text-sm font-bold text-cream">{review.author}</p>
                      {review.date && <p className="text-xs text-cream/60 mt-1">{review.date}</p>}
                    </div>
                  )) : <p className="text-sm text-cream/60">Próximamente compartiremos las reseñas de esta sucursal.</p>}
                </div>
              <a href={branchReviews[branch.id]?.readUrl || branchMapsLink(branch)} target="_blank" rel="noopener noreferrer"
                aria-label={`Consultar reseñas de ${branch.name} en Google Maps (nueva pestaña)`}
                className="mt-auto flex items-center justify-between gap-4 border-t border-gold/25 pt-5 text-cream hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">
                <span>
                  <span className="text-sm text-gold">Consultar en Google Maps</span>
                </span>
                <ArrowUpRight className="w-5 h-5 text-gold shrink-0" aria-hidden="true" />
              </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
