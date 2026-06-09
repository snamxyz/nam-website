import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Blog — NAM Rewards",
  description:
    "News, updates, and stories from the NAM Rewards team.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28">
        <section className="relative py-24 md:py-32 px-6 overflow-hidden">
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(1,210,67,0.10) 0%, transparent 70%)",
            }}
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <span className="eyebrow mb-4 justify-center">Blog</span>
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold tracking-tight leading-[1.1]">
              Stories from the{" "}
              <span className="text-gradient-green">NAM community.</span>
            </h1>
            <p className="mt-4 text-foreground/50 text-base md:text-lg leading-relaxed">
              Updates, guides, and news about receipt mining and everyday crypto
              rewards.
            </p>

            <div className="mt-12 glass rounded-3xl p-10 md:p-12">
              <p className="text-sm font-semibold tracking-widest uppercase text-nam-green mb-3">
                Coming soon
              </p>
              <p className="text-foreground/55 leading-relaxed">
                We&apos;re working on our first posts. Check back soon for product
                updates, mining tips, and community highlights.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
