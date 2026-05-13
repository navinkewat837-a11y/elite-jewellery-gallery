import { generalWhatsAppUrl } from "./contact";

export function WhatsAppFAB() {
  return (
    <a
      href={generalWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-luxe transition-transform hover:scale-110"
    >
      <span className="absolute h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30" />
      <svg viewBox="0 0 32 32" className="relative h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.003 3C9.374 3 4 8.373 4 15c0 2.387.701 4.611 1.905 6.477L4 29l7.7-1.857A11.94 11.94 0 0 0 16.003 27C22.628 27 28 21.627 28 15S22.628 3 16.003 3zm0 21.6a9.6 9.6 0 0 1-4.876-1.327l-.35-.207-4.566 1.1 1.123-4.453-.227-.36A9.6 9.6 0 1 1 16.003 24.6zm5.49-7.2c-.3-.15-1.78-.879-2.057-.978-.276-.1-.477-.15-.678.15-.2.3-.776.978-.951 1.179-.176.2-.351.225-.652.075-.3-.15-1.27-.469-2.42-1.494-.894-.798-1.498-1.784-1.674-2.084-.176-.3-.019-.462.131-.611.135-.135.3-.351.452-.526.15-.176.2-.301.3-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.633-.928-2.235-.244-.587-.493-.508-.677-.518l-.577-.01a1.105 1.105 0 0 0-.802.376c-.276.301-1.053 1.029-1.053 2.51s1.078 2.911 1.228 3.112c.15.2 2.122 3.241 5.142 4.546.719.31 1.28.495 1.717.633.722.23 1.379.197 1.898.12.579-.087 1.78-.728 2.032-1.43.252-.701.252-1.302.176-1.43-.075-.125-.276-.2-.577-.351z" />
      </svg>
    </a>
  );
}
