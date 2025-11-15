export default function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 px-6 md:px-20 text-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-neutral-800">
        Kontakt
      </h2>
      <p className="max-w-3xl mx-auto text-neutral-600 text-base md:text-lg mb-6">
        Hast du Fragen oder möchtest einen Termin vereinbaren? Wir sind für dich
        da!
      </p>
      <div className="space-y-2 text-neutral-600 text-base md:text-lg">
        <p>
          E-Mail:{" "}
          <a
            href="mailto:test@gmail.com"
            className="text-amber-600 hover:underline"
          >
            <strong>test@gmail.com</strong>
          </a>
        </p>
        <p>
          Telefon:{" "}
          <a href="tel:+49123456789" className="text-amber-600 hover:underline">
            <strong>+49 123 456789</strong>
          </a>
        </p>
        <p>
          Adresse:{" "}
          <span className="text-amber-600 font-semibold">
            Musterstraße 1, 12345 Musterstadt
          </span>
        </p>
        <p>
          Öffnungszeiten:{" "}
          <span className="text-amber-600 font-semibold">
            Mo-Fr: 9:00–18:00 Uhr, Sa: 9:00–14:00 Uhr
          </span>
        </p>
      </div>
    </section>
  );
}
