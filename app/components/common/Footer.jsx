export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-[#1e40af]">
          © {new Date().getFullYear()} Imam Mohammad ibn Saud Islamic University. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
