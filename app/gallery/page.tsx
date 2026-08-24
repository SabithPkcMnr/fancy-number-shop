import { reviews } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta(
  "VIP Number Reviews from Customers in India",
  "Read reviews from people who bought VIP and fancy mobile numbers from Fancy Number Shop in Mukkom, Calicut, Kerala.",
  "/gallery",
);

const mosaics = [
  { digits: "98 8888 8888", tone: "from-teal-700 to-cyan-500" },
  { digits: "786 786 7860", tone: "from-emerald-700 to-lime-500" },
  { digits: "90 90 90 9091", tone: "from-indigo-700 to-violet-500" },
  { digits: "99 9999 0001", tone: "from-amber-600 to-orange-500" },
  { digits: "70 70 70 9758", tone: "from-sky-700 to-blue-500" },
  { digits: "1234 3219", tone: "from-rose-600 to-pink-500" },
];

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-azure">From customers</p>
      <h1 className="font-display text-5xl mt-2">Reviews</h1>
      <p className="text-muted mt-3 max-w-xl">{site.stats.rating} average from collectors who stayed until the SIM lit up.</p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mosaics.map((item) => (
          <div key={item.digits} className={`h-52 rounded-2xl bg-gradient-to-br ${item.tone} grid place-items-center text-white`}>
            <p className="font-display text-3xl number-digits">{item.digits}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-4xl mt-16 mb-8">What they wrote</h2>
      <div className="grid md:grid-cols-2 gap-5">
        {reviews.map((review) => (
          <blockquote key={review.name} className="card-surface p-6">
            <p className="text-azure text-sm font-semibold uppercase tracking-wider">
              {review.rating} · {review.city}
            </p>
            <p className="mt-3 text-lg leading-relaxed">“{review.text}”</p>
            <footer className="mt-4 text-sm text-muted">
              {review.name} · {review.date}
            </footer>
          </blockquote>
        ))}
      </div>
    </div>
  );
}
