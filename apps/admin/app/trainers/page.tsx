import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Sidebar } from "../components/sidebar";

export const metadata = { title: "Trainers | Krave Admin" };

async function getTrainers() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: trainers } = await supabase
    .from("trainers")
    .select("*")
    .order("created_at", { ascending: false });

  // Default fallback trainer if table is not yet seeded in Supabase
  const defaultTrainer = {
    id: "default-shanthi",
    name: "Shanthi Ramakrishnamurthy",
    title: "Lead Trainer & Microgreens Specialist, Krave Microgreens",
    bio: "Shanthi is a passionate urban farming advocate and lead trainer at Krave Microgreens, helping home growers turn small balcony spaces into thriving, profitable microgreens businesses.",
    image_url: "/trainer.jpg",
    credentials: [
      "2,000+ students trained",
      "Featured in The Hindu & Economic Times",
      "Certified Organic Farmer",
    ],
  };

  const list = trainers && trainers.length > 0 ? trainers : [defaultTrainer];

  return { trainers: list };
}

export default async function TrainersPage() {
  const { trainers } = await getTrainers();

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#143623]">Trainer Profiles</h1>
            <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
              Manage webinar instructors and trainer bio credentials
            </p>
          </div>
          <Link
            href="/trainers/new"
            className="bg-[#1e5631] hover:bg-[#2d7d46] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1.5"
          >
            + New Trainer
          </Link>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainers.map((t: Record<string, any>) => {
              const isExternal = t.image_url?.startsWith("http");
              let imgPath = t.image_url || "/trainer.jpg";
              if (imgPath && !imgPath.startsWith("http") && !imgPath.includes(".")) {
                imgPath = `${imgPath.startsWith("/") ? "" : "/"}${imgPath}.jpg`;
              }

              return (
                <div
                  key={t.id}
                  className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      {/* Photo */}
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#1e5631] bg-emerald-50 flex-shrink-0 shadow-sm">
                        <Image
                          src={imgPath}
                          alt={t.name}
                          fill
                          unoptimized={isExternal}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#143623]">{t.name}</h3>
                        <p className="text-[#2d7d46] text-xs font-bold mt-0.5">{t.title}</p>
                      </div>
                    </div>

                    <p className="text-[#4a6b57] text-sm font-medium leading-relaxed mb-4 line-clamp-3">
                      {t.bio}
                    </p>

                    {/* Credentials */}
                    {t.credentials && t.credentials.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {t.credentials.map((c: string, idx: number) => (
                          <span
                            key={idx}
                            className="bg-[#edf6f0] border border-[#d0e6d6] text-[#1e5631] text-xs font-semibold px-2.5 py-1 rounded-lg"
                          >
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#e2efe6] flex justify-end">
                    <Link
                      href={`/trainers/${t.id}/edit`}
                      className="bg-white border border-[#e2efe6] hover:bg-[#f0f7f2] text-[#1e5631] font-bold text-xs px-4 py-2 rounded-xl transition-all"
                    >
                      ✏️ Edit Trainer Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
