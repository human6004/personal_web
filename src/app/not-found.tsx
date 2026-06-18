import { InternalLink } from "@/components/ui/internal-link";

export default function NotFound() {
  return (
    <section className="mx-auto grid min-h-[70dvh] max-w-3xl place-items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="grid gap-6">
        <p className="text-sm font-medium text-[var(--muted)]">404</p>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
          Trang này chưa có trong sổ tay.
        </h1>
        <p className="mx-auto max-w-xl text-[var(--muted)]">
          Có thể link đã đổi hoặc nội dung chưa được xuất bản. Quay về trang chủ
          để tiếp tục đọc những phần đã sẵn sàng.
        </p>
        <div className="flex justify-center">
          <InternalLink href="/" variant="solid">
            Back home
          </InternalLink>
        </div>
      </div>
    </section>
  );
}
