import { motion } from "framer-motion";
import Image from "next/image";

const team = [
  { name: "Anna Müller", role: "Senior Stylistin", img: "/team_1.png" },
  { name: "Lukas Schmidt", role: "Color Specialist", img: "/team_2.jpg" },
  { name: "Sophie Weber", role: "Junior Stylistin", img: "/team3.jpg" },
  { name: "Muster Frau", role: "Junior Stylistin", img: "/team1.png" },
];

export default function Team() {
  return (
    <section
      id="team"
      className="py-16 md:py-24 px-6 md:px-20 bg-white text-center"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-neutral-800">
        Unser Team
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        {team.map((member, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-2xl border border-neutral-200 bg-neutral-100 hover:shadow-xl transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
          >
            <div className="relative aspect-3/4 w-full mb-4">
              <Image
                src={member.img}
                alt={member.name}
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                quality={75}
              />
            </div>
            <h3 className="text-xl font-semibold mb-1 text-amber-600">
              {member.name}
            </h3>
            <p className="text-neutral-600">{member.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
